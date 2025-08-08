# Iniciar backend Laravel
Write-Host "Iniciando backend Laravel..." -ForegroundColor Green
Write-Host ""

# Verificar que el proyecto Laravel existe
if (-not (Test-Path "backend\artisan")) {
    Write-Host "No se encontró el proyecto Laravel en la carpeta backend" -ForegroundColor Red
    Write-Host "    Asegúrate de que el proyecto esté creado primero" -ForegroundColor Yellow
    Read-Host "Presiona Enter para continuar"
    exit 1
}

# Cambiar al directorio del backend
Set-Location backend

# Verificar que las dependencias estén instaladas
if (-not (Test-Path "vendor")) {
    Write-Host "Instalando dependencias de Composer..." -ForegroundColor Blue
    composer install
}

# Verificar que existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "Configurando archivo .env..." -ForegroundColor Blue
    Copy-Item ".env.example" ".env"
    php artisan key:generate
}

# Verificar que la base de datos esté configurada
if (-not (Test-Path "database\database.sqlite")) {
    Write-Host "Creando base de datos SQLite..." -ForegroundColor Blue
    New-Item -Path "database\database.sqlite" -ItemType File -Force
    php artisan migrate
}

Write-Host "Backend configurado correctamente" -ForegroundColor Green
Write-Host "Iniciando servidor en http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Endpoints disponibles:" -ForegroundColor Blue
Write-Host "    GET  /api/v1/health     - Health check" -ForegroundColor Cyan
Write-Host "    POST /api/v1/auth      - Autenticación" -ForegroundColor Cyan
Write-Host "    GET  /api/v1/locations - Listar ubicaciones" -ForegroundColor Cyan
Write-Host "    POST /api/v1/locations - Crear ubicación" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Key requerida: joonik-secret-api-key-2024" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Red
Write-Host ""

# Iniciar el servidor Laravel
php artisan serve