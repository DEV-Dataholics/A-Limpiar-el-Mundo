$FTP_HOST    = "ftp.dataholics.com.mx"
$FTP_USER    = "SC_DEV@dataholics.com.mx"
$FTP_PASS    = "b}%gI?we_2vz"
$REMOTE_ROOT = "/"
$BASE        = "c:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\UW_SomosComunidad"

function Upload-File {
    param([string]$LocalPath, [string]$RemotePath)
    $url = "ftp://${FTP_HOST}${RemotePath}"
    $result = & curl.exe --ftp-create-dirs -T "$LocalPath" --user "${FTP_USER}:${FTP_PASS}" "$url" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: $RemotePath"
    } else {
        Write-Warning "FAIL: $RemotePath -> $result"
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
