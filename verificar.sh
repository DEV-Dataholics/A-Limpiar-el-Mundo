#!/usr/bin/env bash
# Compuerta de Calidad Integral - Desarrollo Ágil Dataholics
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Detección de directorios Frontend y Backend
WEB=""
if [ -d "$RAIZ/frontend" ]; then
    WEB="$RAIZ/frontend"
elif [ -d "$RAIZ/apps/web" ]; then
    WEB="$RAIZ/apps/web"
fi

API=""
if [ -d "$RAIZ/api" ]; then
    API="$RAIZ/api"
elif [ -d "$RAIZ/apps/api" ]; then
    API="$RAIZ/apps/api"
fi

FALLAS=0

echo ""
echo "=================================================="
echo ">>> 1. Frontend: Typecheck (tsc --noEmit)"
echo "=================================================="
if [ -n "$WEB" ] && [ -d "$WEB" ]; then
    cd "$WEB"
    npx tsc --noEmit
    if [ $? -ne 0 ]; then
        echo -e "\033[0;31m[FAIL] Frontend Typecheck fallo\033[0m"
        FALLAS=$((FALLAS + 1))
    else
        echo -e "\033[0;32m[OK] Frontend Typecheck paso\033[0m"
    fi
else
    echo "[INFO] Carpeta frontend/web no encontrada, saltando..."
fi

echo ""
echo "=================================================="
echo ">>> 2. Frontend: Lint"
echo "=================================================="
if [ -n "$WEB" ] && [ -d "$WEB" ]; then
    cd "$WEB"
    if [ -d "node_modules" ]; then
        npx --yes oxlint
        if [ $? -ne 0 ]; then
            echo -e "\033[0;31m[FAIL] Frontend Lint fallo\033[0m"
            FALLAS=$((FALLAS + 1))
        else
            echo -e "\033[0;32m[OK] Frontend Lint paso\033[0m"
        fi
    else
        echo -e "\033[0;33m[WARN] node_modules no encontrado en frontend. Ejecuta 'npm install'.\033[0m"
    fi
fi

echo ""
echo "=================================================="
echo ">>> 3. Backend: Rutas de API"
echo "=================================================="
if [ -n "$API" ] && [ -d "$API" ]; then
    cd "$API"
    if [ -f "spark" ] && [ -d "vendor" ]; then
        php spark routes
        if [ $? -ne 0 ]; then
            echo -e "\033[0;31m[FAIL] Backend Rutas fallo\033[0m"
            FALLAS=$((FALLAS + 1))
        else
            echo -e "\033[0;32m[OK] Backend Rutas paso\033[0m"
        fi
    elif [ ! -d "vendor" ]; then
        echo -e "\033[0;33m[WARN] vendor no encontrado en backend. Ejecuta 'composer install'.\033[0m"
    else
        echo "[INFO] Archivo spark no encontrado en backend, saltando..."
    fi
else
    echo "[INFO] Carpeta backend/api no encontrada, saltando..."
fi

cd "$RAIZ"

echo ""
echo "=================================================="
if [ $FALLAS -eq 0 ]; then
    echo -e "\033[0;32m[OK] COMPUERTA EN VERDE - Todos los chequeos pasaron correctamente.\033[0m"
    exit 0
else
    echo -e "\033[0;31m[FAIL] COMPUERTA ROJA - $FALLAS chequeos fallaron.\033[0m"
    exit 1
fi
