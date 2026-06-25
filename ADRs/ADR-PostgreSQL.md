# ADR: PostgreSQL como BD principal
## Decisión 
Se utilizará PostgreSQL como base de datos principal del sistema MOVE para almacenar la información del sistema.

## Justificación
El dominio de MOVE presenta una estructura de datos altamente relacional. Existen múltiples entidades con restricciones de consistencia que deben mantenerse durante toda la operación del sistema.

PostgreSQL proporciona garantías ACID, asegurando que estas operaciones mantengan la consistencia del negocio incluso ante fallas parciales.

Se considero usar una BD por servicio, pero se descarto porque es excesivo para los requerimientos actuales.

## Estado
Aceptado

## Consecuencias
### Positivas 
- Las propiedades ACID permiten recuperación ante errores, rollback automatico y evitar estados inconsistentes.

### Negativas
- Postgre se convierte en un "single point failure"

