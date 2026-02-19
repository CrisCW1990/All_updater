# v1.0.5.1

## ES
Esta version añade iconos de aplicacion en las cards, un modal de novedades con changelog, calculo de ETA en tiempo real durante la instalacion.

### Cambios y correcciones
- Iconos de aplicacion en UpdateCard:
  - Cada card carga automaticamente el icono del programa desde la API de winget.run al montarse.
  - Muestra spinner mientras carga y cae de vuelta al icono generico si no hay icono disponible o falla la carga.
- Modal "Novedades" por paquete:
  - Nuevo boton en cada UpdateCard que abre un modal con las notas de version del paquete.
  - Las notas se obtienen del manifest de winget-pkgs en GitHub y de la API de winget.run en paralelo.
  - Incluye enlace a la URL de notas de version y a la pagina web del programa si estan disponibles.
  - Si el desarrollador no escribio notas, el modal lo indica con el tono habitual de la app.
  - Nuevo canal IPC: `winget:get-package-info`.
- ETA en tiempo real durante instalacion:
  - Cuando winget emite porcentajes reales, se registran con timestamp y se calcula la velocidad de progreso.
  - El ETA se calcula con una ventana deslizante de los ultimos 5 puntos reales.
  - Muestra `~Xs restantes` o `~Xm restantes` segun la magnitud.
  - Solo aparece en modo real (no en el modo estimado por fases).
  - Se resetea limpiamente entre cada app del lote.
- Deteccion de conexion lenta:
  - Si el porcentaje no avanza en 15 segundos, aparece un mensaje en el overlay de instalacion.
  - Los mensajes rotan cada vez que se detecta un estancamiento.
- Correcciones de bugs:
  - Corregido doble `import('execa')` dentro de `ensureElevated()` en `electron/main.ts`.
  - Corregido typo de traduccion: `historyFilterIssues` en español mostraba "Tragedies" en lugar de "Tragedias".

### Calidad
- Lint limpio.
- TypeScript limpio (`app` y `electron`).

---

## EN
This release adds app icons on update cards, a per-package changelog modal, real-time ETA calculation during installation.

### Changes and fixes
- App icons on UpdateCard:
  - Each card automatically fetches the app icon from the winget.run API on mount.
  - Shows a spinner while loading and falls back to the generic box icon if unavailable or on error.
- "What's New" modal per package:
  - New button on each UpdateCard that opens a modal with the package's release notes.
  - Notes are fetched from the winget-pkgs GitHub manifest and the winget.run API in parallel.
  - Includes a link to the release notes URL and the app homepage if available.
  - If the developer didn't write release notes, the modal says so in the app's usual diplomatic tone.
  - New IPC channel: `winget:get-package-info`.
- Real-time ETA during installation:
  - When winget emits real percentages, each point is recorded with a timestamp and the progress rate is computed.
  - ETA is calculated using a sliding window of the last 5 real data points.
  - Displays `~Xs left` or `~Xm left` depending on magnitude.
  - Only shown in real mode (not during the phase-based estimated mode).
  - Resets cleanly between each app in a batch.
- Slow connection detection:
  - If the progress percentage hasn't moved in 15 seconds, a message appears in the install overlay.
  - Messages rotate each time a stall is detected.
- Bug fixes:
  - Fixed double `import('execa')` inside `ensureElevated()` in `electron/main.ts`.
  - Fixed translation typo: `historyFilterIssues` in Spanish was showing "Tragedies" instead of "Tragedias".

### Quality
- Clean lint.
- Clean TypeScript checks (`app` and `electron`).
