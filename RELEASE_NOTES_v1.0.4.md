# v1.0.4

## ES
Esta version se enfoca en robustez real en produccion y claridad para el usuario, manteniendo el enfoque no invasivo de la app.

### Cambios y correcciones
- Preflight mas robusto:
  - Se corrigio el manejo cuando `winget` no puede ejecutarse (excepciones de proceso), evitando diagnosticos globales engañosos.
  - Mejor clasificacion para mostrar feedback claro en modal.
- Historial tolerante a fallos:
  - Si falla el guardado del historial, la instalacion ya no se marca como fallida ni se rompe el batch.
  - Se muestra aviso claro al usuario sobre permisos de carpeta local.
- Retry de fallidas mas estable:
  - Se elimino riesgo por estado React stale al reintentar desde el resumen.
  - El flujo usa snapshot consistente de seleccion para ejecutar lo esperado.
- Winget parser mas seguro:
  - Se corrigio el camino JSON para no aceptar vacios prematuros que podian ocultar actualizaciones.
  - Se mantiene fallback robusto al parser de texto.
- Persistencia portable con fallback:
  - Si `data` junto al `.exe` no es escribible, la app cae a `%AppData%\\All Updater\\data` sin romper flujo.
- UX de acciones rapidas en preflight:
  - Ahora tienen feedback visible EN/ES si una herramienta no se puede abrir (antes era solo `console.error`).

### Calidad
- Lint limpio.
- TypeScript limpio (`app` y `electron`).
- Flujo firmado de release mantenido (`npm run release`).

## EN
This release focuses on real production robustness and clearer user feedback while preserving the app’s non-invasive philosophy.

### Changes and fixes
- Stronger preflight behavior:
  - Fixed handling when `winget` cannot be executed (process spawn exceptions), avoiding misleading global diagnostics.
  - Improved classification for clearer modal feedback.
- History write fault-tolerance:
  - If history persistence fails, installations are no longer marked as failed and batches no longer break.
  - Clear user warning is now shown about local folder permissions.
- More stable failed-items retry:
  - Removed stale React state risk when retrying from summary.
  - Flow now uses a consistent selection snapshot.
- Safer winget parser path:
  - Corrected JSON path so premature empty parses no longer hide real updates.
  - Robust text-parser fallback remains in place.
- Portable persistence fallback:
  - If local `data` near the `.exe` is not writable, app falls back to `%AppData%\\All Updater\\data` without breaking flow.
- Better preflight quick-action UX:
  - Quick actions now surface visible EN/ES feedback when tools cannot be opened (previously console-only).

### Quality
- Clean lint.
- Clean TypeScript checks (`app` and `electron`).
- Signed release pipeline preserved (`npm run release`).
