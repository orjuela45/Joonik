@echo off
echo 🚀 Iniciando backend Laravel...
echo.

REM Verificar que el proyecto Laravel existe
if not exist "backend\artisan" (
    echo ❌ No se encontró el proyecto Laravel en la carpeta backend
    echo    Asegúrate de que el proyecto esté creado primero
    pause
    exit /b 1
)

REM Cambiar al directorio backend
cd backend

REM Verificar que las dependencias estén instaladas
if not exist "vendor" (
    echo 📦 Instalando dependencias de Composer...
    composer install
)

REM Verificar que existe el archivo .env
if not exist ".env" (
    echo ⚙️ Configurando archivo .env...
    copy .env.example .env
    php artisan key:generate
)

REM Verificar que la base de datos esté configurada
if not exist "database\database.sqlite" (
    echo 🗄️ Creando base de datos SQLite...
    echo. > database\database.sqlite
    php artisan migrate
)

echo ✅ Backend configurado correctamente
echo 🌐 Iniciando servidor en http://localhost:8000
echo.
echo 📋 Endpoints disponibles:
echo    GET  /api/v1/health     - Health check
echo    POST /api/v1/auth      - Autenticación
echo    GET  /api/v1/locations - Obtener ubicaciones
echo    POST /api/v1/locations - Crear ubicación
echo.
echo 🔑 API Key requerida: joonik-secret-api-key-2024
echo.
echo ⚠️  Presiona Ctrl+C para detener el servidor
echo.

REM Iniciar el servidor Laravel
php artisan serve