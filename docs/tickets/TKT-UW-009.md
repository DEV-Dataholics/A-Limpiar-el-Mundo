# Ticket: [TKT-UW-009] UI: Visibilidad de información y enlaces de evidencia en Mis Eventos

**Autor / Rama**: feature/2026-09-10-ajustes-finales-produccion  
**Módulos Afectados**: Frontend (DashboardView.tsx), Backend (Registrations.php)  
**Tipo de Cambio**: Feature UI/UX / Visibilidad de Voluntariado y Evidencias  

---

### 1. ALERTA DE IMPACTO EN BASE DE DATOS (CRÍTICO)
- [x] **¿Modifica esquemas existentes?**: NO
- [x] **¿Altera Llaves Primarias (PKs) o Auto-incrementables?**: NO
- [x] **¿Modifica Llaves Foráneas (FKs) o restricciones de integridad?**: NO
- [x] **¿Requiere nueva migración en backend?**: NO
- [x] **Detalle de cambios DDL**: N/A

### 2. IMPACTO EN BACKEND (API)
- **Endpoints Nuevos / Modificados**: `GET /api/registrations/my-events`, `POST /api/registrations`
- **Políticas Shield / Roles RBAC**: Requiere token JWT del participante (`myEvents`).
- **Compatibilidad con Contratos de API**: `myEvents` retorna todos los atributos de `activities` (`a.*`) junto con `corporate_name`, `plant_name`, `division_name`. Al registrar, si no se envió archivo pero sí `evidence_links`, se persiste en `evidence_image_url` sin alterar esquemas.

### 3. IMPACTO EN FRONTEND
- **Componentes y Vistas Afectadas**:
  - `DashboardView.tsx`:
    - Métricas resumidas directamente en la tarjeta del evento (voluntarios, horas, modalidad).
    - Botón de acción interactivo "Ver Detalle Completo" en cada tarjeta.
    - Modal emergente moderno de detalle de evento con:
      - Folio, título, modalidad, estatus.
      - Métricas de impacto: Total de personas/voluntarios, horas por persona, horas acumuladas.
      - Corporativo, planta y división representados.
      - Ubicación y descripción.
      - Renderizado interactivo y seguro de las fotografías de evidencia (preview de imagen y enlace directo a galería externa / Drive / uploads).
- **Manejo de Estado**: Estado reactivo `selectedEvent` para apertura y cierre del modal.

### 4. CHECKLIST PREVIO A COMMIT
- [x] Coordinadores y voluntarios pueden abrir cualquier evento registrado.
- [x] Se muestran los totales de voluntarios, horas e impacto.
- [x] Se renderiza el enlace o preview a las fotografías de evidencia compartidas.
- [x] Modal responsivo y accesible con escape y backdrop clicable.
- [x] Sin errores en `.\verificar.ps1`.
