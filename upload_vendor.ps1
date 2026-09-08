$FTP_HOST    = "ftp.dataholics.com.mx"
$FTP_USER    = "SC_DEV@dataholics.com.mx"
$FTP_PASS    = "b}%gI?we_2vz"
$REMOTE_ROOT = "/api/vendor"
$BASE        = "c:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\UW_SomosComunidad\api\vendor"

function Upload-File {
    param([string]$LocalPath, [string]$RemotePath)
    $url = "ftp://${FTP_HOST}${RemotePath}"
    $result = & curl.exe -s --ftp-create-dirs -T "$LocalPath" --user "${FTP_USER}:${FTP_PASS}" "$url" 2>&1
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

Upload-Dir -LocalDir "$BASE\firebase" -RemoteDir "$REMOTE_ROOT/firebase"
Upload-Dir -LocalDir "$BASE\composer" -RemoteDir "$REMOTE_ROOT/composer"
Upload-File -LocalPath "$BASE\autoload.php" -RemotePath "$REMOTE_ROOT/autoload.php"
