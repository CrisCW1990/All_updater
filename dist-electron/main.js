import { app as a, ipcMain as w, BrowserWindow as d, dialog as u } from "electron";
import r from "path";
import c from "node:fs";
import { fileURLToPath as h } from "url";
const g = h(import.meta.url), m = r.dirname(g);
process.env.DIST = r.join(m, "../dist");
process.env.VITE_PUBLIC = a.isPackaged ? process.env.DIST : r.join(process.env.DIST, "../public");
if (a.isPackaged) {
  const t = process.env.PORTABLE_EXECUTABLE_DIR || r.dirname(a.getPath("exe")), e = r.join(t, "data");
  let o = e;
  try {
    c.mkdirSync(e, { recursive: !0 });
    const n = r.join(e, ".all-updater-write-test");
    c.writeFileSync(n, "ok", "utf8"), c.unlinkSync(n);
  } catch (n) {
    console.warn("[Main] Portable data folder is not writable. Falling back to roaming appData.", n);
    try {
      const s = r.join(a.getPath("appData"), "All Updater", "data");
      c.mkdirSync(s, { recursive: !0 }), o = s;
    } catch (s) {
      console.warn("[Main] Roaming appData fallback is not writable. Keeping default userData path.", s);
    }
  }
  a.setPath("userData", o);
}
async function y() {
  try {
    const { execa: t } = await import("./index-CWXQCQWA.js").then((e) => e.i);
    return await t("net", ["session"], { reject: !0 }), !0;
  } catch {
    try {
      const { execa: t } = await import("./index-CWXQCQWA.js").then((o) => o.i), { stdout: e } = await t("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        "([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)"
      ], { reject: !1 });
      return e.trim().toLowerCase() === "true";
    } catch {
      return !1;
    }
  }
}
let i, l = !1;
const p = process.env.VITE_DEV_SERVER_URL;
function f() {
  let t = !1;
  i = new d({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: r.join(m, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    },
    autoHideMenuBar: !0,
    title: "All Updater",
    icon: r.join(process.env.VITE_PUBLIC, "icon.ico")
  }), i.on("close", (e) => {
    t || l && (e.preventDefault(), u.showMessageBoxSync(i, {
      type: "warning",
      buttons: ["Wait / Esperar", "Close Anyway (Dangerous) / Cerrar de todos modos (Peligroso)"],
      title: "Operation in Progress / Operacion en progreso",
      message: `An application update or restore point is currently in progress. Closing the app now could leave your system or software in an unstable state.

Hay una actualizacion o punto de restauracion en progreso. Cerrar ahora puede dejar el sistema o software inestable.`,
      detail: `It is highly recommended to wait until the process finishes.
Se recomienda esperar a que el proceso termine.`,
      defaultId: 0,
      cancelId: 0
    }) === 1 && (t = !0, l = !1, i?.close()));
  }), i.webContents.on("did-finish-load", () => {
    i?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), p ? i.loadURL(p) : i.loadFile(r.join(process.env.DIST || "", "index.html"));
}
w.handle("system:set-operation-active", (t, e) => {
  l = e;
});
a.on("window-all-closed", () => {
  process.platform !== "darwin" && a.quit();
});
a.on("activate", () => {
  d.getAllWindows().length === 0 && f();
});
a.whenReady().then(async () => {
  if (!await y()) {
    u.showErrorBox(
      "Insufficient privileges / Privilegios insuficientes",
      `All Updater requires Administrator permissions to manage Winget and create restore points.

All Updater requiere permisos de Administrador para gestionar Winget y crear puntos de restauracion.`
    ), a.quit();
    return;
  }
  const { setupIPC: e } = await import("./ipc-DBdonJb5.js");
  e(), f();
});
