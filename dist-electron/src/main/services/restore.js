import { execa } from 'execa';
export class SystemRestoreService {
    async createRestorePoint(description = "All Updater Auto-Restore") {
        try {
            const timestamp = new Date().toLocaleString();
            const fullDescription = `${description} (${timestamp})`;
            // Use simpler command, but try to catch errors. 
            // Checkpoint-Computer requires admin. If it fails, it usually throws.
            // We adding -ErrorAction Stop to be sure.
            const result = await execa('powershell', [
                '-Command',
                `Checkpoint-Computer -Description "${fullDescription}" -RestorePointType "MODIFY_SETTINGS" -ErrorAction Stop`
            ]);
            // Log output for debugging
            if (result.stdout)
                console.log('[Restore] stdout:', result.stdout);
            if (result.stderr)
                console.error('[Restore] stderr:', result.stderr);
            return true;
        }
        catch (error) {
            console.error('[Restore] Failed to create restore point:', error);
            return false;
        }
    }
}
