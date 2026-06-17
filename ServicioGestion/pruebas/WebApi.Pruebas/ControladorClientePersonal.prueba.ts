import assert from "assert";
import { ControladorClientePersonal } from "../../src/ModuloUsuarios/WebApi/Controlador/ControladorClientePersonal";
import { ClientePersonalDTO } from "../../src/ModuloUsuarios/DTOs/ClientePersonalDTO";
import { ReservaDTO } from "../../src/ModuloReservas/DTOs/ReservaDTO";
import { PagoDTO } from "../../src/ModuloPagos/DTOs/PagoDTO";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioClientePersonalFalso {
  private data: ClientePersonalDTO[] = [];
  private next = 1;

  crearClientePersonal(cedula: string, nombre: string): ClientePersonalDTO {
    const cliente = new ClientePersonalDTO(`${this.next++}`, cedula, nombre);
    this.data.push(cliente);
    return cliente;
  }

  obtenerClientePersonales(): ClientePersonalDTO[] {
    return this.data;
  }

  obtenerClientePersonalPorId(id: string): ClientePersonalDTO {
    const cliente = this.data.find((item) => item.id === id);
    if (!cliente) throw new Error("Cliente personal no encontrado");
    return cliente;
  }

  actualizarClientePersonal(id: string, cedula: string, nombre: string): ClientePersonalDTO {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Cliente personal no encontrado");
    const actualizado = new ClientePersonalDTO(id, cedula, nombre);
    this.data[index] = actualizado;
    return actualizado;
  }

  eliminarClientePersonal(id: string): void {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Cliente personal no encontrado");
    this.data.splice(index, 1);
  }
}

class ServicioReservaFalso {
  private data: ReservaDTO[] = [];
  private next = 1;

  crearReserva(
    clienteId: string, origen: string, destino: string, fecha: string | Date,
    costo: number, vehiculo: string, productos: string[], conductor: string, categorias: string[]
  ): ReservaDTO {
    const reserva = new ReservaDTO(`${this.next++}`, clienteId, origen, destino, new Date(), "Pendiente", costo, vehiculo, productos, conductor, categorias);
    this.data.push(reserva);
    return reserva;
  }

  obtenerReservasPorCliente(clienteId: string): ReservaDTO[] {
    return this.data.filter(r => r.cliente === clienteId);
  }

  consultarEstadoReserva(reservaId: string): string {
    const reserva = this.data.find(r => r.id === reservaId);
    if (!reserva) throw new Error(`No se encontró la reserva con id ${reservaId}`);
    return reserva.estado;
  }
}

class ServicioPagoFalso {
  crearPago(fecha: string | Date, monto: number, estado: string): PagoDTO {
    return new PagoDTO(1, new Date(), monto, estado);
  }
  obtenerPagos(): PagoDTO[] { return []; }
  obtenerPagoPorId(id: number): PagoDTO { return new PagoDTO(id, new Date(), 0, "Pendiente"); }
  actualizarPago(id: number, fecha: string | Date, monto: number, estado: string): PagoDTO { return new PagoDTO(id, new Date(), monto, estado); }
  eliminarPago(_id: number): void {}
}

function crearControlador(servicioPersonal = new ServicioClientePersonalFalso()) {
  return new ControladorClientePersonal(
    servicioPersonal as any,
    new ServicioReservaFalso() as any,
    new ServicioPagoFalso() as any
  );
}

async function crearClientePersonalPrueba() {
  const controlador = crearControlador();
  const req = crearRequestMock({}, { cedula: "789", nombre: "Marta" });
  const res = crearResponseMock();

  await controlador.crearClientePersonal(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.nombre, "Marta");
}

async function obtenerClientePersonalPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  servicio.crearClientePersonal("444", "Luis");
  const controlador = crearControlador(servicio);
  const req = crearRequestMock();
  const res = crearResponseMock();

  await controlador.obtenerClientePersonal(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data[0].cedula, "444");
}

async function obtenerClientePersonalPorIdPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  const cliente = servicio.crearClientePersonal("555", "Nora");
  const controlador = crearControlador(servicio);
  const req = crearRequestMock({ id: cliente.id }, {});
  const res = crearResponseMock();

  await controlador.obtenerClientePersonalPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.cedula, "555");
}

async function actualizarClientePersonalPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  const cliente = servicio.crearClientePersonal("666", "Old");
  const controlador = crearControlador(servicio);
  const req = crearRequestMock({ id: cliente.id }, { cedula: "666", nombre: "New" });
  const res = crearResponseMock();

  await controlador.actualizarClientePersonal(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "New");
}

async function eliminarClientePersonalPrueba() {
  const servicio = new ServicioClientePersonalFalso();
  const cliente = servicio.crearClientePersonal("777", "X");
  const controlador = crearControlador(servicio);
  const req = crearRequestMock({ id: cliente.id }, {});
  const res = crearResponseMock();

  await controlador.eliminarClientePersonal(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

async function realizarReservaPrueba() {
  const controlador = crearControlador();
  const req = crearRequestMock({}, {
    clienteId: "personal1",
    origen: "Zona Norte",
    destino: "Zona Sur",
    fecha: "2024-06-01",
    costo: 150,
    vehiculo: "vehiculo1",
    productos: [],
    conductor: "conductor1",
    categorias: [],
  });
  const res = crearResponseMock();

  await controlador.realizarReserva(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.cliente, "personal1");
  assert.strictEqual(res.body.data.estado, "Pendiente");
}

async function obtenerReservasPrueba() {
  const servicioReserva = new ServicioReservaFalso();
  servicioReserva.crearReserva("personal1", "O", "D", new Date(), 100, "v1", [], "c1", []);
  servicioReserva.crearReserva("personal1", "O", "D", new Date(), 200, "v2", [], "c2", []);
  const controlador = new ControladorClientePersonal(
    new ServicioClientePersonalFalso() as any,
    servicioReserva as any,
    new ServicioPagoFalso() as any
  );
  const req = crearRequestMock({ clienteId: "personal1" }, {});
  const res = crearResponseMock();

  await controlador.obtenerReservas(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.length, 2);
}

async function consultarEstadoReservaPrueba() {
  const servicioReserva = new ServicioReservaFalso();
  const reserva = servicioReserva.crearReserva("personal1", "O", "D", new Date(), 100, "v1", [], "c1", []);
  const controlador = new ControladorClientePersonal(
    new ServicioClientePersonalFalso() as any,
    servicioReserva as any,
    new ServicioPagoFalso() as any
  );
  const req = crearRequestMock({ reservaId: reserva.id }, {});
  const res = crearResponseMock();

  await controlador.consultarEstadoReserva(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.estado, "Pendiente");
}

async function realizarPagoPrueba() {
  const controlador = crearControlador();
  const req = crearRequestMock({}, { monto: 300, fecha: "2024-06-01" });
  const res = crearResponseMock();

  await controlador.realizarPago(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.monto, 300);
  assert.strictEqual(res.body.data.estado, "Pendiente");
}

const pruebas = [
  ["Crear cliente personal", crearClientePersonalPrueba],
  ["Obtener clientes personales", obtenerClientePersonalPrueba],
  ["Obtener cliente personal por id", obtenerClientePersonalPorIdPrueba],
  ["Actualizar cliente personal", actualizarClientePersonalPrueba],
  ["Eliminar cliente personal", eliminarClientePersonalPrueba],
  ["Realizar reserva", realizarReservaPrueba],
  ["Obtener reservas del cliente personal", obtenerReservasPrueba],
  ["Consultar estado de reserva", consultarEstadoReservaPrueba],
  ["Realizar pago", realizarPagoPrueba],
] as const;

async function ejecutarPruebas() {
  for (const [nombre, prueba] of pruebas) {
    try {
      await prueba();
      console.log(`✅ ${nombre}`);
    } catch (error) {
      console.error(`❌ ${nombre}`);
      console.error(error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  void ejecutarPruebas();
}
