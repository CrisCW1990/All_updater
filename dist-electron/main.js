import { app as o, ipcMain as u, BrowserWindow as c, dialog as l } from "electron";
import n from "path";
import { fileURLToPath as m } from "url";
const f = m(import.meta.url), p = n.dirname(f);
process.env.DIST = n.join(p, "../dist");
process.env.VITE_PUBLIC = o.isPackaged ? process.env.DIST : n.join(process.env.DIST, "../public");
if (o.isPackaged) {
  const t = process.env.PORTABLE_EXECUTABLE_DIR || n.dirname(o.getPath("exe")), e = n.join(t, "data");
  o.setPath("userData", e);
}
async function w() {
  try {
    const { execa: t } = await import("./index-CWXQCQWA.js").then((e) => e.i);
    return await t("net", ["session"], { reject: !0 }), !0;
  } catch {
    try {
      const { execa: t } = await import("./index-CWXQCQWA.js").then((a) => a.i), { stdout: e } = await t("powershell", [
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
let i, r = !1;
const s = process.env.VITE_DEV_SERVER_URL;
function d() {
  let t = !1;
  i = new c({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: n.join(p, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    },
    autoHideMenuBar: !0,
    title: "All Updater",
    icon: n.join(process.env.VITE_PUBLIC, "logo.png")
  }), i.on("close", (e) => {
    t || r && (e.preventDefault(), l.showMessageBoxSync(i, {
      type: "warning",
      buttons: ["Wait / Esperar", "Close Anyway (Dangerous) / Cerrar de todos modos (Peligroso)"],
      title: "Operation in Progress / Operacion en progreso",
      message: `An application update or restore point is currently in progress. Closing the app now could leave your system or software in an unstable state.

Hay una actualizacion o punto de restauracion en progreso. Cerrar ahora puede dejar el sistema o software inestable.`,
      detail: `It is highly recommended to wait until the process finishes.
Se recomienda esperar a que el proceso termine.`,
      defaultId: 0,
      cancelId: 0
    }) === 1 && (t = !0, r = !1, i?.close()));
  }), i.webContents.on("did-finish-load", () => {
    i?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), s ? i.loadURL(s) : i.loadFile(n.join(process.env.DIST || "", "index.html"));
}
u.handle("system:set-operation-active", (t, e) => {
  r = e;
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
o.on("activate", () => {
  c.getAllWindows().length === 0 && d();
});
o.whenReady().then(async () => {
  if (!await w()) {
    l.showErrorBox(
      "Insufficient privileges / Privilegios insuficientes",
      `All Updater requires Administrator permissions to manage Winget and create restore points.

All Updater requiere permisos de Administrador para gestionar Winget y crear puntos de restauracion.`
    ), o.quit();
    return;
  }
  const { setupIPC: e } = await import("./ipc-KZiUn7u0.js");
  e(), d();
});
