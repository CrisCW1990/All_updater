# v1.0.5 - The "Digital Overlord" Update (Polished & Synchronized)

## ES
Esta versión marca la sincronización final de la interfaz Material 3 con las mejoras funcionales de la v1.0.5. Se ha refinado la experiencia visual, la marca y la estabilidad del instalador portable.

### Novedades Visuales y de Marca (New Design)
- **Interfaz Material 3 Unificada**: Se han resuelto todos los conflictos de estilo, aplicando un diseño M3 consistente en el Dashboard, Modales y Tarjetas.
- **Nuevo Icono**: Se ha reemplazado el logo antiguo por un nuevo icono moderno (`icon.ico`) integrado en la barra de tareas y ventana.
- **Rebranding**: Actualizados los créditos del desarrollador a "Chris" en toda la aplicación.
- **Iconos en Tarjetas**: Añadidos iconos de marcador de posición en las tarjetas de actualización para mejorar la jerarquía visual sin sacrificar rendimiento.
- **Menu Lateral**: Logo actualizado en el sidebar para coincidir con el icono de la aplicación.

### Mejoras Funcionales y Sincronización (v1.0.5 Core)
- **Detección de Conflictos**: Winget ahora es más preciso detectando aplicaciones en uso (especialmente OBS), evitando falsos positivos.
- **Progreso de Instalación**: Mejor visualización del progreso combinado (stdout/stderr) y estimaciones cuando Winget no reporta porcentajes.
- **Resolución de Conflictos**: Se han fusionado exitosamente las ramas de desarrollo, integrando la lógica de "Acciones Rápidas" en `PreflightModal` con el nuevo estilo visual.
- **Limpieza**: Eliminados assets antiguos y scripts temporales para un ejecutable más limpio.

### Build
- **Portable Optimizado**: El ejecutable ahora se construye por defecto como `portable unsigned` para facilitar la distribución local sin requisitos de firma estricta.

---

## EN
This release marks the final synchronization of the Material 3 interface with the functional improvements of v1.0.5. The visual experience, branding, and portable installer stability have been refined.

### Visual & Branding Updates (New Design)
- **Unified Material 3 Interface**: All style conflicts resolved, applying consistent M3 design across Dashboard, Modals, and Cards.
- **New Icon**: Replaced old logo with a new modern icon (`icon.ico`) integrated into taskbar and window.
- **Rebranding**: Updated developer credits to "Chris" throughout the application.
- **Card Icons**: Added placeholder icons to update cards to improve visual hierarchy without sacrificing performance.
- **Sidebar**: Updated logo in sidebar to match application icon.

### Functional Improvements & Synchronization (v1.0.5 Core)
- **Conflict Detection**: Winget is now more accurate detecting in-use apps (especially OBS), avoiding false positives.
- **Install Progress**: Better visualization of combined progress (stdout/stderr) and estimations when Winget doesn't report percentages.
- **Conflict Resolution**: Successfully merged development branches, integrating "Quick Actions" logic in `PreflightModal` with the new visual style.
- **Cleanup**: Removed old assets and temporary scripts for a cleaner executable.

### Build
- **Optimized Portable**: The executable is now built by default as `portable unsigned` to facilitate local distribution without strict signing requirements.
