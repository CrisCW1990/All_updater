import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

// Necessary for ESM in Electron
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

// --- Persistencia Portable ---
// Si la app está empaquetada (portable), guardamos los datos localmente
if (app.isPackaged) {
    const portableDataPath = path.join(path.dirname(app.getPath('exe')), 'data');
    app.setPath('userData', portableDataPath);
}

// --- Refuerzo de Administrador ---
async function ensureElevated() {
    try {
        const { execa } = await import('execa');
        await execa('net', ['session'], { reject: true });
        return true;
    } catch {
        return false;
    }
}

let win: BrowserWindow | null
let isOperationActive = false;

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        title: "All Updater",
        icon: path.join(process.env.VITE_PUBLIC as string, 'logo.png')
    })

    // Protection against closing while updating
    win.on('close', (e) => {
        if (isOperationActive) {
            e.preventDefault();
            const choice = dialog.showMessageBoxSync(win!, {
                type: 'warning',
                buttons: ['Wait', 'Close Anyway (Dangerous)'],
                title: 'Operation in Progress',
                message: 'An application update or restore point is currently in progress. Closing the app now could leave your system or software in an unstable state.',
                detail: 'It is highly recommended to wait until the process finishes.',
                defaultId: 0,
                cancelId: 0
            });

            if (choice === 1) {
                isOperationActive = false; // Allow closing next time
                win?.close();
            }
        }
    });

    // Test active push message to Key 
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(process.env.DIST || '', 'index.html'))
    }
}

// IPC to manage operation state
ipcMain.handle('system:set-operation-active', (_, active: boolean) => {
    isOperationActive = active;
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

import { setupIPC } from '../src/main/ipc.js';

setupIPC();

app.whenReady().then(async () => {
    const isElevated = await ensureElevated();

    if (!isElevated) {
        dialog.showErrorBox(
            'Privilegios insuficientes',
            'All Updater requiere permisos de Administrador para gestionar Winget y crear puntos de restauración.\n\nPor favor, ejecuta la aplicación como administrador.'
        );
        app.quit();
        return;
    }

    createWindow();
});
