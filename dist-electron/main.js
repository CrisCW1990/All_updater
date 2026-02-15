import { app as t, ipcMain as d, BrowserWindow as i, dialog as l } from "electron";
import r from "path";
import { fileURLToPath as u } from "url";
const m = u(import.meta.url), c = r.dirname(m);
process.env.DIST = r.join(c, "../dist");
process.env.VITE_PUBLIC = t.isPackaged ? process.env.DIST : r.join(process.env.DIST, "../public");
if (t.isPackaged) {
  const o = process.env.PORTABLE_EXECUTABLE_DIR || r.dirname(t.getPath("exe")), e = r.join(o, "data");
  t.setPath("userData", e);
}
async function f() {
  try {
    const { execa: o } = await import("./index-CWXQCQWA.js").then((e) => e.i);
    return await o("net", ["session"], { reject: !0 }), !0;
  } catch {
    return !1;
  }
}
let n, a = !1;
const s = process.env.VITE_DEV_SERVER_URL;
function p() {
  let o = !1;
  n = new i({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: r.join(c, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    },
    autoHideMenuBar: !0,
    title: "All Updater",
    icon: r.join(process.env.VITE_PUBLIC, "logo.png")
  }), n.on("close", (e) => {
    o || a && (e.preventDefault(), l.showMessageBoxSync(n, {
      type: "warning",
      buttons: ["Wait / Esperar", "Close Anyway (Dangerous) / Cerrar de todos modos (Peligroso)"],
      title: "Operation in Progress / Operacion en progreso",
      message: `An application update or restore point is currently in progress. Closing the app now could leave your system or software in an unstable state.

Hay una actualizacion o punto de restauracion en progreso. Cerrar ahora puede dejar el sistema o software inestable.`,
      detail: `It is highly recommended to wait until the process finishes.
Se recomienda esperar a que el proceso termine.`,
      defaultId: 0,
      cancelId: 0
    }) === 1 && (o = !0, a = !1, n?.close()));
  }), n.webContents.on("did-finish-load", () => {
    n?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), s ? n.loadURL(s) : n.loadFile(r.join(process.env.DIST || "", "index.html"));
}
d.handle("system:set-operation-active", (o, e) => {
  a = e;
});
t.on("window-all-closed", () => {
  process.platform !== "darwin" && t.quit();
});
t.on("activate", () => {
  i.getAllWindows().length === 0 && p();
});
t.whenReady().then(async () => {
  if (!await f()) {
    l.showErrorBox(
      "Insufficient privileges / Privilegios insuficientes",
      `All Updater requires Administrator permissions to manage Winget and create restore points.

All Updater requiere permisos de Administrador para gestionar Winget y crear puntos de restauracion.`
    ), t.quit();
    return;
  }
  const { setupIPC: e } = await import("./ipc-D1j8QDcR.js");
  e(), p();
});
