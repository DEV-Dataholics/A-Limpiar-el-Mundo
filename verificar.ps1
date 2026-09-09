# Compuerta de Calidad Integral - Desarrollo Ágil Dataholics
$Raiz = $PSScriptRoot

# Detección de directorios Frontend y Backend
$Web = $null
if (Test-Path (Join-Path $Raiz "frontend")) {
    $Web = Join-Path $Raiz "frontend"
} elseif (Test-Path (Join-Path $Raiz "apps\web")) {
    $Web = Join-Path $Raiz "apps\web"
}

$Api = $null
if (Test-Path (Join-Path $Raiz "api")) {
    $Api = Join-Path $Raiz "api"
} elseif (Test-Path (Join-Path $Raiz "apps\api")) {
    $Api = Join-Path $Raiz "apps\api"
}

$Fallas = 0

Write-Host ""
Write-Host "=================================================="
Write-Host ">>> 1. Frontend: Typecheck (tsc --noEmit)"
Write-Host "=================================================="
if ($Web -and (Test-Path $Web)) {
    Set-Location $Web
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[FAIL] Frontend Typecheck fallo" -ForegroundColor Red
        $Fallas++
    } else {
        Write-Host "[OK] Frontend Typecheck paso" -ForegroundColor Green
    }
} else {
    Write-Host "[INFO] Carpeta frontend/web no encontrada, saltando..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================================="
Write-Host ">>> 2. Frontend: Lint (oxlint / eslint)"
Write-Host "=================================================="
if ($Web -and (Test-Path $Web)) {
    Set-Location $Web
    if (Test-Path "node_modules") {
        npx --yes oxlint
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[FAIL] Frontend Lint fallo" -ForegroundColor Red
            $Fallas++
        } else {
            Write-Host "[OK] Frontend Lint paso" -ForegroundColor Green
        }
    } else {
        Write-Host "[WARN] node_modules no encontrado en frontend. Ejecuta 'npm install'." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=================================================="
Write-Host ">>> 3. Backend: Rutas de API"
Write-Host "=================================================="
if ($Api -and (Test-Path $Api)) {
    Set-Location $Api
    if ((Test-Path "spark") -and (Test-Path "vendor")) {
        php spark routes
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[FAIL] Backend Rutas fallo" -ForegroundColor Red
            $Fallas++
        } else {
            Write-Host "[OK] Backend Rutas paso" -ForegroundColor Green
        }
    } elseif (!(Test-Path "vendor")) {
        Write-Host "[WARN] vendor no encontrado en backend. Ejecuta 'composer install'." -ForegroundColor Yellow
    } else {
        Write-Host "[INFO] Archivo spark no encontrado en backend, saltando..." -ForegroundColor Yellow
    }
} else {
    Write-Host "[INFO] Carpeta backend/api no encontrada, saltando..." -ForegroundColor Yellow
}

Set-Location $Raiz

Write-Host ""
Write-Host "=================================================="
if ($Fallas -eq 0) {
    Write-Host "[OK] COMPUERTA EN VERDE - Todos los chequeos pasaron correctamente." -ForegroundColor Green
    exit 0
} else {
    Write-Host "[FAIL] COMPUERTA ROJA - $Fallas chequeos fallaron." -ForegroundColor Red
    exit 1
}
