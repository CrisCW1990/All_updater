# v1.0.5

## ES
Esta version mejora deteccion de conflictos reales, visibilidad de progreso, experiencia responsive, añade iconos de aplicacion en las cards, un modal de novedades con changelog, calculo de ETA en tiempo real y deteccion de conexion lenta.

### Cambios y correcciones
- Winget mas preciso con apps en uso (especialmente OBS):
  - Se corrigieron falsos positivos de "aplicacion en uso" cuando no existe proceso real de OBS.
  - Ahora se valida proceso relacionado antes de mostrar conflicto en ese caso.
  - Se evita tratar `exit code 6` como "app en uso" de forma generica.
- Progreso de instalacion por app mejorado:
  - Se consume salida combinada de winget (`stdout` + `stderr`) para capturar progreso real cuando existe.
  - Se agrego progreso estimado por fases/tiempo cuando winget no emite porcentaje.
  - UI aclara cuando el progreso es estimado (`Estimado`) y mantiene progreso de lote por separado.
- UX del header superior mas clara:
  - Se evita duplicidad visual del control de update de la app cuando ya hay banner de nueva version.
  - El boton de diagnostico ahora indica explicitamente que exporta ZIP de diagnostico.
- Responsividad refinada (mobile-first):
  - Header de acciones ajustado para pantallas pequenas.
  - `UpdateCard` mejor manejo de IDs largos y contenidos densos.
  - Modales (`Onboarding`, `Restore`, `Preflight`) ajustados para 320/360 sin quiebres de layout.
- Texto onboarding EN corregido:
  - "I help you to update..."
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
  - Si el porcentaje no avanza en 15 segundos, aparece un aviso en el overlay de instalacion.
  - Los avisos rotan cada vez que se detecta un estancamiento.
- Correcciones de bugs:
  - Corregido doble `import('execa')` dentro de `ensureElevated()` en `electron/main.ts`.
  - Corregido typo de traduccion: `historyFilterIssues` en español mostraba "Tragedies" en lugar de "Tragedias".

### Calidad
- Lint limpio.
- TypeScript limpio (`app` y `electron`).

---

## EN
This release improves real conflict detection, install progress visibility, and responsive behavior, and adds app icons on update cards, a per-package changelog modal, real-time ETA calculation, and slow connection detection.

### Changes and fixes
- More accurate in-use detection (especially OBS):
  - Fixed false positives where OBS was reported as running without an actual OBS process.
  - OBS conflict modal now requires related process confirmation.
  - Removed generic `exit code 6` mapping to "app in use".
- Better per-app install progress:
  - Winget combined stream (`stdout` + `stderr`) is now consumed to capture real progress when available.
  - Added estimated progress fallback (phase/time-based) when winget does not emit percentages.
  - UI explicitly marks estimated progress (`Estimated`) and keeps batch progress separate.
- Clearer top header UX:
  - Avoids visual duplication of app-update controls when update banner is already visible.
  - Diagnostics button now explicitly states it exports a diagnostics ZIP.
- Responsive refinements (mobile-first):
  - Top action header adjusted for small screens.
  - `UpdateCard` now handles long IDs and dense content more safely.
  - `Onboarding`, `Restore`, and `Preflight` modals tuned for 320/360 widths.
- Onboarding EN copy correction:
  - "I help you to update..."
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
  - If the progress percentage hasn't moved in 15 seconds, a notice appears in the install overlay.
  - Notices rotate each time a stall is detected.
- Bug fixes:
  - Fixed double `import('execa')` inside `ensureElevated()` in `electron/main.ts`.
  - Fixed translation typo: `historyFilterIssues` in Spanish was showing "Tragedies" instead of "Tragedias".

### Quality
- Clean lint.
- Clean TypeScript checks (`app` and `electron`).
