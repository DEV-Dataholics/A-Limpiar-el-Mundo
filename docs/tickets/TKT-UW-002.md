# Ticket: [TKT-UW-002] BUG: Modalidad Corporativa bloqueada en registro de afinidad

**Autor / Rama**: feature/2026-09-10-ajustes-finales-produccion  
**Módulos Afectados**: Backend (Registrations.php), Frontend (DynamicRegistrationForm.tsx, useRegistrationForm.ts)  
**Tipo de Cambio**: Bugfix & Feature UI / Formulario de Registro  

---

### 1. ALERTA DE IMPACTO EN BASE DE DATOS (CRÍTICO)
- [x] **¿Modifica esquemas existentes?**: NO (la columna `modality VARCHAR(50)` ya existe en la tabla `activities`).
- [x] **¿Altera Llaves Primarias (PKs) o Auto-incrementables?**: NO
- [x] **¿Modifica Llaves Foráneas (FKs) o restricciones de integridad?**: NO
- [x] **¿Requiere nueva migración en backend?**: NO
- [x] **Detalle de cambios DDL**: N/A

### 2. IMPACTO EN BACKEND (API)
- **Endpoints Nuevos / Modificados**: `POST /api/registrations`
- **Políticas Shield / Roles RBAC**: Sin cambios.
- **Compatibilidad con Contratos de API**: Se procesa el parámetro `modality` y `activity_type` permitiendo dinámicamente: `Corporativa`, `Institucional`, `Escuela` y `Comunidad`. Se elimina el bloqueo forzado que sobreescribía la modalidad a CORPORATIVA cuando `accompanied_by_fuch` era falso.

### 3. IMPACTO EN FRONTEND
- **Componentes y Vistas Afectadas**:
  - `DynamicRegistrationForm.tsx`: Se desbloquea el `<select>` de modalidad (`disabled` eliminado), se enlaza a `activityType` y `setActivityType`, y se agregan las opciones: `Corporativa`, `Institucional`, `Escuela` y `Comunidad`.
  - `useRegistrationForm.ts`: Se expone el estado y se envía tanto `activity_type` como `modality` en el `FormData` al backend.
- **Consumo de API centralizada**: Centralizado a través de `useRegistrationForm` hacia `/api/registrations`.
- **Manejo de Estado / Caché**: Estado reactivo en el hook del formulario.

### 4. CHECKLIST PREVIO A COMMIT
- [x] Código verificado en local con servidor activo.
- [x] Selector probado con las 4 opciones requeridas.
- [x] Sin romper tipado TypeScript (`npx tsc --noEmit`).
- [x] Sin errores de linter (`oxlint`).
- [x] Criterios de aceptación cumplidos al 100%.
