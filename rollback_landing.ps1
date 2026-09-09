# ============================================================
# Script de Reversión Inmediata (Rollback)
# Restaura el estado previo al merge de la rama landing
# ============================================================

Write-Host ">>> Iniciando reversión a estado previo..." -ForegroundColor Yellow

# 1. Revertir Git al punto de restauración (tag pre-landing-backup)
git reset --hard pre-landing-backup
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No se pudo revertir el estado de Git." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Código restaurado al commit previo al merge." -ForegroundColor Green

# 2. Revertir tabla de catálogo en base de datos si existe
$dbScript = @"
<?php
try {
    require_once __DIR__ . '/api/app/Config/Database.php';
    `$db = \Config\Database::connect();
    if (`$db->tableExists('activities_catalog')) {
        `$forge = \Config\Database::forge();
        `$forge->dropTable('activities_catalog', true);
        echo "[OK] Tabla activities_catalog eliminada para rollback.\n";
    }
} catch (\Throwable `$e) {
    echo "[WARN] Error verificando base de datos: " . `$e->getMessage() . "\n";
}
"@
Set-Content -Path "temp_rollback_db.php" -Value $dbScript
php temp_rollback_db.php
Remove-Item -Path "temp_rollback_db.php" -Force -ErrorAction SilentlyContinue

# 3. Reconstruir Frontend
Write-Host ">>> Reconstruyendo frontend previo..." -ForegroundColor Cyan
Set-Location "frontend"
npm run build
Set-Location ".."

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "[EXITO] Reversión completada al 100%. El sistema está en el estado previo." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
