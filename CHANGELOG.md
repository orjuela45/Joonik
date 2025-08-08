# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Configuración inicial del proyecto sin Docker
- Estructura de directorios para desarrollo nativo
- Scripts de automatización para Windows (.bat)
- Script setup.bat para verificar dependencias e instalar
- Script start-backend.bat para levantar Laravel
- Script start-frontend.bat para levantar React
- Script start-all.bat para levantar ambos servicios
- README.md con documentación completa para desarrollo nativo
- CHANGELOG.md siguiendo convenciones estándar

#### Backend (Laravel 11) - Implementado
- Modelo Location con campos: id, code, name, image, created_at, updated_at
- Migración para tabla locations con índice único en campo code
- LocationController con CRUD completo (index, store, show, update, destroy)
- LocationRequest para validaciones centralizadas
- ApiKeyMiddleware para autenticación por API key desde variables de entorno
- Rutas API protegidas con middleware de autenticación
- Seeder con 10 ubicaciones de ejemplo
- Configuración de API key en variables de entorno (.env)
- Eliminación de migraciones innecesarias (users, cache, jobs, personal_access_tokens)

### Changed
- Enfoque de desarrollo de Docker a nativo
- Scripts optimizados para Windows PowerShell/CMD
- Validaciones movidas de controller a FormRequest para mejor organización
- Middleware de API key optimizado para usar variables de entorno directamente

## [1.0.0] - 2024-01-15

### Added

#### Backend (Laravel 11)
- API RESTful para gestión de ubicaciones
- Autenticación mediante API Key personalizada
- Middleware de validación de API Key
- Endpoints CRUD para ubicaciones
- Health check endpoint
- Base de datos SQLite para desarrollo
- Migraciones y seeders
- Tests unitarios y de integración
- Laravel Pint para code styling
- Larastan para análisis estático

#### Frontend (React + TypeScript)
- Aplicación React 18 con TypeScript
- Material-UI para componentes de interfaz
- Axios para comunicación con API
- React Hook Form para manejo de formularios
- Zod para validación de esquemas
- ESLint y Prettier configurados
- Tests con Jest y React Testing Library
- Componentes reutilizables
- Manejo de estado con hooks

#### Infraestructura
- Scripts de automatización para Windows
- Configuración de desarrollo nativo
- Documentación completa en README.md
- Estructura de proyecto organizada

#### Seguridad
- Autenticación mediante API Key
- Validación de entrada en backend y frontend
- Sanitización de datos
- Headers de seguridad configurados

#### Performance
- Optimización de consultas de base de datos
- Lazy loading en componentes React
- Compresión de assets en producción
- Cache de respuestas API

#### Developer Experience
- Hot reload en desarrollo
- Linting automático
- Scripts de automatización
- Documentación detallada
- Estructura de proyecto clara

---

## Tipos de Cambios

- `Added` para nuevas funcionalidades
- `Changed` para cambios en funcionalidades existentes
- `Deprecated` para funcionalidades que serán removidas
- `Removed` para funcionalidades removidas
- `Fixed` para corrección de bugs
- `Security` para vulnerabilidades de seguridad

## Convenciones de Commit

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` formateo, punto y coma faltante, etc.
- `refactor:` refactoring de código
- `test:` agregar tests faltantes
- `chore:` actualizar tareas de build, configuraciones, etc.

### Ejemplos:
```
feat(api): add location CRUD endpoints
fix(auth): resolve API key validation issue
docs(readme): update installation instructions
style(frontend): format components with prettier
refactor(backend): optimize database queries
test(api): add integration tests for locations
chore(deps): update Laravel to version 11.0
```