# ADR: Uso de una pasarela de pagos externa (Stripe)

El sistema MOVE necesita procesar pagos de reservas. Implementarlo desde cero requeriría gestionar comunicación con redes de tarjetas y manejar distintos estados de transacción, lo cual excede el alcance y el tiempo disponible del proyecto.

## Decisión

Nosotros delegaremos el procesamiento de pagos a Stripe, integrado desde ServicioGestion mediante su SDK oficial. Durante el desarrollo se utilizará el modo de pruebas de Stripe, que permite simular pagos sin dinero real.

## Justificación

Stripe abstrae la complejidad del procesamiento de pagos. Se evaluaron otras opciones:

- **Implementación propia**: inviable por los requisitos de certificación y la complejidad de integración con redes de tarjetas.
- **MercadoPago**: buena cobertura regional pero SDK menos maduro en Node.js.
- **Stripe (elegida)**: SDK oficial bien documentado para Node.js, modo test con métodos predefinidos para simular pagos aceptados, rechazados y pendientes, y fácil integración. La clase `PasarelaStripe` encapsula las llamadas al SDK, permitiendo cambiar de proveedor sin afectar la lógica de negocio.

## Estado

Aceptado

## Consecuencias

**Positivas:**
- El modo test permite desarrollar y demostrar el flujo completo de pagos sin dinero real.
- La encapsulación en `PasarelaStripe` facilita reemplazar el proveedor en el futuro.

**Negativas:**
- El sistema depende de la disponibilidad de Stripe para procesar pagos.
- En producción, Stripe cobra comisión por transacción.
- La clave secreta (`STRIPE_SECRET_KEY`) debe protegerse y no exponerse en repositorios públicos.
