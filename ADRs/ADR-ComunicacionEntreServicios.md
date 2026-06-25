# ADR: Comunicación entre servicios
La principal fuerza que influyo esta decisión fue el requerimiento R7, que propone que una caída en el servicio de gestión no afecte al servicio de operaciones y viceversa.

## Decisión
Los servicios de MOVE intercambiarán información mediante una base de datos compartida en lugar de realizar llamadas directas entre servicios. Cada servicio será responsable de escribir y consultar la información necesaria en las tablas. De esta forma, un servicio no dependerá de la disponibilidad en tiempo real de otro para continuar operando.

## Justificación
Los requerimientos establecen explícitamente que ciertas funcionalidades críticas deben mantenerse operativas aunque otras partes del sistema fallen. La utilización de una base de datos compartida permite que ambos servicios continuen trabajando aunque el otro este caido.

Esto reduce el acoplamiento entre servicios, se simplifiqua la arquitectura al evitar mecanismos complejos de comunicación entre servicios, y se facilita la consulta de información compartida.

Se descarto usar una comunicación síncrona mediante APIs REST ya que introudce dependencia directa entre servicios, por lo quen una caida en un servicio afecta al otro.

## Estado
Aceptado

## Consecuencias
### Positivas
- Favorece la disponibilidad al aislar fallas entre servicios.
- Favorece la modificabilidad al reducir el acoplamiento.
- Arquitectura más simple.

### Negativas
- Cambios en la estructura de la base de datos afecta a ambos servicios.
- La base de datos se convierte en un punto central cuya indisponibilidad afecta a ambos servicios.

