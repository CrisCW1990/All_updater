# Pruebas De Regresion - All Updater

## Alcance
- Mantener filosofia: app no invasiva, portable, flujo simple.
- Validar estabilidad funcional, UX EN/ES y seguridad minima del flujo de actualizacion.

## Precondiciones
- Windows 10/11.
- `winget` instalado.
- Probar en dos modos:
  - Sesion con permisos de administrador.
  - Ejecucion del `.exe` portable con doble click desde Explorador.
- Idioma de UI en EN y ES (la app), y si es posible validar en un Windows no-espanol para parser Winget.

## Suite Principal
1. **UAC al abrir portable**
- Paso: doble click al `.exe` portable.
- Esperado: Windows solicita elevacion (UAC) inmediatamente.
- Si usuario selecciona `No`: la app no abre.
- Si usuario selecciona `Si`: la app inicia normalmente.

2. **Bloqueo de cierre durante operacion**
- Paso: iniciar actualizacion y cerrar ventana.
- Esperado: aparece advertencia de operacion en progreso; no cierra si eliges esperar.

3. **Check updates inicial**
- Paso: abrir app y presionar `Check Updates`.
- Esperado: spinner, luego lista de updates o estado "all clean" sin crash.

4. **Winget ausente**
- Paso: simular fallo de `winget`.
- Esperado: vista de error amigable + boton `Get Winget` abre URL oficial.

5. **Winget sin permisos suficientes**
- Paso: forzar un escenario donde Winget devuelva error de elevacion.
- Esperado: toast claro de permisos de administrador (`WingetAccessDenied`) y sin crash.

6. **Seleccion individual**
- Paso: seleccionar/deseleccionar updates.
- Esperado: contador `Update Selected` refleja seleccion real.

7. **Select all sin inapplicable**
- Paso: usar `Select all` cuando hay paquetes inapplicable.
- Esperado: solo selecciona paquetes instalables.

8. **Modal de restore**
- Paso: click en `Update Selected`.
- Esperado: modal abre, permite `Create restore` o `Skip`.

9. **Crear restore exitoso**
- Paso: confirmar restore y continuar.
- Esperado: se crea restore y luego inicia instalacion.

10. **Fallo de restore**
- Paso: forzar error de restore.
- Esperado: muestra mensaje de fallo y modal de decision:
- si eliges `Cancelar`: aborta batch (no instala),
- si eliges `Continuar`: instala sin restore point bajo responsabilidad del usuario.

11. **Log de fallo de restore en app_debug**
- Paso: forzar error de restore y revisar `app_debug.txt`.
- Esperado: aparece linea clara con `reason=` y `details=` para soporte tecnico.

12. **Conflicto app en uso**
- Paso: actualizar una app abierta.
- Esperado: modal de conflicto con `Retry` o `Skip`.

13. **Resultado reboot required**
- Paso: simular paquete que requiere reinicio.
- Esperado: status `reboot` en historial/resumen + recomendacion de reinicio.

14. **Resultado hash mismatch**
- Paso: simular mismatch de hash.
- Esperado: status `security-error`, toast de seguridad, sin marcar como success.

15. **Resumen final del batch**
- Paso: terminar batch con mezclas de estados.
- Esperado: mensaje correcto (success/partial/failed) y conteo consistente.

16. **Historial persistente**
- Paso: cerrar/reabrir app.
- Esperado: historial permanece y ordenado (mas reciente primero).

17. **Reset app**
- Paso: `History > Reset App > Confirm`.
- Esperado:
- borra historial,
- idioma vuelve a ingles,
- onboarding vuelve a mostrarse inmediatamente (misma sesion) y tambien en el siguiente inicio.

18. **Onboarding y "dont show again"**
- Paso: marcar `Dont show again` y cerrar onboarding.
- Esperado: no vuelve a mostrarse hasta reset.

19. **Cambio de idioma EN/ES**
- Paso: alternar idioma en sidebar.
- Esperado: UI traducida consistentemente (titulos, botones, modales, historial).

20. **Contraste light mode**
- Paso: ejecutar en light mode y recorrer Dashboard/History/Modales.
- Esperado: texto legible, badges legibles, botones con contraste correcto.

21. **Dark mode sin regresion**
- Paso: alternar a dark mode.
- Esperado: se mantiene look actual y legibilidad.

22. **Apertura de logs**
- Paso: ejecutar accion `Open Logs`.
- Esperado: abre carpeta/archivo de logs sin error.

23. **Winget parser sin header de tabla**
- Paso: simular salida textual de Winget sin encabezado estandar pero con lineas de paquetes.
- Esperado: la app extrae updates validos (fallback regex) o muestra error amigable, nunca crash.

24. **Winget sources degradadas**
- Paso: simular error de source (ej. codigos 0x8a15005e/0x8a150001).
- Esperado: toast de problema de fuentes (`WingetSourceIssue`) y app estable.

25. **Winget viejo sin --include-unknown**
- Paso: validar en entorno con Winget antiguo o mockear respuesta de flag no soportado.
- Esperado: fallback automatico sin `--include-unknown` y check/install continua.

26. **Persistencia de settings con error de escritura**
- Paso: forzar fallo de `settings:set` (ruta de datos sin escritura).
- Esperado: rollback en UI al valor anterior + aviso al usuario; sin estado inconsistente.

27. **Etiqueta de version traducida en resumen**
- Paso: completar un batch en EN y ES.
- Esperado: se muestra `Version` en EN y `Version`/`Version localizada` en ES (clave traducida), sin hardcode fijo en ingles.

28. **Preflight previo al update**
- Paso: click en `Update Selected`.
- Esperado: se ejecuta preflight. Si hay advertencias, aparece modal con checks y decision. Si hay error critico, no permite continuar.

29. **Exportar diagnostico**
- Paso: usar boton `Export diagnostics`.
- Esperado: permite elegir carpeta y genera `all-updater-diagnostics-*.txt` con snapshot + tail de logs.

30. **Integridad SHA256 en update de app**
- Paso: descargar update cuando el release tiene `digest`.
- Esperado: valida hash. Si coincide, muestra confirmacion. Si no coincide, elimina archivo y muestra alerta de seguridad.

31. **Abrir carpeta de update descargado**
- Paso: descargar update exitosamente y usar `Open folder`.
- Esperado: abre explorador apuntando al archivo descargado.

32. **Historial con filtros**
- Paso: cambiar filtros en historial (`All`, `Success`, `Issues`, `Reboot`, `Security`).
- Esperado: lista se filtra correctamente sin perder datos.

33. **Accesibilidad de modales**
- Paso: abrir modales Restore/Conflict/RestoreFailure.
- Esperado: `Enter` ejecuta accion principal, `Esc` cancela/cierra, foco inicial correcto.

## Criterios De Aceptacion
- Ningun crash en flujo principal.
- Estados de update coherentes en Dashboard + Summary + History.
- EN/ES consistente.
- Light mode legible sin degradar dark mode.
