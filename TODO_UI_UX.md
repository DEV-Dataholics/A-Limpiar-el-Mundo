# Mejoras Pendientes de Diseño UI / UX

*Anotaciones generadas por la auditoría de diseño - Septiembre 2026. Pospuestas para futuras iteraciones.*

## 1. Responsividad (Mobile-First)
- **Landing Page:** Aligerar los paddings laterales extremos en dispositivos móviles para aprovechar mejor el espacio de la pantalla.
- **Tablas de Datos:** Considerar implementar una vista basada en tarjetas (*cards*) para las tablas del Modal y el Admin Dashboard en resoluciones pequeñas (móviles), mitigando la necesidad de scroll horizontal excesivo.

## 2. Arquitectura de Componentes
- **Extracción de Componentes:** Extraer micro-componentes como `MetricCard` a sus propios archivos independientes dentro de `src/components/ui` para mayor reutilización.
- **Modernización del UI Kit:** Migrar los inputs y controles de formulario nativos a primitivas de diseño modernas (estilo `shadcn/ui` o `Radix UI`) para unificar y escalar la estética corporativa.

## 3. Accesibilidad (a11y)
- **Vínculo Label-Input:** Vincular semánticamente todos los elementos `<label>` con sus respectivos `<input>` o `<select>` utilizando los atributos `htmlFor` (en el label) y `id` (en el input). Esto mejorará significativamente la experiencia con lectores de pantalla y aumentará el área clickeable del formulario.
