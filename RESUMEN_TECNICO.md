# Resumen Ejecutivo: Plataforma "Somos Comunidad"

**Somos Comunidad** es una aplicación web integral diseñada para la gestión, monitoreo y reporte del impacto social generado por voluntarios individuales, corporativos, instituciones educativas y organizaciones de la sociedad civil para **United Way - Fondo Unido Chihuahua**.

## 🚀 Arquitectura y Stack Tecnológico

La plataforma utiliza una arquitectura desacoplada (Decoupled Architecture) comunicada mediante una API REST.

- **Frontend**:
  - **Framework**: React.js (v18+) con Vite.
  - **Lenguaje**: TypeScript para robustez y tipado estático.
  - **Estilos**: Tailwind CSS (Framework de utilidad para diseño premium y responsivo).
  - **Estado y Navegación**: React Router DOM y Hooks personalizados.
- **Backend (API)**:
  - **Framework**: CodeIgniter 4 (PHP 8.1+).
  - **Seguridad**: Autenticación basada en JWT (JSON Web Tokens) y filtros de sesión para rutas administrativas.
  - **Gestión de Base de Datos**: MySQL con soporte para Soft Deletes y relaciones complejas.
- **Servidor Web Recomendado**: Laragon, XAMPP o cualquier entorno LAMP/LEMP con soporte para PHP 8.1+.

## 🛠️ Funcionalidades Principales

### 1. Landing Page e Impacto Público

- **Tablero en Tiempo Real**: Visualización dinámica de voluntarios totales, acciones realizadas y horas de impacto (solo datos aprobados).
- **Registro de Acciones**: Flujo optimizado para que usuarios reporten sus movilizaciones (propias o institucionales).

### 2. Panel de Administración

- **Gestión de Usuarios**: Control de acceso y perfiles para voluntarios y coordinadores.
- **Catálogo de Causas**: Administración de las "Causas Institucionales" oficiales de United Way.
- **Módulo de Aprobación**: Sistema de revisión para validar evidencias antes de que sumen al contador global.
- **Reportería Avanzada**: Exportación de datos en formato CSV segmentados por categorías (Corporativo, Escuela, Personal, Sociedad Civil).

### 3. Portal del Voluntario

- **Perfil Personalizado**: Historial de participaciones y métricas individuales.
- **Registro de Movilizaciones**: Formulario dinámico que adapta sus campos según el tipo de participante (ej. pide nombre de la escuela si es categoría "Escuela").

## 📂 Estructura del Proyecto

```text
/somoscomunidad
├── /api              # Backend CodeIgniter 4
│   ├── /app/Controllers   # Lógica de negocio (Admin y Público)
│   ├── /app/Models        # Modelos de datos (MySQL)
│   └── /public/uploads    # Almacenamiento de evidencias
└── /frontend         # Frontend React + Vite
    ├── /src/components    # Componentes reutilizables
    ├── /src/views         # Vistas principales (Landing, Dashboards)
    └── /src/hooks         # Lógica de estado y llamadas a API
```

## 🔐 Requisitos de Instalación

1. PHP 8.1 o superior con extensiones `intl` y `mbstring` habilitadas.
2. Servidor MySQL/MariaDB.
3. Node.js 18+ para el desarrollo del frontend.
4. Composer para dependencias de PHP.

## 🌐 Entorno de Producción (Dataholics Site5)

### Rutas
- **Frontend / Landing:** `https://somoscomunidad.dataholics.com.mx/`
- **Backend API:** `https://somoscomunidad.dataholics.com.mx/api/` (Configurado en `app.baseURL`)

### Credenciales de Base de Datos y FTP (Producción)
- **Host FTP:** `ftp.dataholics.com.mx`
- **Usuario FTP:** `SC_DEV@dataholics.com.mx`
- **Contraseña FTP:** `b}%gI?we_2vz` (o también puede ser `~Ll3Qyv;p!-6`)
- **Base de Datos MySQL:** `noodluis_somoscomunidad`
- **Usuario MySQL:** `noodluis_DEV_SC`
- **Contraseña MySQL:** `VX^uU~Tn7*w=` (Usada en la configuración `.env` de producción)
- **Usuario Admin Sistema:** `lmorales@dataholics.com.mx` (y `admin@somoscomunidad.org`)

### Notas sobre el Servidor Live
- El backend está servido mediante CodeIgniter 4 configurado bajo la carpeta `/api/`.
- El archivo `.env` de producción debe contener `app.baseURL = 'https://somoscomunidad.dataholics.com.mx/api/'` para que el ruteo funcione correctamente al procesar la variable global de URI.
- Se ha incluido `JWT_SECRET=tu_super_secreto_jwt_para_produccion_2026` para el token de sesión.
- Todos los archivos `.js`, `.tsx`, y `.html` deben guardarse estrictamente codificados en `UTF-8 sin BOM` para evitar mostrar caracteres extraños o *mojibake* en los navegadores web.
