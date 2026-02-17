# SmartScreen + Code Signing (Windows)

Este proyecto ya incluye flujo recurrente para firmar el `.exe` portable sin tocar la lógica de la app.

## 1) Requisitos de firma

Usa una de estas opciones de identidad:

- `WIN_CSC_LINK` (o `CSC_LINK`): ruta/URL/base64 de tu `.pfx`
- `WIN_CSC_NAME` (o `CSC_NAME`): nombre del certificado en el store

Y opcional/recomendado:

- `WIN_CSC_KEY_PASSWORD` (o `CSC_KEY_PASSWORD`): password del `.pfx`

## 2) Scripts disponibles

- `npm run signing:check`: valida que haya identidad de firma configurada
- `npm run build:portable:signed`: build portable + `forceCodeSigning=true`
- `npm run signing:verify-artifact`: valida firma Authenticode del `.exe`
- `npm run release:portable:signed`: build firmado + verificación de firma
- `npm run build:local`: build portable **sin firma** (solo pruebas locales)
- `npm run release:local`: alias local para build portable **sin firma** (no publicar)
- `npm run hooks:install`: activa hooks de git del repo (`.githooks`)

## 3) Ejemplo rápido (PowerShell)

```powershell
$env:WIN_CSC_LINK = "C:\certs\all-updater.pfx"
$env:WIN_CSC_KEY_PASSWORD = "TU_PASSWORD"
npm run release:portable:signed
```

Si el binario queda sin firma, el flujo falla (intencional).

## 3.1) Hook de protección en push

Después de clonar el repo, ejecuta una vez:

```powershell
npm run hooks:install
```

El hook `pre-push` bloqueará push a:

- `refs/tags/v*`

si no detecta un artefacto firmado válido.

## 4) Paso Defender (reputación SmartScreen)

Objetivo: acelerar reputación para reducir advertencias SmartScreen en equipos nuevos.

### Manual (recomendado para este proyecto)

1. Publica release firmado.
2. Sube el `.exe`/`.zip` al portal de Microsoft Security Intelligence:
   - `https://www.microsoft.com/wdsi/filesubmission`
3. Selecciona categoría de software legítimo/false positive y agrega contexto:
   - nombre de app
   - versión
   - hash SHA256
   - URL del release en GitHub
4. Guarda el ticket/caso para trazabilidad.

### ¿Se puede automatizar?

- En escenarios estándar (cuenta personal), **normalmente no hay API pública simple** para automatizar este envío end-to-end.
- En entorno enterprise con Microsoft Defender APIs + app registration/Azure AD, se puede automatizar parcialmente, pero requiere infraestructura adicional y no está habilitado aquí por defecto.

## 5) Nota importante

- Esto reduce SmartScreen, pero no elimina el prompt UAC de administrador (eso depende de `requireAdministrator`, y en esta app es parte del flujo intencional).
