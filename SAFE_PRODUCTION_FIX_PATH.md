# Safe Production Fix Path (No-Impact Focus)

## Goal
Deploy fixes with the lowest possible risk to live users on shared hosting/FTP.

## Why this path is safer
- Uploads only changed files.
- Upload order prevents broken frontend references.
- Includes pre-deploy backup, health checks, and instant rollback.
- Uses hash verification to confirm deployed files match local artifacts.

## Phase 0 - Freeze and package
1. Freeze commits for the release branch.
2. Build frontend once and do not rebuild again before deploy.
3. Create a release manifest with exact files and SHA256:
   - api/app/Controllers/Registrations.php
   - frontend/dist/index.html
   - frontend/dist/assets/index-TGy9gvWS.js
   - frontend/dist/assets/index-BmhZNNYw.css

## Phase 1 - Pre-deploy gates (must pass)
1. Backend checks:
   - php -l on modified PHP files.
   - targeted API smoke checks in production using safe requests (no destructive writes).
2. Frontend checks:
   - npm run build must pass.
   - If lint is not green globally, at least ensure no new lint errors in changed files.
3. Production baseline checks:
   - GET /api/activities -> 200
   - GET / -> 200
   - Current live asset URLs -> 200

If any gate fails, do not deploy.

## Phase 2 - Backup current production files
Before upload, download current remote versions of every file in the manifest into:
- deploy_files/backups/YYYYMMDD-HHMM/

This is mandatory for instant rollback.

## Phase 3 - Safe upload order
Use this exact order:
1. Backend changed PHP files first (small blast radius, easy rollback).
2. New frontend assets next (JS/CSS files).
3. index.html last (atomic frontend switch).

Important:
- Never upload index.html before its referenced hashed assets exist on remote.
- Never use old hashed asset names from previous builds.

## Phase 4 - Post-deploy validation (2-minute window)
Run immediately:
1. GET /api/activities -> 200
2. OPTIONS /api/registrations -> 200
3. GET /api/registrations/my-events with invalid token -> 401 (not 500)
4. GET / -> 200
5. GET /assets/index-TGy9gvWS.js -> 200
6. GET /assets/index-BmhZNNYw.css -> 200
7. Login/logout manual smoke test in browser (incognito)

## Phase 5 - Rollback trigger and procedure
Rollback triggers:
- Any new 5xx on critical endpoints.
- Login flow regressions.
- Frontend boot failure (blank page/asset load failure).

Rollback procedure:
1. Re-upload backup files from Phase 2 in reverse order:
   - index.html first (to point to old assets)
   - old JS/CSS assets
   - backend PHP file(s)
2. Re-run Phase 4 checks.
3. Keep incident notes in HISTORIAL_AJUSTES.md and DEPLOYMENT_STATUS_2026-05-01.md.

## Guardrails to adopt now
1. Do not hardcode hashed asset names in reusable deploy scripts.
2. Generate deploy file lists from current frontend/dist/index.html references.
3. Keep credentials out of repository scripts; pass via environment variables at runtime.
4. Keep selective deploy scripts per incident instead of full-project FTP sync.

## Current risks found in existing scripts
- upload_selected_files.ps1 includes old asset names that can drift from current build.
- upload_frontend.ps1 recursively uploads dist without enforcing assets-before-index ordering.
- Multiple scripts embed FTP credentials directly.

## Minimum safe command sequence (operator checklist)
1. Build and verify local artifacts.
2. Download production backups for target files.
3. Upload backend fixes.
4. Upload JS/CSS assets.
5. Upload index.html.
6. Run automated endpoint checks.
7. Perform manual login/logout + registration smoke.
8. If any regression, rollback immediately.
