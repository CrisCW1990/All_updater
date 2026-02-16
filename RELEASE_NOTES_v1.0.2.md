# v1.0.2

## ES
Esta version agrega claridad para el cliente y mejora la experiencia no invasiva en diagnostico y auto-descarga.

### Cambios y correcciones
- Actualizacion de app via GitHub Releases (sin backend propio):
  - Verificacion de version local vs ultima version publicada.
  - Si no hay internet, no bloquea nada: la app sigue funcionando normal.
  - Descarga desde la app con selector de carpeta (el usuario elige donde guardar).
  - Barra de progreso de descarga y feedback EN/ES.
  - Nota de transparencia incluida: solo consulta GitHub Releases y no envia datos personales.
- Restore point mas claro y seguro:
  - Resultado estructurado con causa (`proteccion desactivada`, `limite de frecuencia`, `permisos`, `servicios`, etc.).
  - Mensaje especifico EN/ES con accion recomendada segun el motivo.
  - Si falla el restore, se aborta el batch para proteger el sistema.
  - Verificacion real de creacion de punto (no solo exito del comando).
- Logs locales mas faciles de revisar:
  - `app_debug.txt` en la carpeta de datos local.
  - `restore_debug.txt` con detalle tecnico del flujo de restauracion.
- UX/copy:
  - Correccion ortografica del texto satirico de IA en espanol (`porque`).

## EN
This release improves client clarity and non-invasive behavior around diagnostics and in-app download.

### Changes and fixes
- App update via GitHub Releases (no custom backend):
  - Checks local version vs latest published release.
  - If offline, nothing is blocked and the app continues working normally.
  - In-app download with folder picker (user chooses destination).
  - Download progress bar and bilingual EN/ES feedback.
  - Transparency note included: only GitHub Releases is queried, no personal data is sent.
- Restore point flow made clearer and safer:
  - Structured restore result with reason (`protection disabled`, `frequency limit`, `permissions`, `services`, etc.).
  - Specific EN/ES message with recommended action per failure reason.
  - If restore fails, the update batch is aborted to protect the system.
  - Real restore-point creation verification (not only command success).
- Easier local logs:
  - `app_debug.txt` in local data folder.
  - `restore_debug.txt` with technical restore details.
- UX/copy:
  - Spanish AI satire text typo fixed (`porque`).
