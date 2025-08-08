# Iniciar proyecto completo Joonik
Write-Host "Iniciando proyecto completo Joonik..." -ForegroundColor Green
Write-Host ""

# Verificar que ambos proyectos existen
if (-not (Test-Path "backend\artisan")) {
    Write-Host "No se encontró el proyecto Laravel en la carpeta backend" -ForegroundColor Red
    Read-Host "Presiona Enter para continuar"
    exit 1
}

if (-not (Test-Path "frontend\package.json")) {
    Write-Host "No se encontró el proyecto React en la carpeta frontend" -ForegroundColor Red
    Read-Host "Presiona Enter para continuar"
    exit 1
}

Write-Host "Proyectos encontrados" -ForegroundColor Green
Write-Host "Iniciando backend y frontend..." -ForegroundColor Blue
Write-Host ""

# Obtener la ruta actual
$currentPath = Get-Location

# Iniciar backend en nueva ventana de PowerShell
Write-Host "[INFO] Iniciando backend en nueva ventana..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$currentPath'; .\scripts\start-backend.ps1"

# Esperar un momento antes de iniciar el frontend
Start-Sleep -Seconds 2

# Iniciar frontend en nueva ventana de PowerShell
Write-Host "[INFO] Iniciando frontend en nueva ventana..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$currentPath'; .\scripts\start-frontend.ps1"

Write-Host "[SUCCESS] Aplicacion iniciada correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] URLs disponibles:" -ForegroundColor Blue
Write-Host "    Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "    Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "    API:      http://localhost:8000/api/v1" -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] API Key: joonik-secret-api-key-2024" -ForegroundColor Yellow
Write-Host ""
Write-Host "Se han abierto dos ventanas de PowerShell:" -ForegroundColor Blue
Write-Host "    - Una para el backend Laravel" -ForegroundColor Cyan
Write-Host "    - Una para el frontend React" -ForegroundColor Cyan
Write-Host ""
Write-Host "[WARNING] Cierra las ventanas de PowerShell para detener los servicios" -ForegroundColor Red
Write-Host ""
Read-Host "Presiona Enter para continuar"