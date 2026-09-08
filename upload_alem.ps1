# FTP Upload Script for A Limpiar el Mundo

$FTP_HOST    = "ftp.dataholics.com.mx"
$FTP_USER    = "DEV-UW@alimpiarelmundo.dataholics.com.mx"
$FTP_PASS    = "itc=imD3B=LU"
$REMOTE_ROOT = "/"
$BASE        = "C:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\proyectos\A Limpiar el Mundo"

$ErrorCount = 0
$SuccessCount = 0

function Upload-File {
    param([string]$LocalPath, [string]$RemotePath)
    $url = "ftp://${FTP_HOST}${RemotePath}"
    $result = & curl.exe --ftp-create-dirs -T "$LocalPath" `
        --user "${FTP_USER}:${FTP_PASS}" "$url" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: $RemotePath"
        $script:SuccessCount++
    } else {
        Write-Warning "FAIL: $RemotePath -> $result"
        $script:ErrorCount++
    }
}

function Upload-Dir {
    param([string]$LocalDir, [string]$RemoteDir)
    Get-ChildItem -Path $LocalDir -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($LocalDir.Length).Replace('\','/')
        Upload-File -LocalPath $_.FullName -RemotePath "${RemoteDir}${rel}"
    }
}

Write-Host "`n=== Uploading frontend (dist/) ===" -ForegroundColor Cyan
Upload-Dir -LocalDir "$BASE\frontend\dist" -RemoteDir "$REMOTE_ROOT"

Write-Host "`n=== Uploading backend (api/) ===" -ForegroundColor Cyan
$apiExclude = @('.env', '.env.production-template', 'mysql-credentials.offline.local', '.env.production')
Get-ChildItem -Path "$BASE\api" -Recurse -File | Where-Object {
    $_.Name -notin $apiExclude -and $_.FullName -notmatch '\\\.git\\' -and $_.FullName -notmatch '\\tests\\'
} | ForEach-Object {
    $rel = $_.FullName.Substring("$BASE\api".Length).Replace('\','/')
    Upload-File -LocalPath $_.FullName -RemotePath "${REMOTE_ROOT}api${rel}"
}

Write-Host "`n=== Upload Summary ===" -ForegroundColor Cyan
Write-Host "Success: $SuccessCount files" -ForegroundColor Green
if ($ErrorCount -gt 0) {
    Write-Host "Errors:  $ErrorCount files" -ForegroundColor Red
} else {
    Write-Host "No errors!" -ForegroundColor Green
}
