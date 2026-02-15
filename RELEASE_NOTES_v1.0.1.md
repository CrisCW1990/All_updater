# v1.0.1

## ES
Esta version es incremental sobre `v1.0.0` y se enfoca en robustez operativa, mensajes mas claros y regresion.

### Cambios y correcciones
- Winget mas robusto:
  - Fallback cuando `--include-unknown` no esta soportado por versiones viejas de winget.
  - Parseo de salida mas tolerante cuando no aparece el header esperado de tabla.
  - Clasificacion de errores mas clara (`fuentes`, `permisos`, `salida no parseable`) para feedback mas amigable.
- Verificacion de administrador reforzada:
  - Si `net session` falla, se usa un fallback por PowerShell para validar elevacion.
- Menos ruido de logs:
  - Los logs verbosos de parsing quedan detras de flag (`ALL_UPDATER_DEBUG_WINGET=1`).
- UX y flujo:
  - `Reset App` vuelve a mostrar onboarding inmediatamente (misma sesion) y tambien al siguiente inicio.
  - Etiqueta de version en el resumen ahora es traducible (EN/ES) y no hardcodeada.
  - Guardado de preferencias (tema/onboarding/idioma) con manejo de error y rollback para evitar desincronizacion silenciosa.
- Calidad:
  - Checklist de regresion actualizado con nuevos escenarios (winget viejo, sources, parser, persistencia).
  - Lint y TypeScript en limpio.

## EN
This release is incremental over `v1.0.0` and focuses on operational robustness, clearer user feedback, and regression coverage.

### Changes and fixes
- Stronger Winget behavior:
  - Fallback when `--include-unknown` is not supported by older winget versions.
  - More tolerant output parsing when the expected table header is missing.
  - Clearer error classification (`sources`, `permissions`, `unparseable output`) for friendlier feedback.
- Improved admin detection:
  - If `net session` fails, a PowerShell fallback is used to validate elevation.
- Reduced log noise:
  - Verbose parser logs are now behind a debug flag (`ALL_UPDATER_DEBUG_WINGET=1`).
- UX and flow:
  - `Reset App` now re-shows onboarding immediately (same session) and on next startup.
  - Summary version label is now localized (EN/ES) instead of hardcoded.
  - Preference writes (theme/onboarding/language) now include error handling + rollback to avoid silent state drift.
- Quality:
  - Regression checklist updated for new scenarios (older winget, sources, parser, persistence).
  - Clean lint and TypeScript validation.
