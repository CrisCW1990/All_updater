## ES
All Updater v1.0.0 incluye mejoras de estabilidad, portabilidad y experiencia no invasiva.

### Cambios principales
- Portable corregido: elevación UAC correcta al abrir el `.exe` portable.
- Datos locales no invasivos: configuración/historial se guardan junto al ejecutable.
- Winget más robusto:
  - Mejor manejo de salida corrupta/progreso y variaciones de locale del sistema.
  - Soporte mejorado para casos con versión instalada desconocida.
  - Prevención de falsos "0 updates" por parseo inválido.
- Lógica para apps con versión desconocida:
  - Si se actualizó con éxito, no reaparece en checks siguientes.
  - Con `Reset App`, vuelve a mostrarse.
- IPC endurecido y validación de settings más segura.
- Mejoras de contraste en light mode.
- Mejoras de copy bilingüe EN/ES.
- Documento de pruebas de regresión agregado.
- Lint y TypeScript en limpio.

## EN
All Updater v1.0.0 includes stability, portability, and non-invasive UX improvements.

### Highlights
- Portable fixed: proper UAC elevation when launching the portable `.exe`.
- Non-invasive local data: settings/history stored next to the executable.
- Stronger Winget handling:
  - Better resilience to corrupted/progress output and system locale variations.
  - Improved handling for unknown installed-version cases.
  - Prevents false "0 updates" caused by invalid parsing.
- Unknown-version app logic:
  - If updated successfully, it is hidden in subsequent checks.
  - `Reset App` makes it appear again.
- IPC hardening and safer settings validation.
- Light mode contrast improvements.
- Better bilingual EN/ES copy.
- Regression test checklist added.
- Clean lint and TypeScript validation.
