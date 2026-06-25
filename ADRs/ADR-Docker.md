# ADR: Uso de Docker
El requisito explicito de usar Docker fue la principal fuerza que influyo esta deisicion. 

## Decisión 
Se utilizará Docker como mecanismo estándar de empaquetado y ejecución de todos los componentes de la plataforma MOVE. Cada servicio de la solución será desplegado dentro de contenedores independientes.

## Justificación
La plataforma MOVE posee el requisito explícito de desplegarse utilizando contenedores y garantizar portabilidad entre plataformas (R9).

Docker permite el aislamiento de componentes. Esto evita conflictos de versiones, dependencias y configuración.

Docker permite replicar instancias de servicios, lo que ayuda a cumplir requisitos de alta demanda como R8.

## Estado
Aceptado 

## Consecuencias
### Positivas
- Mejora la deployabilidad al permitir automatrizacion de despliegues y entornos reproducibles.
- Mejora la disponibilidad al permitir el reinicio indepenidente de servicios ante fallas.
