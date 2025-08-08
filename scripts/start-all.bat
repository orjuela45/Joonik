@echo off
echo 🚀 Iniciando proyecto completo Joonik...
echo.

REM Verificar que ambos proyectos existen
if not exist "backend\artisan" (
    echo ❌ No se encontró el proyecto Laravel en la carpeta backend
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ No se encontró el proyecto React en la carpeta frontend
    pause
    exit /b 1
)

echo ✅ Proyectos encontrados
echo 🚀 Iniciando backend y frontend...
echo.

REM Iniciar backend en una nueva ventana
start "Joonik Backend" cmd /k "cd /d %~dp0..\backend && php artisan serve"

REM Esperar un momento para que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend en una nueva ventana
start "Joonik Frontend" cmd /k "cd /d %~dp0..\frontend && npm start"

echo 🎉 ¡Servicios iniciados!
echo.
echo 📋 URLs disponibles:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    API:      http://localhost:8000/api/v1
echo.
echo 🔑 API Key: joonik-secret-api-key-2024
echo.
echo 📝 Se han abierto dos ventanas de terminal:
echo    - Una para el backend Laravel
echo    - Una para el frontend React
echo.
echo ⚠️  Cierra las ventanas de terminal para detener los servicios
echo.
pause