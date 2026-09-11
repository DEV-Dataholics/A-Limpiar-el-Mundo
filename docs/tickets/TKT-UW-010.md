# Ticket: [TKT-UW-010] FEAT: Ranking Top 3 Corporativos

**Autor / Rama**: feature/2026-09-10-ajustes-finales-produccion  
**Módulos Afectados**: Frontend (MetricsDashboardView.tsx, LandingView.tsx), Backend (Metrics.php)  
**Tipo de Cambio**: Gamificación / Feature UI / Impacto Comunitario  

---

### 1. ALERTA DE IMPACTO EN BASE DE DATOS (CRÍTICO)
- [x] **¿Modifica esquemas existentes?**: NO
- [x] **¿Altera Llaves Primarias (PKs) o Auto-incrementables?**: NO
- [x] **¿Modifica Llaves Foráneas (FKs) o restricciones de integridad?**: NO
- [x] **¿Requiere nueva migración en backend?**: NO
- [x] **Detalle de cambios DDL**: N/A

### 2. IMPACTO EN BACKEND (API)
- **Endpoints Nuevos / Modificados**: `GET /api/public-metrics`
- **Políticas Shield / Roles RBAC**: Acceso público (requerido para micrositio).
- **Compatibilidad con Contratos de API**: `top_corporates` incluye `corporate_name`, `total_activities` y `total_volunteers`, asegurando agrupación compatible con `ONLY_FULL_GROUP_BY` (`groupBy(['a.corporate_id', 'c.name'])`).

### 3. IMPACTO EN FRONTEND
- **Componentes y Vistas Afectadas**:
  - `MetricsDashboardView.tsx`:
    - Incorporación de interfaz TypeScript para `top_corporates`.
    - Diseño gamificado del Podio "Top 3 Corporativos Más Participativos" con jerarquía visual (1er lugar con corona dorada `#FFBA00`, 2do lugar plata `#94A3B8`, 3er lugar bronce `#D97706`).
    - Métricas claras de cantidad de actividades registradas y personas movilizadas.
    - Soporte responsivo (escalonado en desktop 2º - 1º - 3º y apilado en móviles) con micro-animaciones.
    - Integración en reporte imprimible y pantalla de impacto de la landing page.
- **Manejo de Estado**: Reactividad directa en base a la respuesta del fetch de métricas públicas.

### 4. CHECKLIST PREVIO A COMMIT
- [x] Top 3 calculado con base en la cantidad de actividades registradas.
- [x] Diseño de podio moderno, gamificado y adaptado a la identidad de United Way Chihuahua.
- [x] Visible en el área de impacto del micrositio público.
- [x] Total compatibilidad con MySQL `ONLY_FULL_GROUP_BY`.
- [x] Sin errores en `.\verificar.ps1`.
