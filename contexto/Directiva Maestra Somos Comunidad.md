# **DIRECTIVA MAESTRA DE DESARROLLO: Micrositio "Somos Comunidad"**

**Propósito:** Este documento es la FUENTE ÚNICA DE VERDAD para el desarrollo desde cero del micrositio "Somos Comunidad" (Fondo Unido / United Way Chihuahua).

**Instrucción para Agentes de IA:** Lee este documento en su totalidad. No asumas stacks tecnológicos fuera de los listados aquí. No inventes flujos. Sigue la arquitectura dictada a rajatabla.

## **1\. CONTEXTO Y VISIÓN DEL PRODUCTO**

Se requiere construir un **Sistema Híbrido de Participación Cívica y Motor de Reservas** para voluntariado corporativo y ciudadano. No es una landing page estática; es un sistema reactivo y operativo.

**Métrica de Éxito:** Maximizar el registro de voluntarios y generar un "Muro de Impacto" visual con las evidencias fotográficas, mostrando contadores estadísticos en tiempo real.

## **2\. STACK TECNOLÓGICO Y HERRAMIENTAS (NO NEGOCIABLE)**

Cualquier intento de usar Python, Supabase, Next.js, Prisma o herramientas no-code será considerado un error crítico y el código será rechazado.

* **Backend & API:** PHP 8+ utilizando **CodeIgniter 4**.  
* **Base de Datos:** **MySQL** (Despliegue local inicial en Laragon).  
* **Frontend (SPA):** **React 18+**, empaquetado con **Vite**.  
* **Estilos y UI:** **Tailwind CSS v4** puro. Prohibido usar librerías de componentes pesadas (como Material UI o Bootstrap).

## **3\. LÓGICA DE NEGOCIO Y FLUJOS DEL SISTEMA**

El sistema debe manejar dinámicamente dos flujos desde un único punto de entrada (el componente DynamicRegistrationForm.tsx).

### **Flujo A: Voluntariado Institucional (Catálogo / Corporativo)**

Actividades predefinidas (ej. Vivero, Banco de Alimentos, Ludomóvil).

* **Reglas de RSVP:** Tienen cupo mínimo y máximo (min\_capacity, max\_capacity).  
* **Regla de Fechas:** El usuario debe elegir una fecha, pero el sistema DEBE bloquear en el calendario cualquier fecha que no tenga al menos **10 días de anticipación**.  
* **Mutación de UI:** Cuando se selecciona este flujo, se OCULTA el campo de subir foto de evidencia y se MUESTRA el selector de fecha y el input de "Cantidad de Voluntarios". Se debe consultar el endpoint de disponibilidad para validar aforos.  
* **Regla de Negocio (Backend):** Si el evento no cumple el cupo mínimo llegada la fecha, el backend debe tener la capacidad (ej. un endpoint para un Cron Job) de marcarlo como "Cancelado".

### **Flujo B: Movilización Propia (Ciudadana)**

Actividades libres (ej. limpiar la calle, recoger basura).

* **Reglas Abiertas:** No hay tope de aforos, ni reglas de fechas a futuro.  
* **Mutación de UI:** Se OCULTA el calendario y el contador de voluntarios. Se MUESTRA obligatoriamente un Dropzone/Input para subir una foto de evidencia y un área de texto para describir la acción.

### **Regla Crítica Transversal: Consentimiento Legal**

* El formulario debe incluir un *checkbox* para el Aviso de Privacidad y Uso de Imagen (especialmente de menores).  
* **UI/UX:** El botón de "Registrar Actividad" DEBE permanecer en estado disabled hasta que el checkbox esté en true. Esto es auditable legalmente, por lo que debe guardarse en la DB (legal\_consent \= true).

## **4\. DIRECTIVAS ESTRICTAS DE UI/UX Y ARQUITECTURA FRONTEND**

El agente software-developer debe implementar los siguientes patrones visuales y arquitectónicos:

### **4.1. Patrones de Diseño (Branding)**

* **Mobile-First Absoluto:** El diseño debe iniciar asumiendo una pantalla de 320px-375px.  
* **Dark Mode Premium:** Fondo oscuro corporativo.  
* **Glassmorphism:** Uso intensivo de clases utilitarias de Tailwind (backdrop-blur-md, bg-white/5, border, border-white/10) para tarjetas, modales y el Header.  
* **Acentos Corporativos:** Utilizar gradientes sutiles (emerald y amber) para llamadas a la acción (CTAs) y métricas.  
* **Identidad:** El Header global debe ser persistente e incluir el logo de United Way Chihuahua.

### **4.2. Componetización y Estado**

* **Atomic Design:** Separar lógica de presentación. Las vistas no deben exceder las 300 líneas.  
* **Custom Hooks:** Toda lógica de mutación de estados del formulario (Flujo A vs B) y llamadas fetch al backend de CodeIgniter DEBE vivir en Custom Hooks (ej. useRegistrationForm.ts).  
* **Feedback Inmediato (Sin recargas):** Usar validación en cliente (ej. Zod) antes de enviar el payload. Usar *Toast Notifications* nativas o simples para mensajes de éxito/error.

### **4.3. Entregables Clave del Frontend**

1. **DynamicRegistrationForm.tsx**: El formulario inteligente que alterna entre Flujo A y B.  
2. **ImpactFeedGrid.tsx**: El "Muro de Acciones". Un grid público para ver las fotos y descripciones de las "Movilizaciones Propias". DEBE implementar *Lazy Loading* para las imágenes y evitar saturar la memoria del navegador.  
3. **MetricsDashboardView.tsx**: Panel superior de estadísticas (Total Voluntarios, Eventos, Horas) consumiendo los datos en tiempo real de la base de datos vía API.

## **5\. PROPUESTA DE MODELO RELACIONAL (DDL BASE EN MYSQL)**

El agente debe estructurar la base de datos considerando al menos estas tablas (adaptadas para CodeIgniter 4 Model rules):

* **users**: id, name, email, phone, created\_at.  
* **activities\_catalog**: id, name (ej. 'Vivero', 'Propia'), min\_capacity, max\_capacity, is\_open\_mobilization (boolean), requires\_10\_days\_notice (boolean).  
* **impact\_registrations**: id, user\_id (FK), activity\_id (FK), scheduled\_date (para Flujo A), execution\_date (para Flujo B), volunteer\_count, description, evidence\_image\_url, legal\_consent\_accepted (boolean), status (pending, approved, cancelled).

## **6\. INSTRUCCIONES DE EJECUCIÓN PARA EL ORQUESTADOR**

1. **Fase 1 (Arquitectura):** Invoca a planning-architect para generar el boilerplate del frontend y la estructura de controladores/modelos en CodeIgniter 4 basado en la sección 5\.  
2. **Fase 2 (Maquetación UI):** Construye el Header, el MetricsDashboardView y el *layout* principal con Tailwind v4 respetando el estilo Dark/Glassmorphism.  
3. **Fase 3 (Lógica Reactiva):** Desarrolla el DynamicRegistrationForm.tsx implementando el cambio de estado estricto entre Flujo A y B.  
4. **Bitácora:** Todo cambio debe registrarse en HISTORIAL\_AJUSTES.md.