# ADR: Arquitectura de un módulo: en capas
Debido al tamaño reducido de nuestro equipo, resulta importante mantener una estructura clara y fácil de comprender entre los módulos y servicios.

Por otro lado, la arquitectura en capas es la más conocida por los integrantes del equipo.

Además, los requisitos de calidad exigen desacoplamiento y facilidad para realizar pruebas.

## Decisión 
Nosotros haremos una arquitectura en capas dentro de cada módulo del monolito y dentro de cada microservicio.

La estructura base estará compuesta por las siguientes capas:
- Dominio: tendrá las entidades y value objects.
- Data Access: tendrá los repositorios.
- Servicios: tendrá los casos de uso.
- WebApi: expondrá endpoints HTTP.

## Justificación
Se decidió utilizar una arquitectura en capas porque:
- Permite separar claramente responsabilidades.
- Facilita la comprensión del sistema.
- Mejora la mantenibilidad, ya que cada cambio queda aislado por responsabilidad.
- Favorece la testeabilidad, porqu se pueden mockear las capas.

## Estado
Aceptado.

## Consecuencias
Consecuencias positivas:
- El sistema tendrá una estructura uniforme
- Será más fácil realizar testing unitario y de integración.
- Mejora la mantenibilidad del sistema a largo plazo.

Consecuencias negativas:
- Algunas operaciones simples requerirán atravesar múltiples capas.
- Se deberá mantener disciplina arquitectónica para evitar violaciones de dependencias entre capas.
