param(
  [string]$FtpHost = "ftp.dataholics.com.mx",
  [string]$FtpUser = $env:SC_FTP_USER,
  [string]$FtpPass = $env:SC_FTP_PASS,
  [switch]$Execute
)

$ErrorActionPreference = "Stop"

$base = "c:\Users\luisc\Documents\Dataholics\Dataholics Guidelines\UW_SomosComunidad"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = Join-Path $base "deploy_files\backups\$timestamp"
$tmpVerifyDir = Join-Path $base "deploy_files\tmp_verify\$timestamp"

$affectedFiles = @(
  @{ Local = "$base\api\app\Controllers\Registrations.php"; Remote = "/api/app/Controllers/Registrations.php"; Kind = "backend" },
  @{ Local = "$base\frontend\dist\assets\index-TGy9gvWS.js"; Remote = "/assets/index-TGy9gvWS.js"; Kind = "asset" },
  @{ Local = "$base\frontend\dist\assets\index-BmhZNNYw.css"; Remote = "/assets/index-BmhZNNYw.css"; Kind = "asset" },
  @{ Local = "$base\frontend\dist\index.html"; Remote = "/index.html"; Kind = "index" }
)

function Require-Inputs {
  if ([string]::IsNullOrWhiteSpace($FtpUser) -or [string]::IsNullOrWhiteSpace($FtpPass)) {
    throw "FTP credentials missing. Set SC_FTP_USER and SC_FTP_PASS env vars or pass -FtpUser and -FtpPass."
  }
}

function Assert-LocalFiles {
  foreach ($f in $affectedFiles) {
    if (-not (Test-Path $f.Local)) {
      throw "Missing local file: $($f.Local)"
    }
  }
}

function Download-RemoteFile {
  param([string]$remotePath, [string]$targetPath)
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $targetPath) | Out-Null
  & curl.exe --silent --show-error --user "${FtpUser}:${FtpPass}" "ftp://${FtpHost}${remotePath}" -o "$targetPath"
  return ($LASTEXITCODE -eq 0)
}

function Upload-File {
  param([string]$localPath, [string]$remotePath)
  & curl.exe --silent --show-error --ftp-create-dirs -T "$localPath" --user "${FtpUser}:${FtpPass}" "ftp://${FtpHost}${remotePath}"
  if ($LASTEXITCODE -ne 0) {
    throw "Upload failed for $remotePath"
  }
}

function Sha256 {
  param([string]$filePath)
  return (Get-FileHash -Algorithm SHA256 -Path $filePath).Hash
}

function Verify-RemoteMatchesLocal {
  param([string]$localPath, [string]$remotePath)
  $verifyTarget = Join-Path $tmpVerifyDir ((Split-Path -Leaf $localPath) + ".remote")
  $ok = Download-RemoteFile -remotePath $remotePath -targetPath $verifyTarget
  if (-not $ok) {
    throw "Verify download failed for $remotePath"
  }

  $localHash = Sha256 -filePath $localPath
  $remoteHash = Sha256 -filePath $verifyTarget

  if ($localHash -ne $remoteHash) {
    throw "Hash mismatch for $remotePath"
  }

  Write-Host "VERIFY OK: $remotePath" -ForegroundColor Green
}

function Smoke-Check {
  $checks = @(
    @{ Url = "https://somoscomunidad.dataholics.com.mx/api/activities"; Expected = 200 },
    @{ Url = "https://somoscomunidad.dataholics.com.mx/api/registrations/my-events"; Expected = 401; Header = "Authorization: Bearer invalid" },
    @{ Url = "https://somoscomunidad.dataholics.com.mx/"; Expected = 200 },
    @{ Url = "https://somoscomunidad.dataholics.com.mx/assets/index-TGy9gvWS.js"; Expected = 200 },
    @{ Url = "https://somoscomunidad.dataholics.com.mx/assets/index-BmhZNNYw.css"; Expected = 200 }
  )

  foreach ($c in $checks) {
    $args = @("-s", "-o", "NUL", "-w", "%{http_code}", $c.Url)
    if ($c.ContainsKey("Header")) {
      $args = @("-s", "-o", "NUL", "-w", "%{http_code}", "-H", $c.Header, $c.Url)
    }

    $code = (& curl.exe @args)
    if ([int]$code -ne [int]$c.Expected) {
      throw "Smoke check failed for $($c.Url). Expected $($c.Expected), got $code"
    }

    Write-Host "SMOKE OK: $($c.Url) -> $code" -ForegroundColor Green
  }
}

function Backup-CurrentRemoteFiles {
  New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
  foreach ($f in $affectedFiles) {
    $name = ($f.Remote.TrimStart('/') -replace '/', '__') + ".bak"
    $target = Join-Path $backupDir $name
    $downloaded = Download-RemoteFile -remotePath $f.Remote -targetPath $target
    if ($downloaded) {
      Write-Host "BACKUP OK: $($f.Remote)" -ForegroundColor DarkGreen
    } else {
      Write-Host "BACKUP WARN: $($f.Remote) not downloaded (may not exist yet)" -ForegroundColor Yellow
    }
  }
}

function Deploy-Ordered {
  $backend = $affectedFiles | Where-Object { $_.Kind -eq "backend" }
  $assets  = $affectedFiles | Where-Object { $_.Kind -eq "asset" }
  $index   = $affectedFiles | Where-Object { $_.Kind -eq "index" }

  foreach ($f in $backend) {
    Write-Host "UPLOAD backend: $($f.Remote)" -ForegroundColor Cyan
    Upload-File -localPath $f.Local -remotePath $f.Remote
    Verify-RemoteMatchesLocal -localPath $f.Local -remotePath $f.Remote
  }

  foreach ($f in $assets) {
    Write-Host "UPLOAD asset: $($f.Remote)" -ForegroundColor Cyan
    Upload-File -localPath $f.Local -remotePath $f.Remote
    Verify-RemoteMatchesLocal -localPath $f.Local -remotePath $f.Remote
  }

  foreach ($f in $index) {
    Write-Host "UPLOAD index: $($f.Remote)" -ForegroundColor Cyan
    Upload-File -localPath $f.Local -remotePath $f.Remote
    Verify-RemoteMatchesLocal -localPath $f.Local -remotePath $f.Remote
  }
}

Write-Host "SAFE SELECTIVE DEPLOY" -ForegroundColor Magenta
Write-Host "This process does NOT run SQL, migrations, truncates, or bulk site uploads." -ForegroundColor Magenta

Assert-LocalFiles

if (-not $Execute) {
  Write-Host "Dry run only. Use -Execute to perform backup+upload+verify+smoke." -ForegroundColor Yellow
  Write-Host "Files to deploy:" -ForegroundColor Yellow
  $affectedFiles | ForEach-Object { Write-Host " - $($_.Remote)" }
  exit 0
}

Require-Inputs
Backup-CurrentRemoteFiles
Deploy-Ordered
Smoke-Check

Write-Host "DONE: selective deploy completed safely." -ForegroundColor Green
Write-Host "Backup folder: $backupDir" -ForegroundColor Green
