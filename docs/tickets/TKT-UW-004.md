# Ticket: [TKT-UW-004] FEAT: Tabla de Gestión de Usuarios y Reporte de Voluntarios

**Autor / Rama**: feature/2026-09-10-ajustes-finales-produccion  
**Módulos Afectados**: Backend (Admin/Users.php, Admin/Metrics.php), Frontend (UserManager.tsx, AdminDashboardView.tsx)  
**Tipo de Cambio**: Feature Fullstack / Gestión de Usuarios y Reportes de Impacto  

---

### 1. ALERTA DE IMPACTO EN BASE DE DATOS (CRÍTICO)
- [x] **¿Modifica esquemas existentes?**: NO (aprovecha las columnas existentes `users.plant_id`, `users.division_id`, `users.phone` y relaciones con `corporate_plants`, `corporate_divisions` y `activities`).
- [x] **¿Altera Llaves Primarias (PKs) o Auto-incrementables?**: NO
- [x] **¿Modifica Llaves Foráneas (FKs) o restricciones de integridad?**: NO
- [x] **¿Requiere nueva migración en backend?**: NO
- [x] **Detalle de cambios DDL**: N/A

### 2. IMPACTO EN BACKEND (API)
- **Endpoints Nuevos / Modificados**:
  - `GET /api/admin/users`: Se enriquece la consulta con `LEFT JOIN` a `corporate_plants`, `corporate_divisions`, `corporates` y `activities`, retornando `plant_phone`, `plant_name`, `division_name`, `corporate_name` y `total_activities` con compatibilidad SQL ANSI y `ONLY_FULL_GROUP_BY`.
  - `GET /api/admin/metrics`: Mantiene soporte para parámetro query `?month=XX` para cálculo del acumulado mensual y retorna `locations` con estructura `{plant_name, division_name, total_activities}`.
- **Políticas Shield / Roles RBAC**: Protegido por filtro `adminauth`.
- **Compatibilidad con Contratos de API**: 100% retrocompatible.

### 3. IMPACTO EN FRONTEND
- **Componentes y Vistas Afectadas**:
  - `UserManager.tsx`:
    - Incorporación de columnas: "Teléfono de la Planta" y "Total de Actividades Realizadas".
    - Controles de filtrado dinámico: búsqueda general (nombre/correo/empresa), búsqueda por teléfono de planta y filtro por volumen de actividades (todas, con actividades, sin actividades).
    - Botón de exportación "Exportar Reporte de Voluntarios (CSV)" con codificación UTF-8 BOM.
  - `AdminDashboardView.tsx`:
    - Sección "Resumen de Impacto": selector de periodo mensual para consultar métricas acumuladas por mes o anual.
    - Sección "Localidades de Incidencia": renderizado de desglose organizado jerárquicamente por Planta y División.
- **Consumo de API centralizada**: Centralizado a `/api/admin/users` y `/api/admin/metrics`.
- **Manejo de Estado / Caché**: Reactividad instantánea con filtros en memoria y refetch en cambio de mes.

### 4. CHECKLIST PREVIO A COMMIT
- [x] Código verificado en local con servidor activo.
- [x] Consulta de backend ejecutada y validada en MySQL.
- [x] Columnas y filtros de teléfono y actividades visibles en la tabla.
- [x] Exportación a CSV funcional.
- [x] Filtro de periodo mensual en Resumen de Impacto y desglose planta/división en Localidades de Incidencia.
- [x] Sin romper tipado TypeScript (`npx tsc --noEmit`).
- [x] Sin errores de linter (`oxlint`).
- [x] Criterios de aceptación cumplidos al 100%.
