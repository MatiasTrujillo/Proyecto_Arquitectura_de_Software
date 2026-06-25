# ADR: Módulo Shared
Se toma esta decisión debido a la necesidad de tener un módulo con información compartida y reutilizable, además de reducir el acoplamiento entra los modulos de un servicio.

## Decisión

Se creará un módulo Shared que contendrá componentes reutilizables y transversales utilizados por múltiples módulos del sistema.

Este módulo incluirá, entre otros:

- Utilidades de acceso a base de datos.
- Servicios de logging.
- Servicios de métricas y observabilidad.

Los módulos funcionales podrán depender del módulo Shared, pero Shared no dependerá de ningún módulo funcional.

## Justificación
Durante la identificación de los módulos del sistema se observó que existen múltiples elementos que son utilizados por más de un módulo y que no pertenecen naturalmente a un único dominio. Por ejemplo, las métricas requeridas por R4 deben registrarse desde distintos módulos del sistema, y el acceso a la base de datos requiere mecanismos comunes de conexión y configuración.

La incorporación de un módulo Shared permite centralizar estas responsabilidades evitando duplicación de código y promoviendo reutilización.

Esta decisión mejora la modificabilidad del sistema, ya que la centralización de funcionalidades permite realizar cambios en un único lugar y se reduce el acoplamiento entre los módulos de un servicio.

## Estado
Aceptado.

## Consecuencias

### Positivas
- Menor duplicación de código.
- Mayor reutilización.
- Consistencia en logging, métricas y acceso a datos.
- Facilita el cumplimiento del requisito R4.

### Negativas
- Introduce dependencia de todos los módulos funcionales hacia Shared.
- Existe riesgo de convertir Shared en un módulo excesivamente grande si no se controla qué responsabilidades pueden incorporarse.
- Los cambios incompatibles en elementos compartidos pueden impactar simultáneamente a varios módulos consumidores.
