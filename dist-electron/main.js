import { app as e, ipcMain as d, BrowserWindow as s, dialog as l } from "electron";
import n from "path";
import { fileURLToPath as u } from "url";
const m = u(import.meta.url), c = n.dirname(m);
process.env.DIST = n.join(c, "../dist");
process.env.VITE_PUBLIC = e.isPackaged ? process.env.DIST : n.join(process.env.DIST, "../public");
if (e.isPackaged) {
  const t = n.join(n.dirname(e.getPath("exe")), "data");
  e.setPath("userData", t);
}
async function f() {
  try {
    const { execa: t } = await import("./index-CWXQCQWA.js").then((a) => a.i);
    return await t("net", ["session"], { reject: !0 }), !0;
  } catch {
    return !1;
  }
}
let o, i = !1;
const r = process.env.VITE_DEV_SERVER_URL;
function p() {
  let t = !1;
  o = new s({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: n.join(c, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    },
    autoHideMenuBar: !0,
    title: "All Updater",
    icon: n.join(process.env.VITE_PUBLIC, "logo.png")
  }), o.on("close", (a) => {
    t || i && (a.preventDefault(), l.showMessageBoxSync(o, {
      type: "warning",
      buttons: ["Wait / Esperar", "Close Anyway (Dangerous) / Cerrar de todos modos (Peligroso)"],
      title: "Operation in Progress / Operacion en progreso",
      message: `An application update or restore point is currently in progress. Closing the app now could leave your system or software in an unstable state.

Hay una actualizacion o punto de restauracion en progreso. Cerrar ahora puede dejar el sistema o software inestable.`,
      detail: `It is highly recommended to wait until the process finishes.
Se recomienda esperar a que el proceso termine.`,
      defaultId: 0,
      cancelId: 0
    }) === 1 && (t = !0, i = !1, o?.close()));
  }), o.webContents.on("did-finish-load", () => {
    o?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), r ? o.loadURL(r) : o.loadFile(n.join(process.env.DIST || "", "index.html"));
}
d.handle("system:set-operation-active", (t, a) => {
  i = a;
});
e.on("window-all-closed", () => {
  process.platform !== "darwin" && e.quit();
});
e.on("activate", () => {
  s.getAllWindows().length === 0 && p();
});
e.whenReady().then(async () => {
  if (!await f()) {
    l.showErrorBox(
      "Insufficient privileges / Privilegios insuficientes",
      `All Updater requires Administrator permissions to manage Winget and create restore points.

All Updater requiere permisos de Administrador para gestionar Winget y crear puntos de restauracion.`
    ), e.quit();
    return;
  }
  const { setupIPC: a } = await import("./ipc-D1j8QDcR.js");
  a(), p();
});
