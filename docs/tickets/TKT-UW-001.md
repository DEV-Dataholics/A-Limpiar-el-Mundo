# Ticket: [TKT-UW-001] COPY/BRANDING: Des-localización de campaña y ajuste de marca

**Autor / Rama**: feature/2026-09-10-ajustes-finales-produccion  
**Módulos Afectados**: Frontend (LandingView, Footer, DynamicRegistrationForm, index.html, llms.txt)  
**Tipo de Cambio**: Feature UI / Copy & Branding  

---

### 1. ALERTA DE IMPACTO EN BASE DE DATOS (CRÍTICO)
- [x] **¿Modifica esquemas existentes?**: NO
- [x] **¿Altera Llaves Primarias (PKs) o Auto-incrementables?**: NO
- [x] **¿Modifica Llaves Foráneas (FKs) o restricciones de integridad?**: NO
- [x] **¿Requiere nueva migración en backend?**: NO
- [x] **Detalle de cambios DDL**: N/A

### 2. IMPACTO EN BACKEND (API)
- **Endpoints Nuevos / Modificados**: Ninguno
- **Políticas Shield / Roles RBAC**: Sin cambios
- **Compatibilidad con Contratos de API**: 100% compatible

### 3. IMPACTO EN FRONTEND
- **Componentes y Vistas Afectadas**:
  - `LandingView.tsx`: Retiro de "en todo Chihuahua" en banner, ajuste en sección áreas verdes a "enriquecer el ecosistema", badge deslocalizado, ajuste de footer ("espacios públicos" y "United Way Chihuahua").
  - `DynamicRegistrationForm.tsx`: Reemplazo de "FUCH (Fondo Unido Chihuahua)" por "United Way Chihuahua".
  - `index.html`: Des-localización de metadatos SEO, OpenGraph, Twitter Cards y Schema.org JSON-LD reemplazando "Fondo Unido Chihuahua" por "United Way Chihuahua" y "Espacios Públicos de Chihuahua" por "Espacios Públicos".
  - `public/llms.txt` & `public/llms-full.txt`: Homologación de marca institucional para motores de IA.
- **Consumo de API centralizada**: Intacto.
- **Manejo de Estado / Caché**: Sin impacto.

### 4. CHECKLIST PREVIO A COMMIT
- [x] Código verificado en local con servidor activo.
- [x] Cero llamadas residuales o URLs duras a servidores externos o IPs locales.
- [x] Sin romper tipado TypeScript (`npx tsc --noEmit`).
- [x] Sin errores de linter (`oxlint`).
- [x] Criterios de aceptación cumplidos al 100%.
