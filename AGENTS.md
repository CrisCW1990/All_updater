# Agent Build Policy

This project must use **signed Windows artifacts** for any build/release intended for distribution.

## Mandatory rules

1. Do not publish or upload unsigned `.exe` artifacts.
2. Preferred commands:
   - `npm run build`
   - `npm run release`
3. These commands must run signing checks and fail if signing is not configured.
4. If signing variables are missing, stop and report the issue instead of producing unsigned release artifacts.

## Allowed fallback for local-only debugging

- Unsigned builds are allowed only for local debugging and must not be released:
  - `npm run build:unsigned`
  - `npm run build:portable:unsigned`

## Signing docs

- See `SIGNING_SMARTSCREEN.md` for certificate variables and SmartScreen reputation workflow.
