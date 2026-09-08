# Reporte de Despliegue y Resolución de Problemas (Site5)

## 1. Contexto del Problema
Durante el despliegue a producción en el servidor compartido de Site5 (`somoscomunidad.dataholics.com.mx`), el frontend (React) cargaba correctamente, pero el backend (API CodeIgniter 4) devolvía consistentemente errores **HTTP 500 (Internal Server Error)**, impidiendo el funcionamiento total de la plataforma.

## 2. Diagnóstico y Errores Encontrados

Se identificó una cadena de errores a nivel de configuración, entorno y permisos de servidor:

1. **Credenciales de Entorno Incorrectas:** El archivo `.env` del API en producción contenía credenciales de desarrollo local (`root`, sin contraseña) en lugar de las credenciales de Site5.
2. **Limitaciones del Entorno PHP (Extensión `intl`):** El entorno PHP-CGI de Site5 no cargaba la extensión `intl` en el subdirectorio `/api`. Esto provocaba un error fatal interno en CodeIgniter 4 al intentar instanciar la clase `Locale` requerida por `TimeTrait` para el manejo de cabeceras HTTP.
3. **Problema de Permisos de Archivos (FTP):** Al extraer el proyecto en cPanel/FTP, los directorios críticos como `vendor/` y `app/` se extrajeron con permisos restrictivos (directorios en `644` y archivos en `600`). Apache/PHP no podía leer los archivos base del framework, lanzando un error silencioso de "Permission denied".
4. **Conflicto de Enrutamiento (Doble `/api/` en Backend):** El archivo `.htaccess` raíz redirigía las peticiones hacia `api/public/index.php`, pero eliminaba el prefijo `/api/`. CodeIgniter esperaba rutas envueltas en un `group('api')`, lo que provocaba errores 404 internos.
5. **Bug de URL en Frontend:** El código de React concatenaba manualmente `/api/...` a la variable `VITE_API_URL`. Al tener `VITE_API_URL=https://somoscomunidad.dataholics.com.mx/api`, resultaba en peticiones a `/api/api/auth/login`.

## 3. Soluciones Implementadas

### A. Configuración y Base de Datos
* Se configuró el archivo `api/.env` con las credenciales de producción (`noodluis_DEV_SC` y `noodluis_somoscomunidad`) y se cambió `CI_ENVIRONMENT` a `production`.
* Se ejecutó un script forzado para establecer de manera segura la contraseña del administrador en la base de datos a `Admin1234!`.

### B. Shim para la Extensión `intl`
* Se inyectó un *shim* (clase de compatibilidad) directamente en `api/public/index.php`. Este código detecta si la extensión `intl` está ausente y declara una clase `Locale` ficticia con métodos estáticos básicos que evitan que el framework CodeIgniter colapse durante su inicialización.

### C. Corrección Masiva de Permisos
* Se desarrollaron y ejecutaron scripts PHP temporales (`fix_all_permissions.php`) para iterar recursivamente sobre todo el árbol de directorios de `/api`. Se restablecieron permisos estandarizados: **755 para directorios** (permitiendo ejecución/travesía) y **644 para archivos** (permitiendo lectura).

### D. Reestructuración del Enrutamiento
* **Backend:** Se eliminó el envoltorio `$routes->group('api')` en `api/app/Config/Routes.php`, aplanando las rutas.
* **Backend `.htaccess`:** Se ajustó el `.htaccess` raíz para que pase la ruta de forma limpia (ej. `/activities` en lugar de `/api/activities`) y coincida con el backend.
* **Frontend:** Se modificó `VITE_API_URL` en `.env.production` a `https://somoscomunidad.dataholics.com.mx` (sin el sufijo `/api`), y se recompiló (`npm run build`) el proyecto React.

### E. Refuerzo de Seguridad: JWT real y eliminación de fallback
* Se implementó autenticación basada en JWT real (HS256, expiración 24h) usando la librería `firebase/php-jwt`. El backend ahora firma y valida tokens con un secreto definido en la variable de entorno `JWT_SECRET`, eliminando la vulnerabilidad de tokens falsificables por base64.
* Se eliminó el fallback inseguro `'tu_secreto_super_seguro'` en el filtro de autenticación de administrador (`AdminAuthFilter.php`). Ahora el sistema aborta si `JWT_SECRET` no está configurado, evitando el uso de secretos expuestos en el repositorio.

## 4. Resolución Final: Sincronización de Assets y Pantalla en Blanco (03-Mayo-2026)

Tras la subida manual de la carpeta `dist`, se presentó un error de "Pantalla en Blanco" debido a una desconexión entre el archivo `index.html` y los recursos de JavaScript compilados:

*   **Problema de Ubicación:** Se identificó que la subida manual colocó los archivos en una subcarpeta `/dist/` en lugar de la raíz, o subió la carpeta completa rompiendo las rutas relativas.
*   **Mismatch de Hash:** El servidor servía un `index.html` viejo que buscaba el archivo `index-BEkexzq4.js`, el cual ya no existía o apuntaba a `localhost`.
*   **Solución:** 
    1. Se realizó una limpieza total de la carpeta `/assets` en el servidor.
    2. Se cargó el nuevo bundle generado (`index-BNNI9rnj.js`) con la configuración de `VITE_API_URL` apuntando correctamente al dominio de producción.
    3. Se actualizó el `index.html` en la raíz para apuntar al nuevo hash de assets.
    4. Se forzó la codificación UTF-8 en el `.htaccess` para corregir problemas de visualización de acentos.

## 5. Estado Actual del Sistema
El sistema se encuentra **100% operativo** en `https://somoscomunidad.dataholics.com.mx`. Las métricas en tiempo real se cargan correctamente desde la base de datos de producción y los estilos visuales (Tailwind CSS) se renderizan sin errores.
