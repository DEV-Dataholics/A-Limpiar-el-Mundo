# Historial Constante de Ajustes - PRISMA MVP

*Este documento funge como la **fuente de verdad viva** del proyecto. Todos los agentes del equipo (Orchestrator, Developer, etc.) tienen por regla OBLIGATORIA registrar aquí cualquier modificación funcional, de UI, arquitectónica o de permisos que se ejecute a lo largo de las sesiones.*

---

### 30. Incidentes de Produccion (26-27 Mayo 2026): Registro y Sesion

**Fecha:** 2026-05-26 y 2026-05-27  
**Alcance:** `api/app/Controllers/Registrations.php`, `frontend/src/hooks/useRegistrationForm.ts`, despliegue selectivo por FTP.

**Sintomas reportados:**

- Error en formulario: "Error al procesar la solicitud" al enviar movilizaciones personales.
- Consola de navegador con `500` en `POST /api/registrations`.
- Tras re-login, `500` en `GET /api/registrations/my-events`.

**Causas raiz confirmadas:**

- Dependencia de `activity_id` fijo (`9`) desde frontend para flujos no institucionales.
- Diferencias de esquema en produccion (tablas legacy) que no siempre incluyen las mismas columnas opcionales.
- Excepcion en runtime: `Class "Firebase\\JWT\\JWT" not found` en `Registrations.php` (confirmado en `api/writable/logs/log-2026-05-27.log`).

**Correcciones aplicadas:**

- **Frontend:** se elimino el `activity_id` hardcodeado para no institucional y se delego la resolucion al backend.
- **Backend `create()`:**
  - Resolucion segura de actividad valida para movilizacion abierta.
  - Filtro de payload por columnas existentes de `impact_registrations`.
  - Insercion con Query Builder y timestamps condicionales (`created_at`, `updated_at`) solo si existen.
- **Backend `myEvents()`:**
  - Reescritura de consulta para tolerar esquemas legacy (sin asumir `deleted_at` ni columnas opcionales de catalogo).
- **JWT fallback loader:**
  - Se agrego `ensureJwtClassesLoaded()` en `Registrations.php` y se invoca antes de `JWT::decode()`.

**Validaciones y estado:**

- `GET /api/activities` -> `200`.
- `OPTIONS /api/registrations` -> `200`.
- `GET /api/registrations/my-events` con token invalido -> `401` (esperado, sin 500).
- Build frontend de produccion exitoso y despliegues realizados solo sobre archivos afectados.

**Resultado:**

- Se elimina el error 500 por carga de clase JWT.
- Se reduce el riesgo de 500 por diferencias de esquema en consultas e inserciones de registros.

---

### 1. Nuevo Ecosistema "Somos Comunidad" (Planificación e Inicialización)

- **Directiva Maestra Procesada:** Se analizó el documento `Directiva Maestra Somos Comunidad.md` para el nuevo Micrositio de Participación Cívica y Motor de Reservas.
- **Fijación de Stack Restrictivo:** Se documentó formalmente el uso exclusivo de **PHP 8+ (CodeIgniter 4)** para backend, **MySQL** local, **React 18+ (Vite)** y **Tailwind CSS v4** puro. Queda vetado el uso de Python, Supabase, Prisma y Next.js para este ecosistema.
- **Configuración CodeIgniter (Backend):** Se crearon migraciones, modelos y controladores RESTful base para `users`, `activities_catalog`, e `impact_registrations`.

### 2. Ejecución de Fases 2 y 3 (UI y Lógica Reactiva)

- **Componentes Core Creados:** Se construyó la estructura base (`App.tsx`, `index.css`) bajo la directiva de diseño *Dark Mode Premium* y *Glassmorphism* usando Tailwind CSS v4.
- **Lógica de Formulario Dinámico (`useRegistrationForm.ts` & `DynamicRegistrationForm.tsx`):** Se implementó la mutación estricta de la UI entre Flujo A (Institucional) y Flujo B (Ciudadana). Incluye la validación de bloqueo de 10 días para el calendario en Flujo A, y el requerimiento de imagen y texto para Flujo B.
- **Muro de Impacto (`ImpactFeedGrid.tsx`):** Se construyó la grilla pública utilizando *Lazy Loading* nativo (`loading="lazy"`) para las imágenes, evitando recargar la memoria del navegador.
- **Dashboard Estadístico (`MetricsDashboardView.tsx`):** Panel minimalista de tres contadores con estilos de acentos en esmeralda y ámbar listo para consumir los datos de la API.

### 3. Ejecución de Fase 5 (Ajuste Fino y Autenticación)

- **Separación de Micrositio y Área Privada:** Se reestructuró la aplicación instalando `react-router-dom`. Se definieron rutas públicas (`/`, `/login`, `/register`) y rutas privadas (`/dashboard`).
- **Autenticación Tradicional:** Se implementó `AuthContext` en el frontend y se crearon las vistas `LoginView` y `RegisterView`. En el backend, se modificó la tabla `users` para soportar `last_name`, `age` y `password`, creando el controlador `Auth.php`. Se protegió el endpoint de creación de `registrations`.
- **Explorador de Causas:** Se eliminó el `select` aburrido en el Flujo Institucional de `DynamicRegistrationForm.tsx` y se reemplazó por un Grid de Tarjetas interactivo que consume `image_url` y `long_description` (campos añadidos a `activities_catalog` mediante migración).

### 4. Ajustes de API y Cambio de Identidad Visual (United Way)

- **Fix de Mis Eventos (`Registrations.php`):** Se corrigió un error 500 en el backend donde se consultaba `activities_catalog.title` en lugar de `activities_catalog.name`. También se hizo más robusta la lectura del response en `DashboardView.tsx`.
- **Identidad Pública United Way:** Se reescribió `LandingView.tsx`, `ImpactFeedGrid.tsx` y `MetricsDashboardView.tsx` para abandonar el "Dark Mode Premium Esmeralda" e implementar un diseño claro y corporativo. Se integró el logo habilitando `server.fs.allow` en Vite, y se estandarizó la paleta a Azul Navy (`#005191`), Naranja (`#f57921`) y Amarillo (`#ffb351`).
- **Modo Night Corporativo (Área Privada):** Se actualizaron las vistas internas (`DashboardView`, `DynamicRegistrationForm`, `ProfileForm`, `LoginView`, `RegisterView` y `index.css`) para crear un "dark mode" consistente con la marca United Way, eliminando remanentes del tema esmeralda y utilizando la paleta institucional sobre fondos azul oscuro (`#001224`, `#001f3f`).
- **Carga de Perfil Automática:** Se validó que `DynamicRegistrationForm` ya utiliza el `useAuth` para pre-llenar automáticamente los campos "¿A quién representas?" (con `organization_name`) y "Municipio y Estado" a partir del perfil del usuario (creado en `ProfileForm.tsx`).

### 5. Planificación del Área de Administración

- **Nuevo Reto (Gestión Administrativa):** Se creó un plan de desarrollo detallado (`tasks/todo.md`) para el nuevo rol de Administrador. Este plan incluye la integración de Soft Deletes para mantener la gobernanza de datos, la adición de un middleware `AdminAuthFilter` en el backend, la creación de vistas de gestión de Causas, Usuarios y Movilizaciones en el frontend, y la implementación de modales de confirmación para acciones destructivas.

### 6. Filtros de Impacto y Entrega Técnica (Mayo 2026)

- **Filtro de Aprobación en Métricas:** Se modificaron `Admin\Metrics.php` y `Registrations.php` para que los contadores del Landing Page solo sumen registros con estatus `'approved'`. Esto garantiza que solo el impacto verificado sea público.
- **Resumen Ejecutivo:** Se creó el archivo `RESUMEN_TECNICO.md` en la raíz del proyecto, detallando la arquitectura, stack (React + CI4) y funcionalidades para facilitar la transferencia al equipo técnico de United Way.
- **Limpieza de Landing:** Se removió el "Muro de Impacto Ciudadano" a petición del usuario para mantener un diseño más limpio enfocado en los indicadores clave.

### 10. Implementación del Sistema de Diseño Institucional (Guía de Uso de Marca)

**Fecha:** 2026-04-30  
**Alcance:** Área privada completa (usuario y administrador): Login, Registro, DashboardView, AdminDashboardView y todos sus subcomponentes.

**Cambios aplicados:**

- **`index.html`:** Se agregaron las fuentes institucionales `Antonio` (titulares) e `Inter` (cuerpo) desde Google Fonts. Se añadió meta description y título correcto en español.
- **`index.css`:** Se reescribió el sistema de diseño completo. Se estableció la paleta oficial:
  - `#0044B5` → Azul Institucional (topbar, botones secundarios, títulos)
  - `#002D7A` → Azul Oscuro (sidebar admin, sombras)
  - `#FFBA00` → Dorado Institucional (reemplaza naranja `#f57921` en toda el área privada)
  - `#FFFFFF` → Blanco (fondo principal área privada, reemplaza `#001224`)
  - `#F4F6FA` → Gris claro (superficies secundarias)
  - Se declararon clases utilitarias: `.font-antonio`, `.heading-brand`, `.topbar-brand`, `.sidebar-brand`, `.btn-brand-gold`, `.btn-brand-blue`, `.btn-outline-blue`, `.card-brand`, `.input-brand`, `.badge-gold`, `.badge-blue`, `.divider-gold`, `.progress-brand-track`, `.progress-brand-fill`.
- **Tipografía:** Todos los titulares grandes o importantes usan `font-antonio` (Antonio Bold, todas mayúsculas), siguiendo la guía de marca.
- **Topbar:** En todas las vistas privadas la barra superior es `bg-[#0044B5]` con logo a color e isotipo de United Way, texto blanco y acento dorado `#FFBA00`.
- **Sidebar Admin:** Fondo `#002D7A`, ítem activo con borde izquierdo `#FFBA00` y fondo `#0044B5`.
- **Combinaciones de color aplicadas (según guía):**
  - Dorado + Azul: botones de acción principales (`.btn-brand-gold`).
  - Azul Oscuro + Blanco: sidebar y topbar.
  - Blanco + Azul: tarjetas y formularios.
  - Blanco sobre Azul: encabezados de formularios y modales.
- **Vistas actualizadas:** `LoginView.tsx`, `RegisterView.tsx`, `DashboardView.tsx`, `AdminDashboardView.tsx`.
- **Componentes actualizados:** `ActivityManager.tsx`, `RegistrationManager.tsx`, `UserManager.tsx`, `ProfileForm.tsx`, `DynamicRegistrationForm.tsx`.
- **Logos:** Copiar `Somocomunidadlogo.png` → `frontend/public/somoscomunidad-logo.png` e `image.png` (United Way) → `frontend/public/image.png` para que las topbars los muestren a color.
- **Fix de bug:** Se corrigió un error de sintaxis en `DynamicRegistrationForm.tsx` introducido durante la migración de clases CSS (`text-center"1]`).

### 11. Rediseño del Micrositio Público (Identidad United Way)

**Fecha:** 2026-04-30  
**Alcance:** Interfaz pública completa: LandingView, MetricsDashboardView e ImpactFeedGrid.

**Cambios aplicados:**

- **`LandingView.tsx`:** Rediseño total con estética premium. Se reemplazó el esquema Navy/Orange por Azul Institucional (#0044B5) y Dorado (#FFBA00). Se aplicó tipografía Antonio Bold en todos los titulares en mayúsculas. Se mejoró el Hero Section con un degradado de marca y animaciones suaves. El footer ahora es institucional sobre fondo azul oscuro.
- **`MetricsDashboardView.tsx`:** Se estandarizaron los indicadores con la fuente Antonio Bold y acentos dorados. Se rediseñó el sistema de reporte para impresión (PDF) para que sea un documento formal con la marca United Way, incluyendo firmas y logotipos.
- **`ImpactFeedGrid.tsx`:** Actualización de la galería de impacto. Las tarjetas ahora tienen bordes muy redondeados (3.5rem/2rem), overlays en azul institucional y efectos de zoom al pasar el cursor. Se integró un badge de verificación discreto.
- **Unificación de Navegación:** La barra de navegación pública ahora utiliza la clase `.topbar-brand` para consistencia con el área privada, manteniendo el logo de "Somos Comunidad" a color sobre fondo azul.

**Razón:** Consistencia total de marca en todo el ecosistema. El micrositio público debe reflejar el mismo nivel de profesionalismo y alineación con la guía de marca que el área administrativa.

### 12. Campo Dinámico de Agrupación según Modalidad

**Fecha:** 2026-04-30
**Alcance:** `DynamicRegistrationForm.tsx` — Flujo B (Movilización Ciudadana)

**Cambios aplicados:**

- Creada constante `CORPORATIVOS_CATALOG` con 90+ corporativos consolidados de `LearHQ.csv` + `Empresas.csv`, ordenada alfabéticamente.
- Campo "Escuela, OSC, Empresa o colectivo" ahora es dinámico según la modalidad seleccionada:
  - **Corporativa:** `<select>` poblado con lista consolidada de corporativos.
  - **Institucional:** `<select>` filtrado de las causas activas en BD (`activities_catalog.type = 'institutional'`).
  - **Personal:** `<input type="text">` de formato libre.
  - **Comunidad Abierta:** Campo completamente oculto.
- Añadida limpieza automática de `groupName` al cambiar de modalidad para evitar datos cruzados.

**Razón:** Mejorar la calidad de los datos de captura (Data Governance) y evitar errores tipográficos en el registro de movilizaciones.

---

### 13. Módulo Reporteador de Movilizaciones y Exportación

**Fecha:** 2026-04-30
**Alcance:** Backend (`Registrations.php`, `Routes.php`) + Frontend (`MobilizationReports.tsx`, `AdminDashboardView.tsx`)

**Cambios aplicados:**

- **Backend:** Nuevo método `mobilizationReports()` en `Admin\Registrations.php`. Endpoint `GET /api/admin/reports/mobilizations?type=` que filtra movilizaciones ciudadanas por tipo y excluye soft deletes.
- **Backend:** Ruta registrada en `Routes.php` dentro del grupo admin protegido.
- **Frontend:** Nuevo componente `MobilizationReports.tsx` con 3 pestañas (Corporativo, Personal, Comunidad Abierta), tabla de datos paginada, badges de estado y botón "Descargar CSV" funcional.
- **Frontend:** Componente integrado en `AdminDashboardView.tsx` entre el grid de métricas y el estatus de causas institucionales.
- **Frontend:** Botón "Exportar CSV" añadido al modal de voluntarios de causas institucionales (visible solo cuando hay registros).

**Razón:** Dar al administrador visibilidad sobre el voluntariado ciudadano separado por tipo, y capacidad de exportar datos para informes.

---

### 14. Corrección de Métricas con Soft Delete

**Fecha:** 2026-04-30
**Alcance:** `api/app/Controllers/Admin/Metrics.php`

**Cambios aplicados:**

- Añadido `->where('deleted_at', null)` en la suma de `beneficiaries_count` (beneficiarios comunitarios).
- Añadido `->where('deleted_at', null)` en la suma de `duration_hours` (horas generadas).
- Añadido `->where('impact_registrations.deleted_at', null)` en la consulta QueryBuilder de localidades geográficas.
- El conteo de inscritos por causa institucional ya usaba `countAllResults()` del modelo, que respeta el soft delete automáticamente.

**Razón:** Las consultas directas (`selectSum()->get()`) saltaban el filtro automático de Soft Delete de CodeIgniter 4, causando que registros eliminados siguieran sumando en las métricas del resumen de impacto.

---

### 15. Simplificación de Flujos y Afiliación Corporativa en Perfil

**Fecha:** 2026-04-30
**Alcance:** `src/utils/constants.ts` (nuevo) + `DynamicRegistrationForm.tsx` + `ProfileForm.tsx`

**Cambios aplicados:**

- **Nuevo Archivo:** Creado `src/utils/constants.ts` como fuente única de verdad para `CORPORATIVOS_CATALOG` (90+ corporativos de Lear y socios). Elimina la copia duplicada que vivía en el formulario.
- **Formulario de Registro (`DynamicRegistrationForm.tsx`):**
  - Eliminada la opción "Institucional" del `<select>` de modalidades. Las causas institucionales se gestionan exclusivamente desde la pestaña de Causas Oficiales (Flujo A).
  - Eliminado el bloque condicional que cargaba causas activas desde la BD en este formulario.
  - La constante ahora se importa de `constants.ts` en lugar de estar definida localmente.
- **Perfil de Usuario (`ProfileForm.tsx`):**
  - Reemplazado el campo de texto libre `organization_name` por un `<select>` inteligente alimentado por `CORPORATIVOS_CATALOG`.
  - Añadido estado `isOtherOrg` con detección automática: si el valor guardado en BD no existe en el catálogo, se inicializa en modo "otro".
  - Añadido checkbox *"Mi organización / escuela no está en la lista"* que al activarse cambia a campo de texto libre y limpia el valor previo.

**Razón:** Eliminar redundancia de flujos (Institucional no debía estar en Movilización Propia) y centralizar la afiliación corporativa en el perfil del usuario para mejorar la calidad de los datos y la trazabilidad de métricas por empresa.

---

### 16. Transición B2B: Simplificación de Formularios y Corrección Matemática de Métricas

**Fecha:** 2026-04-30
**Alcance:** `DynamicRegistrationForm.tsx`, `useRegistrationForm.ts`, `api/app/Controllers/Admin/Metrics.php`

**Cambios aplicados:**

- **Frontend (Unificación B2B):**
  - Eliminación completa de la "Cartelera de Causas" (Flujo A) con las tarjetas visuales.
  - El formulario de registro se volvió 100% transaccional. La opción "Institucional" regresó al `<select>` de modalidades.
  - Al seleccionar "Institucional", el `<input>` de nombre cambia dinámicamente a un `<select>` que carga las causas de la base de datos oficial.
  - El gancho `useRegistrationForm.ts` ahora gestiona inteligentemente si debe enviar `activity_id` (cuando es Institucional) o `custom_activity_name` (en el resto).
- **Backend (Las matemáticas del impacto):**
  - Se modificó `$registrationModel->selectSum('duration_hours')` por una consulta SQL de verdad: `select('SUM(duration_hours * volunteer_count) as total_hours')`. Las horas reportadas por empresas ahora se multiplican por sus voluntarios.
  - Se ajustó el campo general de Voluntarios en `Metrics.php`. En lugar de contar sólo cuentas de usuario de la plataforma (`$userModel->countAllResults()`), ahora **suma todos los voluntarios reportados** por las cuentas (`$registrationModel->selectSum('volunteer_count')`).

### 17. Refinamiento de Métricas y Metas Institucionales

**Fecha:** 2026-04-30
**Alcance:** `Admin Dashboard`, `api/app/Controllers/Admin/Metrics.php`

**Cambios aplicados:**

- **Métrica "Causas Registradas":** Se modificó el cálculo para excluir explícitamente las actividades tipo 'Institucional', asegurando que este KPI solo cuente las movilizaciones ciudadanas/empresariales únicas.
- **Progreso Real (SUM vs COUNT):** Se cambió la lógica de cumplimiento de metas. Ahora el progreso de una causa institucional se calcula sumando el campo `volunteer_count` de todos los registros asociados, en lugar de solo contar el número de filas (registros).
- **Meta Visual:** Se ajustaron las tarjetas de progreso para usar `max_capacity` como la meta del 100% en la barra, manteniendo `min_capacity` como un indicador visual de umbral mínimo.

**Razón:** Alinear el dashboard con el modelo B2B donde un solo registro corporativo puede aportar cientos de voluntarios hacia una meta institucional.

---

### 18. Visualización Granular B2B en Dashboard

**Fecha:** 2026-04-30
**Alcance:** `AdminDashboardView.tsx`

**Cambios aplicados:**

- **Modal de Detalle Institucional:** Se reemplazó la lista simple de nombres por una tabla detallada que muestra el impacto por empresa/organización: Modalidad, Voluntarios, Horas, Beneficiarios y links de evidencia.
- **Detección de Modalidad:** La tabla distingue automáticamente entre registros corporativos, personales o de comunidad abierta dentro de la misma causa oficial.

**Razón:** Proveer al administrador las herramientas de auditoría necesarias para validar el impacto reportado por las empresas socias.

---

### 19. Módulo de Reporte de Movilizaciones: Ficha Detallada y Lógica de Columnas

**Fecha:** 2026-05-01
**Alcance:** `MobilizationReports.tsx`, `api/app/Controllers/Admin/Registrations.php`

**Cambios aplicados:**

- **Backend:** Se actualizó el endpoint `mobilizationReports` para incluir campos adicionales (`evidence_links`, `phone`, `testimonials`) necesarios para la vista de detalle.
- **Frontend (Ficha):** Se implementó un sistema de **Ficha de Movilización** (Modal). Se corrigió un error de posicionamiento donde el modal aparecía desplazado hacia abajo en pantallas con mucho scroll, asegurando que ahora se centre siempre en el viewport con un z-index prioritario.
- **Frontend (Lógica de Columnas):** Se corrigió la visualización de nombres. En la pestaña **Personal**, ahora la primera columna muestra el nombre del voluntario y la tercera la organización que representa. En la pestaña **Corporativa**, la primera muestra la Empresa y la tercera el Responsable.
- **Frontend (Fix):** Se resolvió un warning de React de "keys duplicadas" en los encabezados de la tabla mediante el uso de identificadores compuestos.

**Razón:** Mejorar la precisión de la información mostrada según el contexto (B2B vs Individual) y optimizar el rendimiento del renderizado en React.

---

### 23. Optimización de Espaciado y "Aire" Visual

**Fecha:** 2026-05-01
**Alcance:** `index.css`, `DashboardView.tsx`, `AdminDashboardView.tsx`

**Cambios aplicados:**

- **Escalado Global:** Se redujo el tamaño de fuente base (`html font-size`) de 16px a 15px en pantallas grandes (desktop). Esto emula el efecto de "zoom out" al 90-95% que el usuario prefiere, dando más espacio a todos los elementos.
- **Ampliación de Contenedores:** Se incrementó el ancho máximo de los contenedores principales de `max-w-6xl` (1152px) a `max-w-7xl` (1280px).
- **Layout:** Se aumentó el padding lateral y vertical en secciones críticas para evitar la sensación de que la información está "muy apretada".

**Razón:** Mejorar la comodidad visual y reducir la densidad de información percibida, permitiendo que la interfaz "respire" mejor en monitores de alta resolución.

---

### 24. Auditoría UI/UX (Fase 1 y 2): Estructura App-like y Modales

**Fecha:** 2026-05-01
**Alcance:** `DashboardView.tsx`, `AdminDashboardView.tsx`

**Cambios aplicados:**

- **Layout Fijo (App-like):** Se refactorizaron los contenedores principales de ambas vistas para usar una estructura estricta de `h-screen h-[100dvh] flex flex-col overflow-hidden`.
- **Delegación de Scroll:** El scroll global del `body` fue eliminado. Ahora, solo la etiqueta `<main>` (o el contenedor de contenido) tiene `overflow-y-auto`. Esto soluciona de raíz el problema de que el `Sidebar` desapareciera al bajar por la página.
- **Sidebar Estático:** Se eliminó la dependencia problemática de `sticky` en el menú lateral de administrador, pasándolo a ser un contenedor `relative h-full` dentro del grid flex, asegurando que siempre esté anclado a la izquierda.
- **Posicionamiento de Modales:** Al bloquear el scroll del `body`, los modales con `fixed inset-0` ahora calculan el 100% de la pantalla de forma perfecta, sin ser empujados hacia abajo por el contenido largo del dashboard.

**Razón:** Solucionar errores graves de posicionamiento reportados por el usuario (modales cortados, menús que se pierden) y elevar la calidad de la plataforma a estándares de SPA (Single Page Application).

### 25. Ocultamiento del Muro de Impacto

**Fecha:** 2026-05-01
**Alcance:** `LandingView.tsx`

**Cambios aplicados:**

- Se eliminó el componente `<ImpactFeedGrid />` de la sección pública "Muro de Impacto" para mantener la vista de *Landing* más limpia y enfocada en métricas institucionales, según instrucción del usuario.

**Razón:** Simplificar la página pública de inicio.

---

### 26. Auditoría UI/UX (Fase 3): Responsividad y Mobile-First

**Fecha:** 2026-05-01
**Alcance:** `AdminDashboardView.tsx`, `UserManager.tsx`, `MobilizationReports.tsx`

**Cambios aplicados:**

- **Overlay Móvil en Sidebar:** Se añadió un `div` con `fixed inset-0 bg-black/50 z-30` en el layout del administrador que aparece solo cuando el menú hamburguesa está abierto. Si el usuario toca fuera del menú (en el overlay), este se cierra automáticamente, mejorando drásticamente la usabilidad móvil.
- **Tablas Responsivas:** Se auditó que las tablas en `MobilizationReports.tsx` y `UserManager.tsx` estuvieran correctamente encapsuladas en contenedores `<div className="overflow-x-auto">`. Esto previene que una tabla ancha rompa el layout completo en pantallas pequeñas, permitiendo un scroll horizontal interno.
- **Formularios Táctiles:** Se verificó que los inputs en `DynamicRegistrationForm.tsx` tuvieran ancho completo (`w-full`) y el área táctil adecuada (`px-4 py-3`), alineados a principios de mobile-first.

**Razón:** Evitar desbordes de pantalla en dispositivos móviles y estandarizar la navegación con comportamientos nativos de aplicaciones (overlays y cierres al toque).

---

### 27. Refinado de Hero (H1 en 3 niveles y Subtítulo)
**Fecha:** 2026-05-01
**Alcance:** `LandingView.tsx`

**Cambios aplicados:**
- **H1:** Estructurado en 3 niveles ("UNIDOS CREAMOS", "UN IMPACTO", "POSITIVO") para un mayor impacto visual y ritmo.
- **Subtítulo:** Actualizado a una descripción más dinámica sobre la movilización de la generosidad y el esfuerzo comunitario.

**Razón:** Optimizar la jerarquía visual y la fuerza del mensaje inicial.

---

### 28. Nueva Sección: ¿Cómo Participar?
**Fecha:** 2026-05-01
**Alcance:** `LandingView.tsx`

**Cambios aplicados:**
- Se insertó una nueva sección inmediatamente después del Hero con una estructura de dos columnas interactivas.
- Se implementó un diseño limpio y moderno con acentos en colores rojo institucional (`#E81E25`) y amarillo (`#FFBA00`).
- Se añadieron fondos de círculos desenfocados (blur) para mantener consistencia con los elementos visuales de la cabecera.
- Se incluyó un bloque de CTA central "¡Cada acto cuenta..." destacado con sombras y bordes curvos tipo píldora.

**Razón:** Proveer claridad inmediata a los nuevos usuarios sobre qué actividades califican y los 4 pasos sencillos para registrarse.

---

### 29. Alineación de Diseño Institucional (Full-Width y Monocromático)
**Fecha:** 2026-05-01
**Alcance:** `LandingView.tsx`

**Cambios aplicados:**
- **Bloques Sólidos:** Se reemplazaron los contenedores con bordes y degradados por bloques *full-width* para reflejar exactamente el estilo de la web corporativa de United Way.
- **Uso Monocromático de Color:** En lugar de combinar azul, amarillo y rojo, la sección principal ahora usa exclusivamente la gama de azules (`#0044B5` y `#002D7A`) con texto en blanco.
- **Bloque CTA Rojo:** El llamado a la acción final se encapsuló en un bloque *full-width* completamente rojo (`#FD372C`) con un botón tipo píldora transparente con borde blanco, idéntico al manual visual proporcionado.
- **Curvas Corporativas:** Se añadieron curvas sutiles muy amplias como elementos decorativos (usando transparencias de negro/blanco), eliminando los efectos de desenfoque (*blur*) anteriores.

**Razón:** Cumplir estrictamente con los lineamientos gráficos institucionales de United Way Chihuahua, evitando el uso de degradados o combinaciones saturadas y favoreciendo los contrastes directos.

---

### 30. Ticket #63: Barra de Desplazamiento Horizontal Superior y Sincronizada
**Fecha:** 2026-08-28
**Alcance:** `MobilizationReports.tsx`, `index.css`
**Ticket:** #63 (United Way - Prioridad Media)

**Problema reportado:**
En el reporte de movilizaciones ciudadanas, al existir decenas de registros (ej. 58 filas), la barra de desplazamiento horizontal se ubicaba exclusivamente al final de la tabla (muy abajo), obligando a los usuarios a desplazarse verticalmente hasta el fondo para poder mover la tabla y ver las columnas derechas (Horas, Beneficiarios, Estatus, Ver ficha).

**Cambios aplicados:**
- **Barra Superior Sincronizada:** Se implementó una barra de desplazamiento horizontal justo arriba de la tabla (entre las pestañas de categorías y los encabezados).
- **Sincronización Bidireccional:** El scroll superior y el scroll de la tabla están enlazados en tiempo real mediante `useRef` y eventos de scroll con banderas de prevención de bucle.
- **Detección Automática de Desbordamiento:** Se incorporó un `ResizeObserver` para que la barra superior aparezca de forma automática únicamente cuando la tabla excede el ancho de la pantalla (`scrollWidth > clientWidth`).
- **Botones Rápidos de Navegación:** Se incluyeron botones interactivos `◀` y `▶` para desplazar horizontalmente la tabla con un clic.
- **Encabezados Fijos (Sticky Header):** Se fijó el `thead` con `sticky top-0 z-10` para que los nombres de las columnas permanezcan siempre legibles al navegar por las filas.
- **Scrollbar Estilizado:** Se actualizaron las propiedades de `.custom-scrollbar` en `index.css` con soporte de dimensiones horizontales y colores institucionales.

**Razón:** Resolver la usabilidad del reporte permitiendo explorar todas las columnas sin tener que bajar hasta el fondo de la tabla.

---

### 31. Ticket #64: Selector Predictivo de Corporativos y Organizaciones con Autocompletado
**Fecha:** 2026-08-28
**Alcance:** `PredictiveCompanySelector.tsx`, `DynamicRegistrationForm.tsx`, `ProfileForm.tsx`
**Ticket:** #64 (United Way - Prioridad Media)

**Problema reportado:**
En el formulario de registro de participación (*Registra tu Participación*) y en el perfil de usuario, la selección de empresas corporativas dependía de un `<select>` tradicional con más de 85 opciones o de entradas de texto libres sin estandarización, lo que volvía lento y propenso a errores encontrar las plantas o divisiones de cada empresa.

**Cambios aplicados:**
- **Nuevo Componente `PredictiveCompanySelector`:** Se construyó un control inteligente de búsqueda predictiva en tiempo real sobre el catálogo de más de 85 corporativos (`CORPORATIVOS_CATALOG`).
- **Autocompletado y Resaltado en Vivo:** Al escribir las primeras letras (ej. *"lea"*, *"yaz"*, *"apt"*), el componente filtra las opciones y resalta visualmente las coincidencias encontradas.
- **Navegación por Teclado y Clic:** Soporta navegación fluida mediante teclado (`▲`, `▼`, `Enter`, `Escape`) y selección directa con clic o toque.
- **Flexibilidad:** Permite seleccionar corporativos oficiales o ingresar nombres personalizados si una entidad no pertenece al catálogo inicial.
- **Integración Global:** Se implementó tanto en la modalidad *Corporativa* y *Personal* del formulario de registro de participación como en el formulario de edición de perfil.

**Razón:** Agilizar el registro de voluntariado y garantizar la uniformidad en los reportes de impacto corporativo.

---

### 32. Ticket #65: Aclaración de Llenado de Horas y Previsualizador de Impacto en Vivo
**Fecha:** 2026-08-28
**Alcance:** `DynamicRegistrationForm.tsx`
**Ticket:** #65 (United Way - Prioridad Media)

**Problema reportado:**
En el formulario de registro de participación, algunos usuarios ingresaban en el campo "HORAS" la suma total acumulada de todo el grupo (ej. 45 horas para 15 voluntarios en lugar de 3 horas por persona). Dado que el backend multiplica automáticamente `(duración × voluntarios)`, esto generaba un cálculo distorsionado de horas totales en el sistema.

**Cambios aplicados:**
- **Etiqueta Precisa:** Se renombró el campo a `DURACIÓN POR PERSONA (HORAS) *` con placeholder explicativo `Ej. 3`.
- **Leyenda Aclaratoria Destacada:** Se añadió una alerta visual informativa permanente con ícono `💡` que explica con un ejemplo práctico que debe ingresarse la duración por voluntario y no la suma total del grupo.
- **Previsualizador de Cálculo en Tiempo Real:** Se incorporó un bloque dinámico que muestra en vivo la fórmula y el total resultante: `[N] voluntarios × [H] horas = [Total] horas de impacto generadas`, permitiendo a los usuarios validar inmediatamente el impacto que se guardará.
- **Alerta Preventiva de Rango:** Si se ingresan más de 24 horas en una sola actividad, se despliega una advertencia preventiva para evitar errores de captura.

**Razón:** Eliminar la confusión en el reporte de horas y asegurar que las métricas de impacto de United Way se calculen con total precisión.

---

### 33. Ticket #66: Pestañas de Filtrado y Ficha de Visualización Detallada de Actividades Registradas
**Fecha:** 2026-08-28
**Alcance:** `RegistrationManager.tsx`
**Ticket:** #66 (United Way - Prioridad Media)

**Problema reportado:**
En el módulo de administración *"Gestión de Movilizaciones e Impacto"* (`/admin`), la tabla mostraba todos los registros en una sola lista sin clasificar por estatus. Además, la columna de Causa mostraba etiquetas genéricas como "Movilización Propia" y no existía una forma de consultar el contenido detallado de la actividad realizada (descripción, enlace de fotos de evidencia, localidad, fecha o datos de contacto).

**Cambios aplicados:**
- **Pestañas por Estatus con Contadores (Tabs):** Se implementó una barra superior con pestañas activas: `[⏳ Pendientes por Validar]`, `[✅ Aprobadas]`, `[❌ Rechazadas]` y `[📋 Todos los Registros]`, cada una con su contador dinámico en tiempo real.
- **Buscador Rápido:** Se añadió un campo de búsqueda en vivo por voluntario, empresa, causa o localidad.
- **Visualizador Ficha de Actividad (`RegistrationDetailModal`):** Se integró un modal completo que se abre al dar clic en `👁️ Ver Ficha`. Muestra:
  * Nombre real de la actividad y modalidad.
  * Datos del voluntario y organización representada (con teléfono directo y correo).
  * Lugar exacto y fecha de ejecución.
  * Desglose del impacto: voluntarios, horas por persona y total de horas acumuladas.
  * Descripción detallada de las acciones y testimonios.
  * Enlace directo a la galería de evidencias fotográficas.
- **Acciones Directas:** Se hicieron permanentemente visibles los botones de dictamen (`Aprobar ✅`, `Rechazar ❌`, `Eliminar 🗑️`) tanto en la tabla como en el pie de la ficha modal.

**Razón:** Facilitar al equipo de United Way la revisión minuciosa y aprobación ágil de cada registro de impacto social con todas sus evidencias.
