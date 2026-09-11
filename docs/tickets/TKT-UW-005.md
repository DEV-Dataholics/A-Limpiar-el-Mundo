# Ticket: [TKT-UW-005] UX: Autocompletado predictivo en campo de Empresas

**Autor / Rama**: feature/2026-09-10-ajustes-finales-produccion  
**Módulos Afectados**: Backend (CorporateController.php), Frontend (PredictiveCompanySelector.tsx, DynamicRegistrationForm.tsx)  
**Tipo de Cambio**: Feature UI / UX / Autocompletado Predictivo  

---

### 1. ALERTA DE IMPACTO EN BASE DE DATOS (CRÍTICO)
- [x] **¿Modifica esquemas existentes?**: NO
- [x] **¿Altera Llaves Primarias (PKs) o Auto-incrementables?**: NO
- [x] **¿Modifica Llaves Foráneas (FKs) o restricciones de integridad?**: NO
- [x] **¿Requiere nueva migración en backend?**: NO
- [x] **Detalle de cambios DDL**: N/A

### 2. IMPACTO EN BACKEND (API)
- **Endpoints Nuevos / Modificados**: `GET /api/corporates/search`
- **Políticas Shield / Roles RBAC**: Acceso público (requerido para el formulario de registro de voluntarios).
- **Compatibilidad con Contratos de API**: Se asegura que el payload de respuesta incluya tanto `display_name` como `name`, `id`, `corporate_id`, `plant_id`, `division_id` y `type`. Si el query está vacío, devuelve un set de sugerencias rápidas iniciales de corporativos/plantas principales para visualización inmediata.

### 3. IMPACTO EN FRONTEND
- **Componentes y Vistas Afectadas**:
  - `PredictiveCompanySelector.tsx`:
    - Corrección de sincronización para que al hacer clic en una sugerencia se cargue el texto correspondiente (`item.display_name || item.name`).
    - Despliegue de menú rápido al hacer focus o teclear.
    - Manejo de debounce (300ms) para llamadas eficientes y limpias a la base de datos.
    - Soporte para badges visuales (`Corporativo`, `Planta`, `División`, `Organización`).
  - `DynamicRegistrationForm.tsx`:
    - Etiquetas dinámicas según modalidad (`Corporativa`, `Escuela`, `Institucional`, `Comunidad`).
- **Consumo de API centralizada**: Consulta vía `${API_URL}/api/corporates/search?q=...`.
- **Manejo de Estado / Caché**: Estado local desacoplado y reactivo con `useRef` para click-outside.

### 4. CHECKLIST PREVIO A COMMIT
- [x] Código verificado en local con servidor activo.
- [x] Endpoint `GET /api/corporates/search` responde sugerencias predictivas y menú inicial.
- [x] Al seleccionar una opción se completa el campo y se asignan las entidades jerárquicas.
- [x] Sin romper tipado TypeScript (`npx tsc --noEmit`).
- [x] Sin errores de linter (`oxlint`).
- [x] Criterios de aceptación cumplidos al 100%.
