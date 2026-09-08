# Registro de Ajuste Fino - Micrositio "Somos Comunidad"

Este documento sirve como bitácora de discusión para las mejoras y ajustes finos del sistema. Aquí se registrarán las preguntas del usuario, las propuestas de solución y el plan de implementación para cada punto.

---

## Índice de Ajustes

1. [Gestión de Usuarios y Registro](#1-autenticación-tradicional-y-vista-mis-causas)
2. [Enriquecimiento del Catálogo de Actividades](#2-enriquecimiento-del-catálogo-de-actividades)
3. [Separación de Micrositio Público y Área Privada](#3-separación-de-micrositio-público-y-área-privada)

---

## 1. Autenticación Tradicional y Vista "Mis Causas"

**Pregunta:** ¿Dónde se registra el usuario? ¿Debe existir un usuario previo para registrar una actividad?

**Análisis:** El usuario requiere un sentido de pertenencia y seguimiento. La propuesta inicial de "Registro Invisible" se descarta en favor de un sistema de **Login/Registro tradicional** para permitir una vista personalizada de histórico de actividades ("Mis Eventos").

**Propuesta Final:**

1. **Base de Datos:**
    - Ampliar tabla `users` con campos: `last_name`, `age`, `password` (hash).
2. **Frontend:**
    - Implementar componentes `LoginView.tsx` y `RegisterView.tsx` siguiendo el diseño del ejemplo (Formulario limpio con botón verde de acción).
    - Crear `MyEventsView.tsx` para mostrar el Dashboard personal.
    - Implementar `AuthContext` para manejar el estado de la sesión globalmente.
3. **Backend (CodeIgniter):**
    - Crear controlador `Auth.php` para gestionar el registro y validación de credenciales.
    - Proteger los endpoints de creación de actividades para que solo usuarios logueados puedan registrar impactos.

**Estado:** Hecho.

---

## 2. Enriquecimiento del Catálogo de Actividades

**Pregunta:** El menú actual de causas institucionales no aporta información ni incentiva el registro. ¿Cómo facilitar la toma de decisiones?

**Análisis:** Un simple selector (`select`) es funcional pero frío. Para incentivar la participación, el usuario necesita una conexión emocional e informativa con la causa.

**Propuesta:**

1. **Frontend:**
    - Reemplazar el `select` por un **Explorador de Causas** basado en un Grid de Tarjetas.
    - Cada tarjeta incluirá: Imagen, Título, Descripción breve, Ubicación y un indicador de "Lugares Disponibles".
    - Implementar un estado de "Causa Seleccionada" que resalte la tarjeta elegida y habilite el flujo de registro.
2. **Backend:**
    - Añadir campo `image_url` y `long_description` a la tabla `activities_catalog`.
    - Actualizar el modelo y controlador de actividades para servir esta metadata enriquecida.

**Estado:** Hecho.

---

## 3. Separación de Micrositio Público y Área Privada

**Pregunta:** Todo está en la misma página y es confuso. ¿Cuál es la parte pública y cuál la privada?

**Análisis:** La arquitectura inicial de "página única" mezcla el contenido informativo con la funcionalidad operativa, lo que genera confusión en la navegación y diluye el mensaje institucional.

**Propuesta:** Implementar un sistema de enrutamiento (React Router) para definir dos experiencias distintas:

1. **Micrositio Público (`/`)**: Enfocado en la visión, estadísticas globales (`MetricsDashboardView`) y el muro de impacto público (`ImpactFeedGrid`). Su objetivo es informar e inspirar.
2. **Dashboard de Usuario (`/dashboard`)**: Área protegida tras el login. Aquí el usuario encontrará el formulario de registro de actividades (`DynamicRegistrationForm`) y su historial de causas personales.

**Estado:** Hecho.

---

## 4. Diseño del Landing Page Público (Micrositio)

**Pregunta:** ¿Cómo sabrán las personas de qué trata "Somos Comunidad" si en la parte pública solo tenemos el impacto en tiempo real? ¿Se puede usar el texto del documento para crear una Landing Page completa con hero y elementos web?

**Análisis:** Es fundamental tener una página de aterrizaje (Landing Page) estructurada que funcione como el principal embudo de información y conversión. El visitante necesita contexto institucional antes de ver los números o decidir registrarse. El texto provisto (`texto micrositio somos comunidad.docx.pdf`) contiene la narrativa, el propósito y el llamado a la acción necesarios.

**Propuesta:**

1. **Rediseño de `LandingView.tsx`:** Transformar la vista actual en una verdadera Landing Page moderna.
    - **Hero Section:** Un encabezado visualmente impactante (usando diseño *Premium*, gradientes y *glassmorphism*) que comunique de inmediato el eslogan y propósito del movimiento.
    - **Sección "El Movimiento":** Utilizar la narrativa del documento para explicar qué es Somos Comunidad y por qué importa.
    - **Sección "Causas/Ejes":** Representar visualmente (con tarjetas e íconos) los enfoques del proyecto extraídos del texto.
    - **Prueba Social (Reubicación):** Posicionar el `MetricsDashboardView` y el `ImpactFeedGrid` debajo del contexto informativo, para que el impacto en tiempo real valide la narrativa.
    - **Call to Action (CTA):** Botones claros y atractivos ("Súmate al movimiento", "Registra tu causa") que dirijan al usuario a `/register` o `/login`.

**Estado:** Aprobado (En desarrollo).

---

## 5. Visualización de Actividades Registradas del Usuario ("Mis Eventos")

**Pregunta:** Registré mi participación en una actividad institucional, pero en ningún lado como usuario puedo ver a cuál me registré ni puedo ver información sobre el evento. ¿Debería tener forma de revisar esa información, y que cada usuario vea solo sus propios eventos?

**Análisis:** Actualmente el sistema guarda correctamente los registros en la base de datos (`impact_registrations`), pero el ciclo de experiencia de usuario queda incompleto porque no existe una interfaz donde puedan consultar sus compromisos adquiridos. El usuario necesita un historial personal dentro de su sesión para validar sus registros, ver detalles del evento y llevar un control de su impacto.

**Propuesta:**

1. **Backend (CodeIgniter):**
    - Crear un nuevo endpoint `GET /api/registrations/my-events` que requiera autenticación (JWT).
    - Implementar una consulta que cruce (JOIN) la tabla `impact_registrations` con `activities_catalog` filtrando exclusivamente por el `user_id` del usuario en sesión, garantizando la privacidad de los datos.
2. **Frontend (React):**
    - Reutilizar y enriquecer la pestaña existente de "Mis Eventos" en el `DashboardView.tsx` para desplegar ahí la información, evitando crear vistas reiterativas.
    - Diseñar tarjetas resumen dentro de esta vista que categoricen claramente: por un lado, las "Causas Oficiales" a las que se ha inscrito, y por otro, "Mis Movilizaciones Propias" que ha reportado (utilizando los nuevos campos robustos como nombre personalizado, horas y ubicación).
    - Opcionalmente, agregar un botón para "Cancelar Registro" si la actividad aún no ha ocurrido.

**Estado:** Aprobado (En desarrollo).

---

## 6. Auditoría y Enriquecimiento del Perfil de Usuario

**Pregunta:** ¿Se podrían precargar campos como "a quién representas", "estado" y "municipio" desde el perfil del voluntario? La idea es capturar la información una vez y usarla en todas partes. ¿Se puede hacer una auditoría para ver qué campos se pueden cargar automáticamente?

**Análisis:** El principio de capturar una vez y reutilizar (DRY en experiencia de usuario) es fundamental para reducir la fricción en los formularios recurrentes. Tras una auditoría rápida de la base de datos y el flujo actual, observamos que la tabla `users` está limitada a datos muy básicos (nombre, correo, edad, password). Para lograr la auto-carga en los reportes de impacto, necesitamos crear un "Perfil Extendido" del usuario.

**Propuesta:**

1. **Base de Datos (Migración):**
    - Crear una nueva migración para añadir a la tabla `users` los campos: `organization_name` (Escuela/OSC/Empresa), `state` (Estado), `municipality` (Municipio) y `phone_number` (Teléfono).
2. **Backend (CodeIgniter):**
    - Actualizar `UserModel.php` agregando los nuevos campos a `$allowedFields`.
    - Crear un endpoint `PUT /api/users/profile` que permita al usuario guardar y actualizar esta información.
3. **Frontend (React):**
    - **Vista "Mi Perfil":** Añadir una sección en el Dashboard (`ProfileView.tsx` o similar) para que el voluntario complete sus datos complementarios una sola vez.
    - **Auto-completado en Registro:** Modificar el hook `useRegistrationForm.ts` para que, al detectar que el usuario tiene estos datos en su sesión (`AuthContext`), inicialice los campos `groupName`, `locationAddress` y `phone` de forma automática en los formularios de las causas (Flujo A y B).

**Estado:** Aprobado (En desarrollo).

---

## 7. Selector Dinámico de Localidades (Estados y Municipios)

**Pregunta:** La selección de las localidades debe ser más práctica en todos lados donde se necesite capturar municipio y estado. Debe tener una lista precargada y que funcione con búsqueda por letra de estados de México y luego en cascada llame los municipios.

**Análisis:** Los campos de texto libre para estado y municipio generan datos sucios ("Chih", "Chihuahua", "CHIH"). Un componente de selección en cascada mejora la calidad de los datos para los reportes de impacto geográfico.

**Propuesta:**

1. Crear un componente React `LocationSelector` que consuma una lista JSON oficial de estados y municipios de México.
2. Implementar lógica de búsqueda y filtrado en cascada (seleccionar Estado -> cargar Municipios).
3. Integrar este componente en todos los formularios relevantes (Registro de Usuario, Registro de Movilización Ciudadana).

**Estado:** Hecho.

---

## 8. Reportes PDF Institucionales y Métricas Centralizadas

**Pregunta:** ¿Como administrador cómo puedo generar un reporte en PDF tamaño carta desde la vista de resumen de impacto con la identidad de United Way y el logo de Somos Comunidad? Además, la métrica de beneficiarios debe ser un valor asignado por el administrador, no un cálculo por voluntario.

**Análisis:** Los reportes de impacto necesitan un formato profesional para compartirse con stakeholders. Las métricas deben estar consolidadas, y el campo de beneficiarios debe ser controlado centralmente.

**Propuesta:**

1. **Frontend:** Crear la vista `MetricsDashboardView` diseñada en dos modos: una vista de pantalla (dashboard interactivo) y una vista optimizada para impresión (tamaño carta, logo corporativo, firmas de validación). Ocultar controles administrativos en la versión pública del micrositio.
2. **Backend:** Refactorizar el endpoint de métricas para consolidar datos, calcular totales de voluntarios, horas, acciones y servir la lista de localidades agrupadas.

**Estado:** Hecho.

---

## 9. Rediseño Premium del Hero (Micrositio) con Identidad Visual

**Pregunta:** Se necesita colocar el logo de Somos Comunidad arriba del título principal del Hero (un 15% más grande). También se requiere colocar la foto de portada como fondo detrás del título principal con efectos minimalistas y micro-animaciones en tendencia.

**Análisis:** El primer impacto visual del micrositio es clave. La imagen de fondo debe ser inmersiva pero permitir la legibilidad del texto corporativo y los llamados a la acción.

**Propuesta:**

1. Integrar el logo institucional con el tamaño requerido.
2. Mover la imagen de portada al `background` de la sección Hero con la clase `animate-slow-zoom` para un efecto cinematográfico.
3. Aplicar un overlay con degradado de color institucional (Azul Marino a Naranja) para asegurar contraste y legibilidad.
4. Aplicar estilo glassmorphism en botones secundarios para un aspecto moderno.

**Estado:** Hecho.

---

## 10. Implementación de Identidad Visual Institucional (Guía de Uso de Marca)

**Pregunta:** ¿Cómo aplicar correctamente la paleta de la guía de marca en el área privada (usuario y administrador)? La interfaz actual usa naranja (#f57921) y dark mode, pero la guía exige fondo blanco, azul #0044B5 y dorado #FFBA00 con tipografía Antonio Bold en titulares.

**Análisis:** El área privada debe seguir la identidad oficial de United Way Chihuahua / Somos Comunidad. Las combinaciones indicadas en la guía son: **Dorado + Azul** (CTAs), **Azul Oscuro + Blanco** (topbar/sidebar), **Blanco sobre Azul** (formularios con banda superior). La tipografía institucional para titulares es **Antonio Bold en mayúsculas**. El naranja (`#f57921`) no forma parte de la paleta oficial — debe ser sustituido por el dorado `#FFBA00`.

**Propuesta implementada:**

1. **`index.html`:** Carga de fuentes `Antonio` + `Inter` desde Google Fonts.
2. **`index.css`:** Sistema de diseño institucional completo con variables CSS, clases utilitarias (`.font-antonio`, `.btn-brand-gold`, `.btn-brand-blue`, `.card-brand`, `.input-brand`, `.sidebar-brand`, `.topbar-brand`, `.divider-gold`, `.progress-brand-track`).
3. **Topbar institucional:** Color `#0044B5` en todas las vistas privadas. Logo "Somos Comunidad" a color sobre fondo azul. Acento dorado para usuario y badges de admin.
4. **Sidebar admin:** Fondo `#002D7A` (azul oscuro), ítem activo con borde izquierdo dorado `#FFBA00`.
5. **Formularios:** Fondo blanco, banda superior azul `#0044B5` con título en `Antonio Bold` blanco/mayúsculas.
6. **Titulares:** Todos los `<h2>`, `<h3>`, `<h4>` importantes usan `.font-antonio` (mayúsculas, tracking wide).
7. **Vistas actualizadas:** `LoginView`, `RegisterView`, `DashboardView`, `AdminDashboardView`.
8. **Componentes actualizados:** `ActivityManager`, `RegistrationManager`, `UserManager`, `ProfileForm`, `DynamicRegistrationForm`.
9. **Logos copiados:** `somoscomunidad-logo.png` e `image.png` (United Way) en `frontend/public/` para topbars.

**Estado:** Hecho.

---

## 11. Rediseño del Micrositio Público (Identidad United Way)

**Pregunta:** ¿Cómo alinear la interfaz pública con los cambios realizados en el área privada para mantener la coherencia de marca?

**Análisis:** El micrositio es la cara visible para los donantes y ciudadanos. Debe transmitir el mismo nivel de profesionalismo que el dashboard. Se identificó que las vistas `LandingView`, `MetricsDashboardView` e `ImpactFeedGrid` aún utilizaban colores obsoletos (naranja y azul marino antiguo) y tipografías genéricas.

**Propuesta implementada:**

1. **Unificación Visual:** Se migró toda la paleta pública al Azul Institucional (#0044B5) y Dorado (#FFBA00).
2. **Tipografía Institucional:** Se forzó el uso de `font-antonio` (Antonio Bold) en todos los encabezados importantes de la landing page.
3. **Refactorización de Componentes:**
   - La `LandingView` ahora usa una cabecera `.topbar-brand` (azul) para que la transición al entrar al login/dashboard sea imperceptible.
   - `ImpactFeedGrid` mejoró su UX con efectos de hover, bordes redondeados orgánicos y overlays informativos.
   - El sistema de reportes en `MetricsDashboardView` fue rediseñado para parecer un certificado oficial de United Way, listo para ser descargado o impreso.
4. **Assets:** Se configuraron las rutas para usar los logos `/image.png` y `/somoscomunidad-logo.png` ya presentes en la carpeta pública.

**Estado:** Hecho.

---

## 12. Campo Dinámico de Agrupación según Modalidad

**Pregunta:** ¿Se puede hacer dinámico el campo de "Escuela, OSC, Empresa..." para que, al elegir "Corporativa", cargue una lista de empresas (Lear y otras en CSV); si es "Comunidad abierta", se bloquee; si es "Personal", sea texto libre; y si es "Institucional", cargue un catálogo activo?

**Análisis:** Es una excelente idea para estandarizar la captura de datos (Data Governance) y evitar errores tipográficos, especialmente vital para los reportes de impacto corporativo. Requerirá que el componente del formulario escuche los cambios en el campo "Modalidad" e inyecte diferentes tipos de inputs.

**Propuesta:**

1. **Consolidación de Datos (Corporativos):**
   - Tomar los datos de `LearHQ.csv` y `Empresas.csv` y unificarlos en un solo listado ordenado. Podemos guardarlo como una constante JSON en el frontend para acceso inmediato, o cargarlo en BD si planeas editarlo frecuentemente desde el panel admin. (Para empezar, sugiero constante en el Frontend).
2. **Lógica Dinámica en `DynamicRegistrationForm.tsx`:**
   - **Corporativa:** Muestra un `<select>` poblado con la lista consolidada de corporativos (Aptiv, Lear, Bosch, etc.).
   - **Comunidad Abierta:** El campo se oculta completamente o se bloquea (se asume que no representan a ningún grupo).
   - **Personal:** Muestra un `<input type="text">` de formato libre como está actualmente.
   - **Institucional:** Muestra un `<select>` cargado con un catálogo predefinido. *(Pregunta: ¿Este catálogo institucional lo tienes en algún CSV o lo sacamos de la BD actual?)*
3. **Manejo de Estado Seguro:** Cada vez que el usuario cambie de Modalidad, el sistema limpiará el valor previo del campo de empresa/organización para evitar datos cruzados en la base de datos.

**Estado:** Propuesto (Esperando confirmación para ejecutar).

---

## 13. Módulo "Reporteador" de Voluntariado y Exportación

**Pregunta:** ¿Se puede añadir un "Reporteador" en el panel de administrador (entre las métricas y las causas institucionales) para generar 3 reportes en tabla basados en la participación de los usuarios por tipo de voluntariado? Además, en las causas institucionales, ¿se puede agregar una función para exportar sus registros de forma similar?

**Análisis:** Es una necesidad administrativa fundamental. Al separar el flujo institucional del ciudadano, la forma de consultar los datos también debe dividirse. Para las movilizaciones ciudadanas (Corporativa, Personal, Comunidad Abierta) tiene sentido un reporteador centralizado. Para el institucional, la exportación debe vivir dentro del detalle de cada causa, ya que es información específica de un evento.

**Propuesta:**

1. **Frontend (Reporteador Central - `AdminDashboardView.tsx`):**
   - Crear un componente nuevo (`MobilizationReports.tsx`) y colocarlo exactamente donde solicitas: entre las tarjetas de métricas y el estatus de causas.
   - Este módulo tendrá 3 pestañas o secciones: "Corporativo", "Personal" y "Comunidad Abierta".
   - Cada pestaña mostrará una tabla con los registros de los usuarios (Nombre, Fecha, Horas, y Organización basada en el punto #12).
   - Contará con un botón universal de "Descargar CSV/Excel".
2. **Frontend (Exportación Institucional - `ActivityManager.tsx`):**
   - En el modal actual donde das clic para ver los voluntarios de una causa institucional, agregaremos un botón de "Exportar Lista" en la parte superior derecha de la tabla.
3. **Backend (CodeIgniter):**
   - Crearemos endpoints específicos (`/api/admin/reports/mobilizations` y `/api/admin/activities/export`) diseñados para retornar los datos limpios y formateados, listos para ser convertidos a CSV por el navegador.

**Estado:** Propuesto (Esperando confirmación para ejecutar).

---

## 14. Corrección de Métricas por Efecto de "Soft Delete"

**Pregunta:** ¿Por qué en mi resumen de impacto sigo registrando horas generadas a pesar de haber borrado impactos? ¿Es por el soft delete?

**Análisis:** ¡Tienes toda la razón! Excelente observación. Al revisar el controlador del backend (`Metrics.php`), las sumas totales (horas y beneficiarios) se obtienen mediante llamadas directas al constructor de consultas (`selectSum()->get()`). En CodeIgniter 4, usar `->get()` salta la capa del modelo y va directo a la base de datos, ignorando el filtro automático de Soft Deletes. Por lo tanto, tu sistema está sumando matemáticamente todos los registros, incluso los que marcaste como borrados.

**Propuesta:**

1. **Backend (`Metrics.php`):**
   - Refactorizaremos las consultas de agregación (`selectSum`) en las líneas 24 y 34 para incluir explícitamente el filtro `->where('deleted_at', null)` o usar los métodos propios del modelo (`findAll` / `first`) que sí aplican la protección.
   - Haremos la misma corrección en la consulta de ubicaciones (la que agrupa por municipios), ya que utiliza `$db->table()` directo y también es vulnerable a mostrar datos de registros eliminados.

**Estado:** Ejecutado y verificado.

---

## 15. Simplificación de Flujos y Origen de Datos Corporativos (Perfil)

**Pregunta:** ¿Es necesario tener "Institucional" como opción al registrar una movilización propia? ¿No sería mejor sacar el dato de la empresa a la que representan directamente desde su perfil, agregando ahí la lista de empresas y una opción de captura manual ("Otro")?

**Análisis:** ¡Tienes toda la razón desde la perspectiva de Experiencia de Usuario (UX) y Arquitectura de Datos! Has dado en el clavo con una redundancia importante.

1. **Cero Confusión:** Tener la opción "Institucional" en el formulario de "Movilización Propia" confunde. El usuario debe usar exclusivamente la pestaña de Causas Institucionales para sumarse a ellas.
2. **Trazabilidad Eficiente:** Es mucho más inteligente y limpio que la afiliación (Empresa/Escuela) viva permanentemente en el **Perfil del Usuario** (`organization_name`) y no se le pregunte cada vez que registra una actividad. Así, si un usuario se registra como colaborador de "Lear", **todas** sus participaciones (ya sea en causas de UW o en proyectos propios) sumarán automáticamente a las métricas de "Lear".

**Propuesta:**

1. **Formulario de Movilización (`DynamicRegistrationForm.tsx`):** Eliminar definitivamente la opción "Institucional" del combo de *Modalidad*. Dejamos solo Corporativa, Personal y Comunidad Abierta.
2. **Perfil de Usuario (`ProfileSettings` o Modal de Registro):** Transformar el campo de "Organización/Empresa" actual en un componente dinámico que cargue nuestra constante `CORPORATIVOS_CATALOG`.
3. **Opción "Otro" (Captura Libre):** Añadir en ese mismo componente del perfil un *checkbox* que diga "Mi empresa/escuela no está en la lista" (o una opción "Otro" en el combo), que al activarse despliegue un campo de texto libre para que no haya limitantes.

**Estado:** Ejecutado y verificado.

---

**Estado:** Ejecutado y verificado.

---

## 16. Simplificación Radical de Flujos Institucionales (El modelo "B2B")

**Propuesto por el Usuario:** *El usuario descarta la idea de crear carteleras complejas o capturas masivas desde el admin. En su lugar, propone una arquitectura mucho más pragmática: Que la plataforma maneje Cuentas Corporativas (Empresas) y Cuentas de Ciudadanos, y que a través del mismo formulario de registro, una Empresa pueda simplemente seleccionar la Causa Institucional a la que asistió e ingresar la sumatoria total de sus voluntarios, horas y beneficiarios.*

**Análisis del Orquestador:** ¡Te explicaste perfectamente! Tienes una visión muy madura del producto. Lo que me estás proponiendo es no sobre-ingeniar la plataforma con inscripciones uno-a-uno para causas institucionales, sino tratar la plataforma puramente como un **Agregador de Métricas de Impacto**. Si Lear lleva 500 personas, la cuenta de RRHH de Lear entra, selecciona la Reforestación, le pone "500 personas, 4 horas", sube la evidencia y listo. El Excel de nombres lo manejan ustedes por fuera. ¡Es brillante por su simplicidad!

Esto significa que **debemos revertir una parte del Ajuste #15** y tomar un nuevo camino:

1. **Regresar la opción "Institucional":** Debemos volver a colocar "Institucional" en el formulario principal (`DynamicRegistrationForm.tsx`).
2. **El Formulario Universal:** Si eligen "Institucional", en lugar de pedirles que escriban el nombre de la actividad, les mostramos la lista de causas creadas por el Admin. Luego, les pedimos exactamente la misma información que en una movilización propia: ¿Cuántos voluntarios? ¿Cuántas horas? ¿Cuántos beneficiarios?
3. **El Cálculo Honesto (La Misión Crítica):** Seguimos teniendo el error matemático en `Metrics.php`. Debemos modificarlo para que multiplique `(volunteer_count * duration_hours)` en todas las consultas de impacto. Así, si la cuenta de Lear mete "500 voluntarios x 4 horas", el sistema sume automáticamente 2,000 horas al dashboard.
4. **Cuentas Corporativas (Opcional pero recomendado):** Como ya movimos la selección de la empresa al **Perfil** (Ajuste #15), el sistema ya sabe quién es una empresa. Cuando la cuenta "Lear" envía este formulario, el backend ya lo registra a nombre de Lear gracias a su perfil.

**Estado:** Completado.

---

### **Ajuste #17: Exclusión de Institucionales en "Causas Registradas"**

**Contexto de la duda:** El indicador de "Causas Registradas" (tanto en landing como en sistema) muestra 8, pero el usuario nota que las participaciones en causas institucionales no deberían sumar como "Causas Nuevas", ya que solo la movilización propia, corporativa o abierta constituyen acciones genuinas creadas por la comunidad.

**Análisis del Orquestador:**
¡Tienes toda la razón! Matemáticamente y conceptualmente, cuando Lear lleva 500 voluntarios a una "Reforestación Institucional", eso genera impacto en **Horas** y **Voluntarios**, pero **NO** genera una "Causa Registrada" nueva (porque la causa ya existía y es de ustedes).
En cambio, si un vecino limpia un parque por su cuenta, eso sí suma **1 Causa Registrada**, además de las horas y voluntarios de ese vecino.

Actualmente el sistema está mezclando esto o tal vez no está filtrando correctamente.
Procedo a registrar esta misión como Ajuste #17. Modificaremos tanto `Metrics.php` (para el dashboard) como la consulta del Landing Page para asegurar que el indicador de "Causas" o "Acciones" **excluya** los registros donde la modalidad fue "Institucional".

---

### **Ajuste #18: Alineación del Logotipo en el Hero (Landing Page)**

**Problema:** El logotipo de "Somos Comunidad" en la sección Hero del landing page no está perfectamente alineado con el texto descriptivo inferior ("Movilizamos la generosidad..."). Esto sucede porque la imagen del logotipo tiene elementos asimétricos (el corazón a la derecha) que desplazan visualmente el eje central o el borde izquierdo cuando se usa un contenedor con ajuste automático.

**Análisis del Orquestador:**
Al observar la captura, el texto "SOMOS COMUNIDAD" dentro del logo debería servir como la guía vertical para el párrafo inferior. Sin embargo, al usar `object-contain` (que centra la imagen por defecto), el espacio extra que ocupa el icono del corazón a la derecha empuja todo el logotipo hacia la izquierda, haciendo que el texto "SOMOS" empiece antes que el párrafo.

**Propuesta:**
1. **Frontend (`LandingView.tsx`):**
   - Cambiar la clase del logotipo en el Hero de `object-contain` a `object-left object-contain`. Esto obligará a que la imagen se pegue al borde izquierdo de su contenedor, alineando el inicio del texto del logo con el inicio del párrafo.
   - Ajustar el contenedor del logo (`max-w-3xl`) si es necesario para asegurar que no haya paddings fantasmas.
   - Revisar si la imagen original tiene márgenes transparentes laterales y, de ser así, aplicar un margen negativo correctivo (ej: `-ml-2`) para lograr una alineación óptica perfecta.

**Estado:** Ejecutado ✅

---

### **Ajuste #19: Configuración de Favicon Institucional (United Way)**

**Problema:** El micrositio utiliza el favicon por defecto de Vite (`favicon.svg`). Se requiere utilizar el logotipo oficial de United Way Chihuahua (`favicon.png`) como el icono de pestaña predeterminado.

**Análisis del Orquestador:**
El favicon es un elemento clave para la identidad visual y el reconocimiento del sitio en el navegador. La imagen proporcionada está en formato PNG, lo cual es compatible con todos los navegadores modernos.

**Propuesta:**
1. **Preparación de Assets:** Copiar el archivo `contexto/favicon.png` a la carpeta `frontend/public/` para que sea accesible de forma estática.
2. **Frontend (`index.html`):**
   - Actualizar la etiqueta `<link rel="icon">` para que apunte a `/favicon.png`.
   - Asegurar que el tipo de contenido sea `image/png`.
   - Eliminar la referencia al antiguo `/favicon.svg`.

**Estado:** Ejecutado ✅

---

### **Ajuste #20: Redirección al Home en Logotipos de Header**

**Problema:** Los logotipos en los encabezados (headers) de las diferentes vistas (Login, Registro, Dashboard, Admin) no redireccionan a la página principal (Landing Page), lo cual rompe con la convención estándar de navegación web.

**Análisis del Orquestador:**
Se ha verificado que mientras `LandingView` y `DashboardView` sí cuentan con el enlace, `LoginView` y `RegisterView` carecen por completo de la etiqueta `<Link to="/">` envolviendo los logotipos institucionales. Esto genera una sensación de "callejón sin salida" para el usuario que desea regresar al inicio sin completar el formulario.

**Propuesta:**
1. **Unificación de Header:** Envolver los logotipos en `LoginView.tsx` y `RegisterView.tsx` con el componente `<Link to="/">` de `react-router-dom`.
2. **Consistencia Visual:** Asegurar que el efecto de hover (`hover:scale-105 transition-transform`) esté presente en todos los headers para indicar que el logo es un elemento interactivo.

**Estado:** Ejecutado ✅

---

### **Ajuste #21: Restauración de Máscara en Logotipo del Footer**

**Problema:** En el ajuste anterior del footer, se intentó "limpiar" el logotipo de United Way para eliminar lo que parecía un recorte. Sin embargo, el usuario indica que el logotipo debe conservar su "máscara" (el círculo blanco característico) tal como viene en el archivo original, ya que es parte de la identidad institucional.

**Análisis del Orquestador:**
El diseño de marca de United Way a menudo utiliza un contenedor circular para el logotipo. Al aplicar filtros de inversión y ajustes de contenedor (`object-contain`), se estaba alterando la presentación original. Se debe respetar la integridad del archivo `image.png` tal como se suministró.

**Propuesta:**
1. **Frontend (`LandingView.tsx`):**
   - Retirar las clases de manipulación visual agresiva (`brightness-0 invert`) del logotipo de United Way en el footer si estas ocultan el diseño circular original.
   - Si el fondo del footer es demasiado oscuro y el logo original no resalta, se evaluará colocar el logo dentro de un contenedor blanco circular controlado o simplemente dejar que el archivo se renderice sin filtros CSS que alteren su forma.

**Estado:** Ejecutado ✅

---

### **Ajuste #22: Logotipo en Ficha de Inicio de Sesión**

**Problema:** La vista de Login actualmente tiene una cabecera azul con texto, pero le falta el refuerzo de marca dentro del contenedor principal (la ficha blanca).

**Análisis del Orquestador:**
Colocar el logotipo de "Somos Comunidad" dentro de la ficha de login mejora la confianza del usuario y la estética de la página. Debe ir centrado y con un tamaño equilibrado para no desplazar demasiado el formulario.

**Propuesta:**
1. **Frontend (`LoginView.tsx`):**
   - Insertar el logotipo `somoscomunidad-logo.png` justo antes del título "Iniciar Sesión" dentro de la banda azul superior de la ficha.
   - Se usará un tamaño de `h-20`, centrado, y con el filtro `brightness-0 invert` para que resalte sobre el fondo azul institucional.

**Estado:** Ejecutado ✅

---

### **Ajuste #23: Unificación de Headers (Logo UW + Logo SC)**

**Problema:** La vista de Login y Registro utilizan un header simplificado que solo muestra el logotipo de "Somos Comunidad". El usuario solicita que se utilice el mismo formato que en el Landing Page y los Dashboards: Logotipo de United Way Chihuahua + Divisor Dorado + Logotipo de Somos Comunidad.

**Análisis del Orquestador:**
Mantener la consistencia del header en todo el sitio es vital para la identidad de marca. El header debe ser idéntico en todas las páginas para que el usuario sienta que sigue dentro de la misma plataforma oficial.

**Propuesta:**
1. **Frontend (`LoginView.tsx` y `RegisterView.tsx`):**
   - Reemplazar el header actual por la estructura completa de doble logotipo utilizada en `LandingView.tsx`.
   - Asegurar que ambos logotipos estén dentro del `<Link to="/">` (vinculado con el Ajuste #20).
   - Aplicar el estilo `topbar-brand` para garantizar la altura y sombreado institucional.

**Estado:** Ejecutado ✅
