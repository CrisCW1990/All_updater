# v1.0.5

## ES
Esta version mejora deteccion de conflictos reales, visibilidad de progreso y experiencia responsive sin cambiar el enfoque no invasivo.

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

### Calidad
- Lint limpio.
- TypeScript limpio (`app` y `electron`).

## EN
This release improves real conflict detection, install progress visibility, and responsive behavior while keeping the app non-invasive.

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

### Quality
- Clean lint.
- Clean TypeScript checks (`app` and `electron`).
