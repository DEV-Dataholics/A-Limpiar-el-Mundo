$FTP_HOST = "ftp.dataholics.com.mx"
$FTP_USER = "SC_DEV@dataholics.com.mx"
$FTP_PASS = 'b}%gI?we_2vz'

$files = @(
  @{ Local = "api/app/Controllers/Auth.php"; Remote = "/api/app/Controllers/Auth.php" },
  @{ Local = "api/app/Controllers/Admin/Metrics.php"; Remote = "/api/app/Controllers/Admin/Metrics.php" },
  @{ Local = "deploy_files/api_env_production"; Remote = "/api/.env" },
  @{ Local = "frontend/dist/index.html"; Remote = "/index.html" },
  @{ Local = "frontend/dist/assets/index-ClHoHkyv.js"; Remote = "/assets/index-ClHoHkyv.js" },
  @{ Local = "frontend/dist/assets/index-DXDpEImf.css"; Remote = "/assets/index-DXDpEImf.css" },
  @{ Local = "frontend/dist/assets/portada-Tc5astB_.jpg"; Remote = "/assets/portada-Tc5astB_.jpg" },
  @{ Local = "frontend/dist/favicon.png"; Remote = "/favicon.png" },
  @{ Local = "frontend/dist/favicon.svg"; Remote = "/favicon.svg" },
  @{ Local = "frontend/dist/icons.svg"; Remote = "/icons.svg" },
  @{ Local = "frontend/dist/image.png"; Remote = "/image.png" },
  @{ Local = "frontend/dist/somoscomunidad-logo.png"; Remote = "/somoscomunidad-logo.png" }
)

$ok = 0
$fail = 0
foreach ($f in $files) {
  if (-not (Test-Path $f.Local)) {
    Write-Host "MISSING: $($f.Local)" -ForegroundColor Yellow
    $fail++
    continue
  }

  $url = "ftp://$FTP_HOST$($f.Remote)"
  Write-Host "Uploading $($f.Local) -> $($f.Remote)" -ForegroundColor Cyan
  $result = & curl.exe --ftp-create-dirs -T "$($f.Local)" --user "$FTP_USER`:$FTP_PASS" "$url" 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK" -ForegroundColor Green
    $ok++
  } else {
    Write-Host "  FAIL: $result" -ForegroundColor Red
    $fail++
  }
}

Write-Host "UPLOAD_SUMMARY ok=$ok fail=$fail total=$($files.Count)"
