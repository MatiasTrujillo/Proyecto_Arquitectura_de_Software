# ADR: Uso de un servicio de autenticación externo

El sistema MOVE requiere gestionar identidades de múltiples tipos de usuarios (administrador, operador, conductor, cliente personal, cliente empresa), cada uno con credenciales, roles y sesiones seguras. Implementar este mecanismo desde cero implicaría diseñar y mantener almacenamiento seguro de contraseñas, emisión y revocación de tokens, políticas de expiración de sesión y protección contra ataques comunes. El equipo de desarrollo es reducido y el tiempo disponible es acotado, por lo que invertir esfuerzo en infraestructura de seguridad propia representa un riesgo tanto técnico como temporal.

## Decisión

Nosotros delegaremos la autenticación de usuarios a Auth0, un proveedor de identidad externo (IdP), accedido a través de su API REST desde un servicio dedicado (ServicioAutenticacion). Los demás servicios del sistema verificarán la identidad del usuario mediante JWT firmados con un secreto compartido, sin depender de Auth0 en cada request.

## Justificación

Auth0 resuelve de forma probada y auditada los problemas de seguridad asociados al manejo de credenciales: hashing de contraseñas, protección ante ataques de fuerza bruta, rotación de secretos y gestión de tokens. Desarrollar una solución equivalente desde cero requeriría un esfuerzo considerable y aumentaría la superficie de ataque del sistema.

Se evaluaron las siguientes alternativas:

- **Implementación propia con bcrypt + JWT**: ofrece control total pero exige diseñar y mantener toda la lógica de seguridad, aumentando el riesgo de vulnerabilidades y el tiempo de desarrollo.
- **Passport.js con estrategia local**: simplifica la integración en Node.js pero sigue requiriendo que el equipo gestione el almacenamiento seguro de contraseñas y la emisión de tokens.
- **Auth0 (elegida)**: solución gestionada con plan gratuito suficiente para el volumen del proyecto, SDK bien documentado, soporte para múltiples roles y gestión de usuarios por API. Reduce el tiempo de implementación y transfiere la responsabilidad de seguridad a un proveedor especializado.

La arquitectura adoptada mantiene a Auth0 como fuente de verdad para credenciales, mientras que los roles y datos de negocio de cada usuario se almacenan en la base de datos propia de ServicioGestion. La verificación de JWT se realiza localmente en cada servicio con el secreto compartido (`JWT_SECRET`), evitando latencia adicional por llamadas a Auth0 en cada request.

## Estado

Aceptado

## Consecuencias

**Positivas:**
- Se elimina la necesidad de implementar y auditar la seguridad del almacenamiento de contraseñas.
- La gestión de sesiones, expiración de tokens y protección ante ataques es responsabilidad de Auth0.
- El tiempo de desarrollo se reduce significativamente al no tener que construir infraestructura de autenticación.
- El plan gratuito de Auth0 cubre el volumen de usuarios del proyecto sin costo adicional.

**Negativas:**
- El sistema depende de la disponibilidad de Auth0; si el servicio externo cae, el registro e inicio de sesión de nuevos usuarios no es posible.
- La creación de usuarios internos (conductor, operador, administrador) requiere llamadas HTTP síncronas entre ServicioGestion y ServicioAutenticacion, introduciendo acoplamiento entre servicios.
- Las credenciales de Auth0 (client ID, client secret, domain) deben gestionarse con cuidado y no exponerse en repositorios públicos.
- En un entorno de producción real, el plan gratuito de Auth0 tiene límites de usuarios activos mensuales que podrían requerir migración a un plan pago.
