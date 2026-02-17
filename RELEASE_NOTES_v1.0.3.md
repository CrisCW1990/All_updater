# v1.0.3

## ES
Esta version mejora robustez operativa, soporte tecnico y claridad del flujo sin volver la app invasiva.

### Cambios y correcciones
- Preflight antes de actualizar:
  - Nuevo chequeo previo no invasivo (admin, winget, VSS, Programador de tareas y consulta de restauracion).
  - Si hay riesgo, muestra modal con estado y decision del usuario.
  - Si hay fallo critico, bloquea continuar hasta corregir.
- Diagnostico exportable local:
  - Nuevo boton para exportar un `.txt` con snapshot tecnico + tail de `app_debug.txt` y `restore_debug.txt`.
  - Todo se guarda localmente en carpeta elegida por el usuario.
- Update interno mas seguro:
  - Verificacion SHA256 del asset de GitHub cuando el release publica `digest`.
  - Si hash no coincide, se elimina el archivo y se muestra alerta de seguridad.
  - Boton para abrir la carpeta del archivo descargado.
- Winget y estado de paquetes:
  - Mejor manejo de `version desconocida/desconocida`.
  - Supresion temporal de ruido para casos con version instalada desconocida y reintentos recientes fallidos.
  - Deteccion de `reboot required` ampliada (codes + mensajes EN/ES).
  - Fallback de `--force` corregido para que realmente aporte en recuperacion.
- Persistencia mas robusta:
  - `settings` e `history` con `clearInvalidConfig` para autorecuperar config invalida.
  - Backup local `.bak.json` al escribir settings/historial.
- UX y soporte:
  - Centro de solucion de problemas EN/ES dentro de la app.
  - Boton visible para abrir logs.
  - Historial con filtros rapidos (todo, exitos, problemas, reinicio, seguridad).
  - Mensajes EN/ES de descarga aclarando extraer ZIP completo.
- Accesibilidad y calidad:
  - Atajos en modales (`Enter`/`Esc`) y foco inicial.
  - Respeto a `prefers-reduced-motion`.
  - Mitigacion de doble inicializacion en `dev` por StrictMode.
  - Suite de verificacion consolidada (`npm run verify` / `npm run test:regression`).

## EN
This release improves operational robustness, supportability, and flow clarity while keeping the app non-invasive.

### Changes and fixes
- Preflight before update flow:
  - New non-invasive readiness check (admin, winget, VSS, Task Scheduler, restore query).
  - If risk is detected, a decision modal is shown.
  - If critical checks fail, continuing is blocked until fixed.
- Local diagnostics export:
  - New button exports a local `.txt` snapshot + tail of `app_debug.txt` and `restore_debug.txt`.
  - Everything stays local in a user-selected folder.
- Safer in-app updater:
  - SHA256 verification for GitHub release assets when `digest` is available.
  - On hash mismatch, downloaded file is removed and security warning is shown.
  - Added button to open the downloaded file location.
- Winget/package-state robustness:
  - Improved handling for unknown installed version variants.
  - Temporary noise suppression for unknown-version packages with recent failed retries.
  - Broader `reboot required` detection (codes + EN/ES text patterns).
  - Corrected `--force` fallback so it provides real recovery value.
- Stronger persistence:
  - `settings` and `history` use `clearInvalidConfig` for auto-recovery.
  - Local `.bak.json` backups are written for settings/history updates.
- UX and support:
  - In-app EN/ES troubleshooting center.
  - Visible open-logs button.
  - History quick filters (all, success, issues, reboot, security).
  - EN/ES post-download guidance clarifying full ZIP extraction.
- Accessibility and quality:
  - Modal keyboard shortcuts (`Enter`/`Esc`) and initial focus.
  - Honors `prefers-reduced-motion`.
  - Mitigates duplicate startup checks in dev StrictMode.
  - Consolidated validation commands (`npm run verify` / `npm run test:regression`).
