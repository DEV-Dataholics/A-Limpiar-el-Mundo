# Ticket: [TKT-UW-006] FEAT: Restricción y validación de mes de septiembre

**Autor / Rama**: feature/2026-09-10-ajustes-finales-produccion  
**Módulos Afectados**: Frontend (DynamicRegistrationForm.tsx, useRegistrationForm.ts, ActivityManager.tsx), Backend (Registrations.php)  
**Tipo de Cambio**: Validación / UX / Regla de Negocio  

---

### 1. ALERTA DE IMPACTO EN BASE DE DATOS (CRÍTICO)
- [x] **¿Modifica esquemas existentes?**: NO
- [x] **¿Altera Llaves Primarias (PKs) o Auto-incrementables?**: NO
- [x] **¿Modifica Llaves Foráneas (FKs) o restricciones de integridad?**: NO
- [x] **¿Requiere nueva migración en backend?**: NO
- [x] **Detalle de cambios DDL**: N/A

### 2. IMPACTO EN BACKEND (API)
- **Endpoints Nuevos / Modificados**: `POST /api/registrations`
- **Políticas Shield / Roles RBAC**: Validación en controlador.
- **Compatibilidad con Contratos de API**: Se asegura fallback de campos `registration_date` y `scheduled_date`. Se valida que el mes sea estrictamente `09` (septiembre). En caso contrario, retorna error de validación 400 (`failValidationErrors`).

### 3. IMPACTO EN FRONTEND
- **Componentes y Vistas Afectadas**:
  - `DynamicRegistrationForm.tsx`:
    - Bloqueo en selector nativo mediante `min="2026-09-01"` y `max="2026-09-30"`.
    - Etiqueta de alerta reactiva en color rojo si el usuario introduce manualmente o selecciona cualquier fecha fuera del mes de septiembre.
    - Indicador visual de validación exitosa al seleccionar una fecha de septiembre.
  - `useRegistrationForm.ts`:
    - Guarda y valida en `canSubmit()` y en `handleSubmit()` que la fecha corresponda a septiembre (`parts[1] === '09'`).
    - En caso de fecha fuera de septiembre, interrumpe el submit y muestra mensaje de error.
  - `ActivityManager.tsx`:
    - Restricción de min y max a septiembre para fechas de actividades y eventos.
- **Manejo de Estado**: Reactividad directa sobre `scheduledDate`.

### 4. CHECKLIST PREVIO A COMMIT
- [x] Selector restringido con atributos `min` y `max` a septiembre 2026.
- [x] Etiqueta de alerta en rojo visible si el usuario selecciona fecha fuera de septiembre.
- [x] Bloqueo de envío de formulario si la fecha es inválida.
- [x] Validación en backend en `Registrations.php` garantizada.
- [x] Sin errores en `.\verificar.ps1`.
