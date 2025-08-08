@echo off
echo 🚀 Iniciando frontend React...
echo.

REM Verificar que el proyecto React existe
if not exist "frontend\package.json" (
    echo ❌ No se encontró el proyecto React en la carpeta frontend
    echo    Asegúrate de que el proyecto esté creado primero
    pause
    exit /b 1
)

REM Cambiar al directorio frontend
cd frontend

REM Verificar que las dependencias estén instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias de npm...
    npm install
)

echo ✅ Frontend configurado correctamente
echo 🌐 Iniciando servidor en http://localhost:5173
echo.
echo 📋 Características del proyecto:
echo    ✓ React con TypeScript
echo    ✓ Material-UI para componentes
echo    ✓ Axios para peticiones HTTP
echo    ✓ React Hook Form para formularios
echo    ✓ Zod para validación
echo.
echo 🔗 Backend API: http://localhost:8000/api/v1
echo.
echo ⚠️  Presiona Ctrl+C para detener el servidor
echo.

REM Iniciar el servidor de desarrollo
npm run dev