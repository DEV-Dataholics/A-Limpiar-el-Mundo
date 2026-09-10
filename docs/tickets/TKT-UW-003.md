# Ticket: [TKT-UW-003] UI/UX: Refactor de Tablas y Congelamiento de Headers

**Autor / Rama**: feature/2026-09-10-ajustes-finales-produccion  
**Módulos Afectados**: Frontend (MobilizationReports.tsx, AdminDashboardView.tsx)  
**Tipo de Cambio**: Feature UI / UX / Tablas de Administración  

---

### 1. ALERTA DE IMPACTO EN BASE DE DATOS (CRÍTICO)
- [x] **¿Modifica esquemas existentes?**: NO
- [x] **¿Altera Llaves Primarias (PKs) o Auto-incrementables?**: NO
- [x] **¿Modifica Llaves Foráneas (FKs) o restricciones de integridad?**: NO
- [x] **¿Requiere nueva migración en backend?**: NO
- [x] **Detalle de cambios DDL**: N/A

### 2. IMPACTO EN BACKEND (API)
- **Endpoints Nuevos / Modificados**: Ninguno (filtrado en memoria ultrarrápido y reactivo en cliente).
- **Políticas Shield / Roles RBAC**: Sin cambios.
- **Compatibilidad con Contratos de API**: 100% compatible.

### 3. IMPACTO EN FRONTEND
- **Componentes y Vistas Afectadas**:
  - `MobilizationReports.tsx`:
    - Implementación de `sticky header` (`sticky top-0 z-20 bg-slate-100/95 backdrop-blur-sm`) con contención de altura (`max-h-[620px] overflow-auto`).
    - Barra de herramientas superior de filtrado dinámico reactivo:
      - Búsqueda por actividad (filtra nombre personalizado y de catálogo).
      - Búsqueda por empresa / organización / usuario.
      - Selector de rango de fechas (Fecha Inicio y Fecha Fin).
      - Botón de reset de filtros y contador de resultados visibles.
      - Descarga de CSV sincronizada con los registros filtrados activos.
  - `AdminDashboardView.tsx`:
    - Sticky header en tabla del modal de detalle de causas/actividades.
- **Consumo de API centralizada**: Mantiene el consumo del endpoint `/api/admin/reports/mobilizations`.
- **Manejo de Estado / Caché**: `useMemo` para filtrado eficiente sin re-renders innecesarios.

### 4. CHECKLIST PREVIO A COMMIT
- [x] Código verificado en local con servidor activo.
- [x] Sticky headers validados al hacer scroll vertical.
- [x] Filtros por actividad, empresa y fechas funcionando simultáneamente.
- [x] Sin romper tipado TypeScript (`npx tsc --noEmit`).
- [x] Sin errores de linter (`oxlint`).
- [x] Criterios de aceptación cumplidos al 100%.
