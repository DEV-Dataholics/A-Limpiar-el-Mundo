# Production Publishing and Live Debugging Plan (Site5/cPanel)

1. **Prepare Production Build**
   - Build frontend (Vite/React) for production.
   - Ensure .env.production and config.ts use the production API URL.

2. **Backup Production Database**
   - Use cPanel’s phpMyAdmin to export a full backup before changes.

3. **Upload Backend and Frontend**
   - Use FTP or cPanel File Manager to upload latest backend (api/) and frontend (build/) files.
   - Overwrite old files, but do not delete .env or config files unless replacing them.

4. **Enable Debug Mode Temporarily**
   - In api/.env or app/Config/Boot/development.php, set `CI_ENVIRONMENT = development` to show errors for debugging.
   - Set back to `production` after debugging.

5. **Enable PHP intl Extension**
   - In cPanel, go to “Select PHP Version” or “PHP Extensions” and enable `intl`.
   - If not available, contact Site5 support.

6. **Run Database Migrations**
   - If you cannot run `php spark migrate` via SSH, use phpMyAdmin to manually apply migration SQL, or request support to run the command.

7. **Test the Application**
   - Access the site and verify all features.
   - Watch for errors—debug mode will show details.

8. **Debug and Fix**
   - If errors occur, review error messages, fix code or config, and re-upload as needed.

9. **Disable Debug Mode**
   - Set `CI_ENVIRONMENT = production` after confirming stability.

10. **Finalize**
   - Remove any leftover debug/test files.
   - Confirm CORS, JWT, and secret handling are secure.
