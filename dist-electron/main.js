import { app as t, ipcMain as w, BrowserWindow as d, dialog as u } from "electron";
import a from "path";
import s from "node:fs";
import { fileURLToPath as h } from "url";
const g = h(import.meta.url), f = a.dirname(g);
process.env.DIST = a.join(f, "../dist");
process.env.VITE_PUBLIC = t.isPackaged ? process.env.DIST : a.join(process.env.DIST, "../public");
if (t.isPackaged) {
  const r = process.env.PORTABLE_EXECUTABLE_DIR || a.dirname(t.getPath("exe")), e = a.join(r, "data");
  let l = e;
  try {
    s.mkdirSync(e, { recursive: !0 });
    const o = a.join(e, ".all-updater-write-test");
    s.writeFileSync(o, "ok", "utf8"), s.unlinkSync(o);
  } catch (o) {
    console.warn("[Main] Portable data folder is not writable. Falling back to roaming appData.", o);
    try {
      const n = a.join(t.getPath("appData"), "All Updater", "data");
      s.mkdirSync(n, { recursive: !0 }), l = n;
    } catch (n) {
      console.warn("[Main] Roaming appData fallback is not writable. Keeping default userData path.", n);
    }
  }
  t.setPath("userData", l);
}
async function y() {
  const { execa: r } = await import("./index-CH7iMeex.js").then((e) => e.i);
  try {
    return await r("net", ["session"], { reject: !0 }), !0;
  } catch {
    try {
      const { stdout: e } = await r("powershell", [
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
let i, c = !1;
const p = process.env.VITE_DEV_SERVER_URL;
function m() {
  let r = !1;
  i = new d({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: a.join(f, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    },
    autoHideMenuBar: !0,
    title: "All Updater",
    icon: a.join(process.env.VITE_PUBLIC, "icon.ico")
  }), i.on("close", (e) => {
    r || c && (e.preventDefault(), u.showMessageBoxSync(i, {
      type: "warning",
      buttons: ["Wait / Esperar", "Close Anyway (Dangerous) / Cerrar de todos modos (Peligroso)"],
      title: "Operation in Progress / Operacion en progreso",
      message: `An application update or restore point is currently in progress. Closing the app now could leave your system or software in an unstable state.

Hay una actualizacion o punto de restauracion en progreso. Cerrar ahora puede dejar el sistema o software inestable.`,
      detail: `It is highly recommended to wait until the process finishes.
Se recomienda esperar a que el proceso termine.`,
      defaultId: 0,
      cancelId: 0
    }) === 1 && (r = !0, c = !1, i?.close()));
  }), p ? i.loadURL(p) : i.loadFile(a.join(process.env.DIST || "", "index.html"));
}
w.handle("system:set-operation-active", (r, e) => {
  c = e;
});
t.on("window-all-closed", () => {
  process.platform !== "darwin" && t.quit();
});
t.on("activate", () => {
  d.getAllWindows().length === 0 && m();
});
t.whenReady().then(async () => {
  if (!await y()) {
    u.showErrorBox(
      "Insufficient privileges / Privilegios insuficientes",
      `All Updater requires Administrator permissions to manage Winget and create restore points.

All Updater requiere permisos de Administrador para gestionar Winget y crear puntos de restauracion.`
    ), t.quit();
    return;
  }
  const { setupIPC: e } = await import("./ipc-F_gFZYUY.js");
  e(), m();
});
