# 🏢 Joonik - Full Stack Application

Aplicación full-stack desarrollada con Laravel (backend) y React + TypeScript (frontend) para la gestión de ubicaciones y autenticación mediante API Key.

## 📁 Estructura del Proyecto

```
joonik/
├── backend/          # API Laravel
├── frontend/         # Aplicación React + TypeScript
├── scripts/          # Scripts de automatización
├── docs/            # Documentación
├── CHANGELOG.md     # Registro de cambios
└── README.md        # Este archivo
```

## 🚀 Quick Setup

### Prerequisites
- PHP 8.2+ instalado
- Composer instalado
- Node.js 18+ instalado
- Git (para control de versiones)

### Installation

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd joonik
   ```

2. **Instalar dependencias**
   ```bash
   scripts\setup.bat
   ```

3. **Iniciar la aplicación**
   
   **Opción A: Iniciar ambos servicios**
   ```bash
   scripts\start-all.bat
   ```
   
   **Opción B: Iniciar individualmente**
   ```bash
   # Terminal 1 - Backend
   scripts\start-backend.bat
   
   # Terminal 2 - Frontend
   scripts\start-frontend.bat
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🛠️ Servicios Disponibles

### Backend (Laravel)
- **Puerto**: 8000
- **Base de datos**: SQLite
- **Autenticación**: API Key
- **Cache**: File-based

### Frontend (React + TypeScript)
- **Puerto**: 3000
- **UI Framework**: Material-UI
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod

## 📡 API Endpoints

### Autenticación
- `POST /api/v1/auth` - Autenticación con API Key

### Ubicaciones
- `GET /api/v1/locations` - Obtener todas las ubicaciones
- `POST /api/v1/locations` - Crear nueva ubicación
- `GET /api/v1/locations/{id}` - Obtener ubicación específica
- `PUT /api/v1/locations/{id}` - Actualizar ubicación
- `DELETE /api/v1/locations/{id}` - Eliminar ubicación

### Health Check
- `GET /api/v1/health` - Estado del servicio (sin API key requerida)

**Campos de Location:**
- `id` (integer, auto-increment)
- `code` (string, único, máx 50 caracteres)
- `name` (string, máx 255 caracteres)
- `image` (string, nullable, máx 500 caracteres)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**API Key requerida**: Configurada en variable de entorno `API_KEY` (default: `joonik-secret-api-key-2024`)
**Header requerido**: `X-API-Key: {tu-api-key}`

## 🔧 Comandos de Desarrollo

### Backend (Laravel)
```bash
cd backend

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Base de datos
php artisan migrate
php artisan migrate:fresh --seed

# Iniciar servidor
php artisan serve

# Tests
php artisan test

# Linting
./vendor/bin/pint
```

### Frontend (React)
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar desarrollo
npm start

# Build para producción
npm run build

# Tests
npm test

# Linting
npm run lint
npm run lint:fix
```

## 📊 Logging

- **Backend**: `backend/storage/logs/laravel.log`
- **Frontend**: Console del navegador

## 🧪 Testing

### Backend
```bash
cd backend
php artisan test
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 Linting y Formateo

### Backend
```bash
cd backend
./vendor/bin/pint  # Laravel Pint
```

### Frontend
```bash
cd frontend
npm run lint       # ESLint
npm run format     # Prettier
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Framework**: Laravel 11
- **PHP**: 8.2+
- **Base de datos**: SQLite
- **Autenticación**: API Key personalizada
- **Testing**: PHPUnit
- **Linting**: Laravel Pint

### Frontend
- **Framework**: React 18
- **Lenguaje**: TypeScript
- **UI**: Material-UI (MUI)
- **HTTP**: Axios
- **Forms**: React Hook Form
- **Validación**: Zod
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## 🏗️ Principios Implementados

- **RESTful API**: Endpoints siguiendo convenciones REST
- **Separation of Concerns**: Backend y frontend separados
- **Type Safety**: TypeScript en frontend
- **Validation**: Validación en backend y frontend
- **Error Handling**: Manejo consistente de errores
- **Security**: Autenticación mediante API Key
- **Testing**: Tests unitarios y de integración
- **Code Quality**: Linting y formateo automático

## 🔧 Troubleshooting

### Backend no inicia
- Verificar que PHP 8.2+ esté instalado
- Verificar que Composer esté instalado
- Ejecutar `composer install` en la carpeta backend

### Frontend no inicia
- Verificar que Node.js 18+ esté instalado
- Ejecutar `npm install` en la carpeta frontend

### Error de base de datos
- Verificar que el archivo `backend/database/database.sqlite` existe
- Ejecutar `php artisan migrate` en la carpeta backend

### Error de API Key
- Verificar que se esté enviando el header `X-API-Key: joonik-secret-api-key-2024`

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Desarrollado para prueba técnica Joonik** 🚀