# Site5 Fix Deployment Script - Somos Comunidad
# Uploads only the 3 fix files needed to unblock PHP 500 errors

$FTP_HOST    = "ftp.dataholics.com.mx"
$FTP_USER    = "SC_DEV@dataholics.com.mx"
$FTP_PASS    = "b}%gI?we_2vz"
$REMOTE_ROOT = "/"
$BASE        = "c:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\UW_SomosComunidad"

$ErrorCount   = 0
$SuccessCount = 0

function Upload-File {
    param([string]$LocalPath, [string]$RemotePath)
    $url = "ftp://${FTP_HOST}${RemotePath}"
    Write-Host "  Uploading: $RemotePath" -ForegroundColor DarkGray
    $result = & curl.exe --ftp-create-dirs -T "$LocalPath" `
        --user "${FTP_USER}:${FTP_PASS}" "$url" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ OK: $RemotePath" -ForegroundColor Green
        $script:SuccessCount++
    } else {
        Write-Warning "  ❌ FAIL: $RemotePath -> $result"
        $script:ErrorCount++
    }
}

Write-Host "`n=== STEP 1: Upload PHP probe (diagnostic) ===" -ForegroundColor Cyan
Upload-File `
    -LocalPath "$BASE\deploy_files\phpinfo_probe.php" `
    -RemotePath "$REMOTE_ROOT/phpinfo_probe.php"

Write-Host "`n=== STEP 2: Upload corrected production .env ===" -ForegroundColor Cyan
Upload-File `
    -LocalPath "$BASE\deploy_files\api_env_production" `
    -RemotePath "$REMOTE_ROOT/api/.env"

Write-Host "`n=== STEP 3: Upload corrected root .htaccess ===" -ForegroundColor Cyan
Upload-File `
    -LocalPath "$BASE\deploy_files\htaccess_root" `
    -RemotePath "$REMOTE_ROOT/.htaccess"

Write-Host "`n=== Upload Summary ===" -ForegroundColor Cyan
Write-Host "Success: $SuccessCount / 3 files" -ForegroundColor $(if ($SuccessCount -eq 3) { "Green" } else { "Yellow" })
if ($ErrorCount -gt 0) {
    Write-Host "Errors:  $ErrorCount files" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== NEXT: Test the probe ===" -ForegroundColor Magenta
Write-Host "Open this URL in your browser:"
Write-Host "  https://somoscomunidad.dataholics.com.mx/phpinfo_probe.php" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected results:"
Write-Host "  - PHP Version shown -> PHP execution works"
Write-Host "  - All extensions green (intl, mbstring, pdo_mysql...) -> CI should boot"
Write-Host "  - DB connection OK -> credentials are correct"
Write-Host "  - writable/ dirs show writable -> CI can log/cache"
Write-Host ""
Write-Host "If probe itself returns 500 -> open Site5 ticket (PHP handler broken at server level)"
Write-Host "If probe shows results -> test https://somoscomunidad.dataholics.com.mx/api/activities"
