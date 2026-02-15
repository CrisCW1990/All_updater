import { contextBridge, ipcRenderer } from 'electron';
console.log('[Preload] Script loaded');
// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args) {
        const [channel, listener] = args;
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    },
    off(...args) {
        const [channel, listener] = args;
        return ipcRenderer.off(channel, listener);
    },
    send(...args) {
        const [channel, ...omit] = args;
        return ipcRenderer.send(channel, ...omit);
    },
    invoke(...args) {
        const [channel, ...omit] = args;
        console.log('[Preload] IPC invoke called:', channel);
        return ipcRenderer.invoke(channel, ...omit);
    },
});
console.log('[Preload] contextBridge.exposeInMainWorld completed');
