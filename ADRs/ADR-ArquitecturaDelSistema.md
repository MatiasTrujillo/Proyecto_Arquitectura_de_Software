# ADR: Arquitectura basada en servicios
El requerimiento R7 exige que "el grupo funcional F2 a F6 y F21 y el grupo funcional F13 a F15 no se vean afectados por fallos en otras partes del sistema o en cualquiera de ellos". 

A su vez, debido al tamaño de nuestro equipo, debemos buscar una arquitectura lo más simple posible (que cumpla con los requerimientos).

## Decisión 
Nosotros haremos una arquitectura service-based. El sistema estará dividido en 3 servicios internos: servicio de gestión (que contendrá el primer grupo funcional), servicio de operación (que contendrá el segundo grupo funcional) y servicio de autenticación (que contendrá la conexión con el servicio externo de autenticación). Existirá una base de datos que tendrá la información de los servicios. Además, el sistema se integrará con servicios externos, como una pasarela de pago o un autenticador.

## Justificación
Se eligió esta arquitectura principalmente para cumplir el requerimiento R7 y por su simplicidad.

La SBA mejora la integrabilidad porque divide el sistema en servicios con interfaces bien definidas, lo que hace que otros sistemas puedan interactuar con funcionalidades específicas sin depender de detalles internos de implementación. Además, mejora la deployabilidad al permitir desplegar cada servicio de forma independiente, la modificabilida al tener dominios bien definidos y la disponibilidad de los servicios al tratarlos de forma independiente.

El mayor problema de esta arquitectura es que al tener una base de datos compartida, esta se convierte en un "single point failure".

Se evaluó usar una arquitectura monolítica modular, pero se descartó, ya que cumplir con el requerimiento R7 se hacía imposible.

También se evaluó usar una arquitectura de microservicios, pero se descartó debido a su alta complejidad.

## Estado
Aceptada

## Consecuencias
### Positivas
- Buena deployabilidad del sistema
- Buena modificabilidad del sistema
- Buena disponibilidad de los servicios

### Negativas
- Arquitectura más complicada que un monolito modular
- La base de datos se convierte en un "single point failure"
