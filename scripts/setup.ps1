# Configuración del proyecto Joonik
Write-Host "[SETUP] Verificando dependencias del proyecto Joonik..." -ForegroundColor Green
Write-Host ""

# Verificar PHP
try {
    $phpVersion = php --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] PHP encontrado:" -ForegroundColor Green
        Write-Host "    $($phpVersion.Split("`n")[0])" -ForegroundColor Cyan
    } else {
        throw "PHP no encontrado"
    }
} catch {
    Write-Host "[ERROR] PHP no esta instalado. Por favor instala PHP 8.2+ primero." -ForegroundColor Red
    Write-Host "    Puedes descargarlo desde: https://www.php.net/downloads" -ForegroundColor Yellow
    Read-Host "Presiona Enter para continuar"
    exit 1
}

# Verificar Composer
try {
    $composerVersion = composer --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Composer encontrado:" -ForegroundColor Green
        Write-Host "    $composerVersion" -ForegroundColor Cyan
    } else {
        throw "Composer no encontrado"
    }
} catch {
    Write-Host "[ERROR] Composer no esta instalado. Por favor instala Composer primero." -ForegroundColor Red
    Write-Host "    Puedes descargarlo desde: https://getcomposer.org/download/" -ForegroundColor Yellow
    Read-Host "Presiona Enter para continuar"
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Node.js encontrado:" -ForegroundColor Green
        Write-Host "    $nodeVersion" -ForegroundColor Cyan
    } else {
        throw "Node.js no encontrado"
    }
} catch {
    Write-Host "[ERROR] Node.js no esta instalado. Por favor instala Node.js 18+ primero." -ForegroundColor Red
    Write-Host "    Puedes descargarlo desde: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Presiona Enter para continuar"
    exit 1
}

Write-Host "[OK] PHP, Composer y Node.js estan instalados" -ForegroundColor Green
Write-Host ""

# Instalar dependencias del backend si existen
if (Test-Path "backend\composer.json") {
    Write-Host "[INFO] Instalando dependencias del backend..." -ForegroundColor Blue
    Set-Location backend
    composer install
    Set-Location ..
}

# Instalar dependencias del frontend si existen
if (Test-Path "frontend\package.json") {
    Write-Host "[INFO] Instalando dependencias del frontend..." -ForegroundColor Blue
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "[SUCCESS] Dependencias instaladas!" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Para levantar el proyecto usa:" -ForegroundColor Blue
Write-Host "    Backend:  .\scripts\start-backend.ps1" -ForegroundColor Cyan
Write-Host "    Frontend: .\scripts\start-frontend.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] URLs disponibles:" -ForegroundColor Blue
Write-Host "    Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "    Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "    API:      http://localhost:8000/api/v1" -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] API Key: joonik-secret-api-key-2024" -ForegroundColor Blue
Write-Host ""
Read-Host "Presiona Enter para continuar"