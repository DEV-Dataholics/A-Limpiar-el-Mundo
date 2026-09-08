# Especificaciones Técnicas - Somos Comunidad

Este documento detalla la infraestructura técnica y las configuraciones de software que sostienen la plataforma "Somos Comunidad".

## 1. Stack Tecnológico
*   **Frontend:** React 18+ (TypeScript) construido con **Vite**.
*   **Backend:** API RESTful en **CodeIgniter 4.4+** (PHP 8.3).
*   **Estilos:** Tailwind CSS con diseño responsivo móvil-primero.
*   **Base de Datos:** MySQL (MariaDB) con codificación `utf8mb4_unicode_ci`.
*   **Servidor:** Hosting compartido Site5 con Apache 2.4.

## 2. Infraestructura de Producción
*   **URL Base:** `https://somoscomunidad.dataholics.com.mx`
*   **Ruta Física (Web Root):** Directorio público donde se aloja el `index.html` compilado.
*   **Ruta API:** Localizada en el subdirectorio `/api`, configurada para ser accedida mediante el `.htaccess` de raíz.

## 3. Configuraciones Críticas
### Enrutamiento (.htaccess)
El archivo `.htaccess` en la raíz realiza tres funciones críticas:
1.  **Forzado de HTTPS:** Redirige todo el tráfico a SSL.
2.  **Ruta API:** Redirige cualquier petición a `/api/*` hacia `api/public/index.php`.
3.  **SPA Fallback:** Redirige rutas inexistentes (rutas de React como `/dashboard` o `/login`) al `index.html` para que el React Router tome el control.
4.  **Encoding:** Forzado de `AddDefaultCharset UTF-8` para prevenir errores de caracteres especiales.

### Variables de Entorno (.env)
*   **Frontend:** Compilado con `VITE_API_URL` apuntando al dominio de producción.
*   **Backend (`api/.env`):** Configurado con credenciales de Site5 y `CI_ENVIRONMENT = production`.

## 4. Parches de Compatibilidad (Site5)
*   **Shim de Locale:** Debido a la ausencia de la extensión `php-intl` en algunos entornos de Site5, se inyectó una clase `Locale` estática en el controlador frontal (`index.php`) del API para evitar fallos críticos en el framework CodeIgniter.
*   **JWT Authentication:** Autenticación segura mediante tokens JWT (HS256) gestionados por la librería `firebase/php-jwt`.

## 5. Mantenimiento y Despliegue
*   **Build:** El despliegue requiere ejecutar `npm run build` localmente y subir el **contenido** de la carpeta `dist/` a la raíz.
*   **Permisos:** Los archivos en el servidor deben mantener permisos `0644` y las carpetas `0755` para garantizar la ejecución correcta de los scripts PHP-CGI.

---
*Documentación técnica generada y verificada el 03 de mayo de 2026.*
