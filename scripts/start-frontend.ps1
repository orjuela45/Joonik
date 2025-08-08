# Iniciar frontend React
Write-Host "Iniciando frontend React..." -ForegroundColor Green
Write-Host ""

# Verificar que el proyecto React existe
if (-not (Test-Path "frontend\package.json")) {
    Write-Host "No se encontró el proyecto React en la carpeta frontend" -ForegroundColor Red
    Write-Host "    Asegúrate de que el proyecto esté creado primero" -ForegroundColor Yellow
    Read-Host "Presiona Enter para continuar"
    exit 1
}

# Cambiar al directorio del frontend
Set-Location frontend

# Verificar que las dependencias estén instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias de npm..." -ForegroundColor Blue
    npm install
}

Write-Host "Frontend configurado correctamente" -ForegroundColor Green
Write-Host "Iniciando servidor en http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Características del proyecto:" -ForegroundColor Blue
Write-Host "    - React con TypeScript" -ForegroundColor Cyan
Write-Host "    - Material-UI para componentes" -ForegroundColor Cyan
Write-Host "    - Axios para peticiones HTTP" -ForegroundColor Cyan
Write-Host "    - React Hook Form para formularios" -ForegroundColor Cyan
Write-Host "    - Zod para validación" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API: http://localhost:8000/api/v1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Red
Write-Host ""

# Iniciar el servidor de desarrollo
npm run dev