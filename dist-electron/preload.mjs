"use strict";
const electron = require("electron");
console.log("[Preload] Script loaded");
const listenerMap = /* @__PURE__ */ new Map();
const allowedInvokeChannels = /* @__PURE__ */ new Set([
  "winget:check-updates",
  "winget:install-update",
  "system:create-restore-point",
  "system:open-logs",
  "system:is-elevated",
  "system:get-info",
  "settings:get",
  "settings:set",
  "system:set-operation-active",
  "system:open-url",
  "system:show-item-in-folder",
  "system:check-app-update",
  "system:download-app-update",
  "system:run-preflight",
  "system:export-diagnostics",
  "history:get",
  "history:add",
  "history:clear",
  "system:get-userdata-path"
]);
const allowedOnChannels = /* @__PURE__ */ new Set([
  "winget:log",
  "main-process-message",
  "app-update:download-progress"
]);
const allowedSendChannels = /* @__PURE__ */ new Set([
  "log:info",
  "log:error"
]);
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    if (!allowedOnChannels.has(channel)) {
      throw new Error(`IPC channel not allowed for on(): ${channel}`);
    }
    let channelListeners = listenerMap.get(channel);
    if (!channelListeners) {
      channelListeners = /* @__PURE__ */ new Map();
      listenerMap.set(channel, channelListeners);
    }
    const existing = channelListeners.get(listener);
    if (existing) {
      electron.ipcRenderer.off(channel, existing);
    }
    const wrapped = (event, ...eventArgs) => listener(event, ...eventArgs);
    channelListeners.set(listener, wrapped);
    return electron.ipcRenderer.on(channel, wrapped);
  },
  off(...args) {
    const [channel, listener] = args;
    if (!allowedOnChannels.has(channel)) {
      throw new Error(`IPC channel not allowed for off(): ${channel}`);
    }
    const channelListeners = listenerMap.get(channel);
    const wrapped = channelListeners?.get(listener);
    if (wrapped) {
      channelListeners?.delete(listener);
      if (channelListeners && channelListeners.size === 0) {
        listenerMap.delete(channel);
      }
      return electron.ipcRenderer.off(channel, wrapped);
    }
    return electron.ipcRenderer.off(channel, listener);
  },
  send(...args) {
    const [channel, ...omit] = args;
    if (!allowedSendChannels.has(channel)) {
      throw new Error(`IPC channel not allowed for send(): ${channel}`);
    }
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    if (!allowedInvokeChannels.has(channel)) {
      throw new Error(`IPC channel not allowed for invoke(): ${channel}`);
    }
    console.log("[Preload] IPC invoke called:", channel);
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
console.log("[Preload] contextBridge.exposeInMainWorld completed");
