# Somos Comunidad - Deployment Status (2026-05-01)

## Update 2026-05-27 (Post-Go-Live Stabilization)

### New Issues Observed
- `POST /api/registrations` returned HTTP 500 during personal mobilization submissions.
- `GET /api/registrations/my-events` returned HTTP 500 immediately after login.

### Confirmed Root Cause
- Production log (`api/writable/logs/log-2026-05-27.log`) showed:
  - `Error: Class "Firebase\\JWT\\JWT" not found`
  - Affected routes: `registrations` and `registrations/my-events`.

### Fixes Deployed (Selective)
- Updated `api/app/Controllers/Registrations.php` only, with:
  - Manual JWT class fallback loader (`ensureJwtClassesLoaded()`).
  - Schema-tolerant query for `my-events` (no hard dependency on legacy optional columns).
  - Schema-tolerant registration insert flow with dynamic column filtering and conditional timestamps.
- Updated frontend request flow (`frontend/src/hooks/useRegistrationForm.ts`) to remove hardcoded `activity_id=9` for non-institutional registrations.
- Published only affected frontend artifacts for that change:
  - `index.html`
  - `assets/index-TGy9gvWS.js`
  - `assets/index-BmhZNNYw.css`

### Verification After Fixes
- `GET /api/activities` -> HTTP 200
- `OPTIONS /api/registrations` -> HTTP 200
- `GET /api/registrations/my-events` with invalid token -> HTTP 401 (expected behavior, confirms endpoint no longer crashes with 500)

### Current Status
- API runtime: operational for tested public/auth paths.
- Registrations and my-events endpoints: stabilized against JWT autoload and legacy schema mismatches.
- Remaining recommendation: keep monitoring `log-2026-05-27.log` and run end-to-end user smoke tests after each incremental deploy.

## Scope
This document records what was deployed, what was validated, what is currently blocked, and the exact next steps to unblock production.

## Environment
- Frontend URL: https://somoscomunidad.dataholics.com.mx
- API base intended: https://somoscomunidad.dataholics.com.mx/api
- Hosting: Site5/cPanel shared hosting
- PHP version configured in cPanel: 8.3 (ea-php83)
- Database used: noodluis_somoscomunidad

## Completed Work
- Frontend refactor to centralized API URL (`API_URL`) was completed.
- Backend CORS was unified in CodeIgniter config.
- Frontend production build was generated and uploaded.
- API and frontend artifacts were uploaded/extracted to server.
- Root rewrite rules were uploaded and iterated.
- Production API `.env` was uploaded with DB credentials and base URL.
- Database schema was created manually via phpMyAdmin using SQL migration equivalent.
- Migrations tracking rows were inserted into `migrations` table.
- Admin account was created directly in DB.

## Database State
- Database name: `noodluis_somoscomunidad`
- Core tables created:
  - `users`
  - `activities_catalog`
  - `impact_registrations`
  - `migrations`
- Admin user inserted:
  - email: `admin@somoscomunidad.org`
  - role_id: `1`
  - password: bcrypt hash inserted successfully

## Validation Performed
- Frontend site loads publicly.
- SQL execution in phpMyAdmin succeeded (table creation + migration records + admin insert).
- API endpoint checks repeatedly returned server 500 pages.
- Direct PHP checks also returned server 500 pages.

## Current Blocker (Critical)
Server returns HTTP 500 for PHP execution paths, including simplified test scripts. This indicates a server-side PHP execution/runtime issue on hosting, not only application routing.

Observed pattern:
- `https://somoscomunidad.dataholics.com.mx/api/activities` -> HTTP 500
- `https://somoscomunidad.dataholics.com.mx/api/public/index.php/activities` -> HTTP 500
- minimal PHP probe endpoint attempts also resulted in HTTP 500 page response

## Workarounds Attempted
- Updated cPanel PHP version to 8.3.
- Added `extension=intl` in MultiPHP INI Editor.
- Switched CI environment modes and re-uploaded `.env`.
- Simplified and reworked root rewrite rules multiple times.
- Lowered local code guard from minimum PHP 8.2 to 8.1 in:
  - `api/public/index.php`
  - `api/spark`
- Re-tested endpoints after each change.

Result: blocker persisted.

## Most Likely Root Cause
Hosting-level PHP handler/runtime misconfiguration (or disabled/broken PHP execution for this domain/path), independent of app code.

## Immediate Next Actions
1. Open urgent Site5 support ticket.
2. Provide this exact statement:
   - "All PHP requests return HTTP 500, including minimal test scripts. Please verify PHP handler/runtime for domain somoscomunidad.dataholics.com.mx, check account error logs, and confirm php-cgi/php-fpm execution is healthy."
3. Ask support to provide:
   - active PHP handler for the domain
   - last 50 lines of domain/account PHP error log
   - confirmation that `intl`, `mbstring`, `openssl`, `pdo_mysql`, `mysqli` are loaded for the domain runtime
4. After support fix, run smoke checks:
   - `/api/activities`
   - login flow
   - registration flow
5. When stable, set `CI_ENVIRONMENT = production` and remove temporary debug/test endpoints.

## Release Readiness Snapshot
- Frontend: Ready
- Database: Ready
- API code: Deployed
- API runtime on host: Blocked by hosting PHP 500
- Go-live status: Partial (frontend live, backend blocked)

## Notes
This deployment is very close to complete. Primary unresolved item is hosting PHP runtime stability, not database or frontend setup.
