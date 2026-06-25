# ADR: Agrupación de responsabilidades dentro de los módulos de negocio
Es necesario definir cómo distribuir las funcionalidades y la información del dominio en módulos con alta cohesión y bajo acoplamiento.

## Decisión
Nosotros agruparemos las funcionalidades del sistema en los siguientes módulos:

### Servicio de Gestión
- Usuario
- Reserva
- Catálogo
- Pago

### Servicio de Operaciones
- Vehículo

### Servicio de Autenticacion
- Autenticacion

## Justificación

### Módulo Usuario

**Responsabilidades:**
- Gestión de usuarios.
- Gestión de roles.
- Consulta de información de clientes, conductores, operadores y administradores.
- Asignación de conductor y vehículo.

**Justificación**
Todas estas funcionalidades giran alrededor de la identidad de los actores humanos que interactúan con el sistema.

**Alternativa descartada**
Separar clientes y conductores en módulos distintos. Se descartó porque ambos son variaciones de un mismo concepto de negocio: usuario del sistema.

### Módulo Reserva

**Responsabilidades:**
- Gestión de reservas.
- Gestión de viajes.
- Gestión de incidentes.

**Justificación**
Reserva, viaje e incidencia forman parte del mismo ciclo de vida de negocio. Una reserva evoluciona hasta convertirse en un viaje, y durante dicho viaje se pueden registrar incidentes. Todas estas entidades comparten contexto, reglas y estados.

**Alternativa descartada**
Crear módulos independientes para Reserva, Viaje e Incidencia. Se descartó para evitar sobreingeniería.

### Módulo Catálogo

**Responsabilidades:**
- Gestión de categorías.
- Gestión de productos.
- Gestión de zonas geográficas.
- Gestion de reglas

**Justificación**
Estos elementos representan información de referencia utilizada por otros módulos.

Las categorías, productos y zonas no forman parte directamente de la ejecución de un traslado, sino que proveen información necesaria para realizar validaciones y configuraciones.

Todos estos elementos poseen una baja frecuencia de modificación y son administrados mediante funcionalidades de configuración.

**Alternativa descartada**
Crear módulos separados para Categorías, Productos, Zonas y Reglas. Se descartó porque introduciría fragmentación innecesaria sobre entidades con responsabilidades similares.

### Módulo Pago

**Responsabilidades:**
- Registro de pagos.
- Integración con pasarelas externas.
- Gestión del estado de pagos.

**Justificación**
Este modulo junta toda la logica sobre pagos.

### Módulo Vehículo

**Responsabilidades:**
- Gestión de vehículos.
- Gestión de dispositivos GPS.

**Justificación**
Estas funcionalidades están relacionadas con la ejecución física del traslado.

### Modulo de Autenticacion
**Responsabilidades:**
- Integración con el proveedor externo de autenticación.

**Justificación**
Este modulo junta toda la logica sobre autenticación.

## Estado
Aceptado.

## Consecuencias

### Positivas
- Alta cohesión dentro de cada módulo.
- Menor acoplamiento.
- Mejor mantenibilidad.
- Facilita la asignación de trabajo entre integrantes del equipo.

### Negativas
- Algunas entidades son utilizadas por varios módulos (por ejemplo, categorías y zonas).
- Es necesario definir interfaces claras entre módulos para evitar dependencias indebidas.
- Algunas funcionalidades pueden requerir coordinación entre varios módulos.