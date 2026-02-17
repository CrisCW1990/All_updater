import { app, dialog, type WebContents } from 'electron';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type {
    AppUpdateDownloadProgress,
    AppUpdateDownloadResult,
    AppVersionCheckResult
} from '../../shared/types';

interface GitHubReleaseAsset {
    name: string;
    browser_download_url: string;
    digest?: string;
}

interface GitHubReleaseResponse {
    tag_name: string;
    html_url: string;
    assets: GitHubReleaseAsset[];
}

export class AppUpdateService {
    private readonly owner = 'Ixoman';
    private readonly repo = 'All_updater';
    private readonly versionCheckTimeoutMs = 12000;
    private readonly downloadTimeoutMs = 15 * 60 * 1000;

    private normalizeVersion(version: string): string {
        return version.trim().replace(/^v/i, '');
    }

    private compareVersions(left: string, right: string): number {
        const parse = (value: string) =>
            this.normalizeVersion(value)
                .split('.')
                .map(part => Number.parseInt(part, 10))
                .map(part => (Number.isFinite(part) ? part : 0));

        const leftParts = parse(left);
        const rightParts = parse(right);
        const max = Math.max(leftParts.length, rightParts.length, 3);

        for (let i = 0; i < max; i++) {
            const l = leftParts[i] ?? 0;
            const r = rightParts[i] ?? 0;
            if (l > r) return 1;
            if (l < r) return -1;
        }
        return 0;
    }

    private isNetworkError(message: string): boolean {
        return /fetch failed|network|enet|econn|enotfound|timed?out|offline|aborted|socket hang up/i.test(message);
    }

    private selectPreferredAsset(assets: GitHubReleaseAsset[]): GitHubReleaseAsset | undefined {
        const portableZip = assets.find(asset => /portable/i.test(asset.name) && /\.zip$/i.test(asset.name));
        if (portableZip) return portableZip;

        const portableExe = assets.find(asset => /portable/i.test(asset.name) && /\.exe$/i.test(asset.name));
        if (portableExe) return portableExe;

        const anyZip = assets.find(asset => /\.zip$/i.test(asset.name));
        if (anyZip) return anyZip;

        return assets.find(asset => /\.exe$/i.test(asset.name));
    }

    private extractSha256Digest(rawDigest?: string): string | undefined {
        if (!rawDigest) return undefined;
        const normalized = rawDigest.trim().toLowerCase();
        const match = normalized.match(/^sha256:([a-f0-9]{64})$/i);
        return match?.[1];
    }

    async checkLatestVersion(): Promise<AppVersionCheckResult> {
        const currentVersion = this.normalizeVersion(app.getVersion());
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.versionCheckTimeoutMs);

        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/releases/latest`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/vnd.github+json',
                        'User-Agent': 'All-Updater'
                    },
                    signal: controller.signal
                }
            );

            if (!response.ok) {
                return {
                    success: false,
                    hasUpdate: false,
                    currentVersion,
                    error: `GitHub API HTTP ${response.status}`
                };
            }

            const payload = (await response.json()) as GitHubReleaseResponse;
            const latestVersion = this.normalizeVersion(payload.tag_name || '');
            const hasUpdate = latestVersion
                ? this.compareVersions(latestVersion, currentVersion) > 0
                : false;
            const asset = this.selectPreferredAsset(payload.assets || []);

            return {
                success: true,
                hasUpdate,
                currentVersion,
                latestVersion,
                releaseUrl: payload.html_url,
                assetName: asset?.name,
                assetUrl: asset?.browser_download_url,
                assetSha256: this.extractSha256Digest(asset?.digest)
            };
        } catch (error) {
            const message = String(error);
            return {
                success: false,
                hasUpdate: false,
                currentVersion,
                offline: this.isNetworkError(message),
                error: message
            };
        } finally {
            clearTimeout(timer);
        }
    }

    private getUniqueFilePath(folderPath: string, fileName: string): string {
        const parsed = path.parse(fileName);
        let candidate = path.join(folderPath, fileName);
        let counter = 1;

        while (fs.existsSync(candidate)) {
            candidate = path.join(folderPath, `${parsed.name} (${counter})${parsed.ext}`);
            counter++;
        }

        return candidate;
    }

    private emitProgress(sender: WebContents, progress: AppUpdateDownloadProgress): void {
        sender.send('app-update:download-progress', progress);
    }

    private async computeSha256(filePath: string): Promise<string> {
        return await new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(filePath);
            stream.on('data', (chunk) => hash.update(chunk));
            stream.on('error', (error) => reject(error));
            stream.on('end', () => resolve(hash.digest('hex')));
        });
    }

    async downloadUpdateAsset(
        sender: WebContents,
        assetUrl: string,
        fileName: string,
        expectedSha256?: string
    ): Promise<AppUpdateDownloadResult> {
        if (!assetUrl || !fileName) {
            return { success: false, error: 'Missing asset URL or filename.' };
        }

        const folder = await dialog.showOpenDialog({
            title: 'Select download folder / Selecciona carpeta de descarga',
            defaultPath: app.getPath('downloads'),
            properties: ['openDirectory', 'createDirectory']
        });

        if (folder.canceled || folder.filePaths.length === 0) {
            return { success: false, canceled: true };
        }

        const targetFolder = folder.filePaths[0];
        const targetPath = this.getUniqueFilePath(targetFolder, fileName);
        const tempPath = `${targetPath}.part`;

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.downloadTimeoutMs);

        try {
            const response = await fetch(assetUrl, {
                method: 'GET',
                headers: { 'User-Agent': 'All-Updater' },
                redirect: 'follow',
                signal: controller.signal
            });

            if (!response.ok || !response.body) {
                return { success: false, error: `Download failed with HTTP ${response.status}` };
            }

            const totalBytes = Number.parseInt(response.headers.get('content-length') || '0', 10) || 0;
            let downloadedBytes = 0;

            const nodeReadable = Readable.fromWeb(
                response.body as unknown as Parameters<typeof Readable.fromWeb>[0]
            );
            nodeReadable.on('data', (chunk: Buffer) => {
                downloadedBytes += chunk.length;
                const percent = totalBytes > 0
                    ? Math.max(0, Math.min(100, Math.round((downloadedBytes / totalBytes) * 100)))
                    : null;

                this.emitProgress(sender, {
                    fileName,
                    downloadedBytes,
                    totalBytes,
                    percent
                });
            });

            await pipeline(nodeReadable, fs.createWriteStream(tempPath));
            fs.renameSync(tempPath, targetPath);

            this.emitProgress(sender, {
                fileName,
                downloadedBytes: totalBytes || downloadedBytes,
                totalBytes,
                percent: 100
            });

            if (expectedSha256) {
                const actualSha256 = await this.computeSha256(targetPath);
                const matches = actualSha256.toLowerCase() === expectedSha256.toLowerCase();
                if (!matches) {
                    try {
                        fs.unlinkSync(targetPath);
                    } catch {
                        // Ignore cleanup errors
                    }

                    return {
                        success: false,
                        error: 'HashMismatch: Downloaded file hash does not match expected release hash.',
                        hashExpected: expectedSha256,
                        hashActual: actualSha256
                    };
                }

                return {
                    success: true,
                    filePath: targetPath,
                    hashVerified: true,
                    hashExpected: expectedSha256,
                    hashActual: actualSha256
                };
            }

            return { success: true, filePath: targetPath, hashVerified: false };
        } catch (error) {
            try {
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            } catch {
                // ignore cleanup errors
            }

            return {
                success: false,
                error: String(error)
            };
        } finally {
            clearTimeout(timer);
        }
    }
}
