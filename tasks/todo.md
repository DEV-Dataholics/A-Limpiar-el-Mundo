# Plan de Implementación: Panel de Administración (Admin Dashboard)

Este documento detalla los pasos para construir el panel de administración de "Somos Comunidad", enfocado en la gestión de eventos, usuarios, movilizaciones e indicadores, manteniendo los estándares de UX y gobernanza de datos.

## Fase 1: Arquitectura y Gobernanza de Datos (Backend)
1. **Roles y Seguridad:**
   - [ ] Actualizar la base de datos para asegurar el manejo de roles (ej. `role_id` o `is_admin` en la tabla `users`).
   - [ ] Crear un filtro (Middleware) `AdminAuthFilter.php` en CodeIgniter 4 para proteger todas las rutas bajo `/api/admin/*`.
2. **Soft Deletes (Bajas Lógicas):**
   - [ ] Configurar los modelos (`UserModel`, `ActivitiesCatalogModel`, `ImpactRegistrationModel`) para usar `$useSoftDeletes = true`. Esto es crucial para la gobernanza de datos: en lugar de borrar físicamente y perder el historial, se marca un `deleted_at`.

## Fase 2: Desarrollo de la API de Administración (Backend)
1. **Controlador de Métricas (`AdminMetrics.php`):**
   - [ ] Endpoint `/api/admin/metrics`: Obtener KPIs generales (Total voluntarios, causas activas, impacto acumulado).
2. **Controlador de Causas (`AdminActivities.php`):**
   - [ ] Endpoints CRUD (`GET`, `POST`, `PUT`, `DELETE`) para gestionar el catálogo de causas institucionales.
   - [ ] Campos requeridos al crear: Nombre, descripción corta/larga, imagen, capacidad min/max, fecha, ubicación.
3. **Controlador de Movilizaciones y Registros (`AdminRegistrations.php`):**
   - [ ] Endpoint para listar registros pendientes/aprobados (Flow B y A).
   - [ ] Endpoint para cambiar el estatus de una movilización (Aprobar/Rechazar/Eliminar).
4. **Controlador de Usuarios (`AdminUsers.php`):**
   - [ ] Endpoint para listar usuarios registrados (paginación y búsqueda).
   - [ ] Endpoint para suspender/dar de baja usuarios.

## Fase 3: Experiencia de Usuario e Interfaz (Frontend)
1. **Rutas e Infraestructura:**
   - [ ] Modificar `AuthContext.tsx` para exponer el rol del usuario y proteger la ruta `/admin`.
   - [ ] Crear el layout `AdminDashboardView.tsx` utilizando la paleta nocturna de United Way (`#001f3f`, `#001224`, `#f57921`, `#005191`).
2. **Sección: Monitor de Indicadores (Dashboard):**
   - [ ] Tarjetas de resumen (Widgets) visuales para los KPIs de la plataforma.
3. **Sección: Gestor de Causas:**
   - [ ] Tabla de causas institucionales con opciones de Editar y Eliminar.
   - [ ] Formulario (Modal) robusto para dar de alta/editar una causa oficial.
4. **Sección: Control de Usuarios y Movilizaciones:**
   - [ ] Tablas con filtros y búsqueda.
   - [ ] **UX Crítico:** Implementar diálogos de confirmación (doble verificación) antes de ejecutar cualquier acción de eliminación o suspensión, informando al administrador de las consecuencias.

## Fase 4: Pruebas y Auditoría
- [ ] Verificar que un usuario normal no pueda acceder a las rutas de frontend ni hacer peticiones a la API admin.
- [ ] Probar la eliminación lógica: confirmar que un evento eliminado no aparece en el listado público pero se mantiene en el historial de BD para reportes.

---

## Fase 5: Ajustes Avanzados de Data Governance y Reportes (Ajustes 12, 13 y 14)
*Objetivo: Mejorar la precisión de captura ciudadana, la veracidad matemática de las métricas y dotar al administrador de herramientas de exportación.*

### Ajuste #12: Campo Dinámico de Agrupación (Frontend)
- [ ] **Consolidación de Datos:** Crear la constante unificada de Corporativos extrayendo la data de `LearHQ.csv` y `Empresas.csv`.
- [ ] **Lógica Reactiva:** Modificar `DynamicRegistrationForm.tsx` para observar el campo Modalidad (`activityType`).
- [ ] **Renders Condicionales:** 
  - Renderizar `<select>` con Corporativos si modalidad == "Corporativa".
  - Ocultar/Limpiar el campo si modalidad == "Comunidad Abierta".
  - Mantener `<input type="text">` libre si modalidad == "Personal".
  - Renderizar `<select>` con catálogo institucional si modalidad == "Institucional".
- [ ] **Protección de Estado:** Añadir lógica para vaciar el campo (`setGroupName('')`) cada vez que se detecte un cambio de Modalidad.

### Ajuste #13: Reporteador y Exportación (Fullstack)
- [ ] **Backend (Endpoints):** 
  - Crear endpoint `GET /api/admin/reports/mobilizations?type=XYZ` para retornar datos de la tabla de reporteador.
  - Crear endpoint `GET /api/admin/activities/(:num)/export` para retornar la lista cruda de voluntarios de una causa institucional.
- [ ] **Frontend (Exportación Institucional):** Añadir botón "Descargar Lista CSV" en el modal existente dentro de `ActivityManager.tsx`.
- [ ] **Frontend (Módulo Reporteador):** Construir componente `MobilizationReports.tsx` con 3 pestañas (Corporativo, Personal, C. Abierta).
- [ ] **Integración Visual:** Insertar el `<MobilizationReports />` en `AdminDashboardView.tsx`, justo debajo de la zona de métricas generales.
- [ ] **Función de Descarga:** Implementar lógica para convertir la data de las tablas en formato `.csv` descargable desde el navegador.

### Ajuste #14: Corrección de Soft Delete en Métricas (Backend)
- [x] **Filtro Beneficiarios:** Modificar `Metrics.php` (aprox. línea 24) para agregar `->where('deleted_at', null)` en la suma de `beneficiaries_count`.
- [x] **Filtro Horas:** Modificar `Metrics.php` (aprox. línea 34) para inyectar `->where('deleted_at', null)` en la suma de `duration_hours`.
- [x] **Filtro Geográfico:** Modificar `Metrics.php` (aprox. línea 48) para proteger la consulta QueryBuilder cruda (`$db->table`) con `where('impact_registrations.deleted_at', null)`.
### Ajuste #15: Simplificación de Flujos y Afiliación Corporativa en Perfil (Fullstack)
- [x] **Mover Constante (Refactor):** Extraer el arreglo `CORPORATIVOS_CATALOG` de `DynamicRegistrationForm.tsx` a un archivo compartido (ej. `src/utils/constants.ts`) para que ambos componentes puedan consumirlo.
- [x] **Limpieza de Flujo B:** En `DynamicRegistrationForm.tsx`, eliminar la opción "Institucional" del `<select>` de modalidades, así como su bloque de código condicional.
- [x] **Mejora del Perfil:** En `ProfileForm.tsx`, reemplazar el input de texto libre de `organization_name` por un `<select>` alimentado del catálogo de corporativos.
- [x] **Checkbox "Otro":** Añadir un estado `isOtherOrganization` (boolean) y un `<input type="checkbox">` etiquetado como "Mi organización no está en la lista / Soy otro".
- [x] **Lógica de Captura:** Configurar `ProfileForm.tsx` para que, si el checkbox "Otro" está activo, renderice un `<input type="text">` libre y limpie la selección anterior. Si está desactivado, renderiza el `<select>`.
- [x] **Verificación de Registro:** Asegurar que si un usuario nuevo se registra, el backend procese correctamente el `organization_name` (ya sea corporativo o libre).

### Ajuste #16: Simplificación B2B de Formularios y Corección Matemática
- [x] **Limpieza de UI:** En `DynamicRegistrationForm.tsx`, eliminar los botones de bifurcación inicial (Flujo A "Causas de la organización" y Flujo B "Movilización ciudadana/empresa"). La vista debe entrar directamente al formulario universal.
- [x] **Eliminación de Cartelera:** Remover todo el bloque de UI de tarjetas visuales ("Explora nuestras causas") que el usuario marcó como innecesario.
- [x] **Select Universal:** Reintroducir "Institucional" en el combo de `activityType`.
- [x] **Lógica Condicional de Nombre:** Si `activityType === 'Institucional'`, renderizar un `<select>` que cargue el nombre de la actividad desde la base de datos de causas activas (y asigne `activityId`). Para cualquier otra opción, renderizar un `<input type="text">` libre (que asigne `customActivityName`).
- [x] **Corrección Matemática (Backend):** En `api/app/Controllers/Admin/Metrics.php`, modificar la consulta de `total_hours` para que sea un `selectSum('duration_hours * volunteer_count', 'total_hours')` en lugar de solo sumar la duración cruda, resolviendo el robo de impacto. Adicionalmente, `total_volunteers` ahora suma el `volunteer_count` de los registros.

### Ajuste #17: Exclusión de Institucionales en "Causas Registradas"
- [x] **Corrección Backend:** En `api/app/Controllers/Admin/Metrics.php`, modificar la consulta de `total_actions` para que cuente las filas de `impact_registrations` donde la modalidad no sea Institucional (`activity_type != 'Institucional'`), desvinculándolo del join antiguo con el catálogo que estaba arrastrando un número 8 por defecto.
