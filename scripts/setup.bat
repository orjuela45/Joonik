@echo off
echo 🚀 Verificando dependencias del proyecto Joonik...
echo.

REM Verificar que PHP esté instalado
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHP no está instalado. Por favor instala PHP 8.2+ primero.
    echo    Puedes descargarlo desde: https://www.php.net/downloads
    pause
    exit /b 1
)

REM Verificar que Composer esté instalado
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Composer no está instalado. Por favor instala Composer primero.
    echo    Puedes descargarlo desde: https://getcomposer.org/download/
    pause
    exit /b 1
)

REM Verificar que Node.js esté instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18+ primero.
    echo    Puedes descargarlo desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ PHP, Composer y Node.js están instalados
echo.

REM Instalar dependencias del backend si existen
if exist "backend\composer.json" (
    echo 📦 Instalando dependencias del backend...
    cd backend
    composer install
    cd ..
)

REM Instalar dependencias del frontend si existen
if exist "frontend\package.json" (
    echo 📦 Instalando dependencias del frontend...
    cd frontend
    npm install
    cd ..
)

echo.
echo 🎉 ¡Dependencias instaladas!
echo.
echo 📋 Para levantar el proyecto usa:
echo    Backend:  scripts\start-backend.bat
echo    Frontend: scripts\start-frontend.bat
echo.
echo 📚 URLs disponibles:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    API:      http://localhost:8000/api/v1
echo.
echo 🔑 API Key: joonik-secret-api-key-2024
echo.
pause