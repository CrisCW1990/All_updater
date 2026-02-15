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

5. **Seleccion individual**
- Paso: seleccionar/deseleccionar updates.
- Esperado: contador `Update Selected` refleja seleccion real.

6. **Select all sin inapplicable**
- Paso: usar `Select all` cuando hay paquetes inapplicable.
- Esperado: solo selecciona paquetes instalables.

7. **Modal de restore**
- Paso: click en `Update Selected`.
- Esperado: modal abre, permite `Create restore` o `Skip`.

8. **Crear restore exitoso**
- Paso: confirmar restore y continuar.
- Esperado: se crea restore y luego inicia instalacion.

9. **Fallo de restore**
- Paso: forzar error de restore.
- Esperado: muestra toast de error y aborta batch (no instala).

10. **Conflicto app en uso**
- Paso: actualizar una app abierta.
- Esperado: modal de conflicto con `Retry` o `Skip`.

11. **Resultado reboot required**
- Paso: simular paquete que requiere reinicio.
- Esperado: status `reboot` en historial/resumen + recomendacion de reinicio.

12. **Resultado hash mismatch**
- Paso: simular mismatch de hash.
- Esperado: status `security-error`, toast de seguridad, sin marcar como success.

13. **Resumen final del batch**
- Paso: terminar batch con mezclas de estados.
- Esperado: mensaje correcto (success/partial/failed) y conteo consistente.

14. **Historial persistente**
- Paso: cerrar/reabrir app.
- Esperado: historial permanece y ordenado (mas reciente primero).

15. **Reset app**
- Paso: `History > Reset App > Confirm`.
- Esperado:
- borra historial,
- idioma vuelve a ingles,
- onboarding vuelve a mostrarse en el siguiente inicio.

16. **Onboarding y "dont show again"**
- Paso: marcar `Dont show again` y cerrar onboarding.
- Esperado: no vuelve a mostrarse hasta reset.

17. **Cambio de idioma EN/ES**
- Paso: alternar idioma en sidebar.
- Esperado: UI traducida consistentemente (titulos, botones, modales, historial).

18. **Contraste light mode**
- Paso: ejecutar en light mode y recorrer Dashboard/History/Modales.
- Esperado: texto legible, badges legibles, botones con contraste correcto.

19. **Dark mode sin regresion**
- Paso: alternar a dark mode.
- Esperado: se mantiene look actual y legibilidad.

20. **Apertura de logs**
- Paso: ejecutar accion `Open Logs`.
- Esperado: abre carpeta/archivo de logs sin error.

## Criterios De Aceptacion
- Ningun crash en flujo principal.
- Estados de update coherentes en Dashboard + Summary + History.
- EN/ES consistente.
- Light mode legible sin degradar dark mode.
