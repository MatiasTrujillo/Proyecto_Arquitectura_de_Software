import assert from "assert";
import { ControladorClienteEmpresa } from "../../src/ModuloUsuarios/WebApi/Controlador/ControladorClienteEmpresa";
import { ClienteEmpresaDTO } from "../../src/ModuloUsuarios/DTOs/ClienteEmpresaDTO";
import { ReservaDTO } from "../../src/ModuloReservas/DTOs/ReservaDTO";
import { PagoDTO } from "../../src/ModuloPagos/DTOs/PagoDTO";
import { crearRequestMock, crearResponseMock } from "./MockExpress";

class ServicioClienteEmpresaFalso {
  private data: ClienteEmpresaDTO[] = [];
  private next = 1;

  crearClienteEmpresa(cedula: string, nombre: string): ClienteEmpresaDTO {
    const cliente = new ClienteEmpresaDTO(`${this.next++}`, cedula, nombre);
    this.data.push(cliente);
    return cliente;
  }

  obtenerClienteEmpresas(): ClienteEmpresaDTO[] {
    return this.data;
  }

  obtenerClienteEmpresaPorId(id: string): ClienteEmpresaDTO {
    const cliente = this.data.find((item) => item.id === id);
    if (!cliente) throw new Error("Cliente empresa no encontrado");
    return cliente;
  }

  actualizarClienteEmpresa(id: string, cedula: string, nombre: string): ClienteEmpresaDTO {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Cliente empresa no encontrado");
    const actualizado = new ClienteEmpresaDTO(id, cedula, nombre);
    this.data[index] = actualizado;
    return actualizado;
  }

  eliminarClienteEmpresa(id: string): void {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Cliente empresa no encontrado");
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
    return new PagoDTO(1, new Date(), monto, estado, "");
  }
  obtenerPagos(): PagoDTO[] { return []; }
  obtenerPagoPorId(id: number): PagoDTO { return new PagoDTO(id, new Date(), 0, "Pendiente", ""); }
  actualizarPago(id: number, fecha: string | Date, monto: number, estado: string): PagoDTO { return new PagoDTO(id, new Date(), monto, estado, ""); }
  eliminarPago(_id: number): void {}
}

function crearControlador(servicioEmpresa = new ServicioClienteEmpresaFalso()) {
  return new ControladorClienteEmpresa(
    servicioEmpresa as any,
    new ServicioReservaFalso() as any,
    new ServicioPagoFalso() as any
  );
}

async function crearClienteEmpresaPrueba() {
  const controlador = crearControlador();
  const req = crearRequestMock({}, { cedula: "123", nombre: "Empresa S.A." });
  const res = crearResponseMock();

  await controlador.crearClienteEmpresa(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.nombre, "Empresa S.A.");
}

async function obtenerClienteEmpresaPrueba() {
  const servicio = new ServicioClienteEmpresaFalso();
  servicio.crearClienteEmpresa("111", "Empresa X");
  const controlador = crearControlador(servicio);
  const req = crearRequestMock();
  const res = crearResponseMock();

  await controlador.obtenerClienteEmpresa(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data[0].cedula, "111");
}

async function obtenerClienteEmpresaPorIdPrueba() {
  const servicio = new ServicioClienteEmpresaFalso();
  const cliente = servicio.crearClienteEmpresa("222", "Empresa Y");
  const controlador = crearControlador(servicio);
  const req = crearRequestMock({ id: cliente.id }, {});
  const res = crearResponseMock();

  await controlador.obtenerClienteEmpresaPorId(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.cedula, "222");
}

async function actualizarClienteEmpresaPrueba() {
  const servicio = new ServicioClienteEmpresaFalso();
  const cliente = servicio.crearClienteEmpresa("333", "Old");
  const controlador = crearControlador(servicio);
  const req = crearRequestMock({ id: cliente.id }, { cedula: "333", nombre: "New" });
  const res = crearResponseMock();

  await controlador.actualizarClienteEmpresa(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.nombre, "New");
}

async function eliminarClienteEmpresaPrueba() {
  const servicio = new ServicioClienteEmpresaFalso();
  const cliente = servicio.crearClienteEmpresa("444", "X");
  const controlador = crearControlador(servicio);
  const req = crearRequestMock({ id: cliente.id }, {});
  const res = crearResponseMock();

  await controlador.eliminarClienteEmpresa(req as any, res as any);

  assert.strictEqual(res.statusCode, 204);
}

async function realizarReservaPrueba() {
  const controlador = crearControlador();
  const req = crearRequestMock({}, {
    clienteId: "cliente1",
    origen: "Zona Norte",
    destino: "Zona Sur",
    fecha: "2024-06-01",
    costo: 200,
    vehiculo: "vehiculo1",
    productos: [],
    conductor: "conductor1",
    categorias: [],
  });
  const res = crearResponseMock();

  await controlador.realizarReserva(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.cliente, "cliente1");
  assert.strictEqual(res.body.data.estado, "Pendiente");
}

async function obtenerReservasPrueba() {
  const servicioReserva = new ServicioReservaFalso();
  servicioReserva.crearReserva("empresa1", "O", "D", new Date(), 100, "v1", [], "c1", []);
  servicioReserva.crearReserva("empresa1", "O", "D", new Date(), 200, "v2", [], "c2", []);
  const controlador = new ControladorClienteEmpresa(
    new ServicioClienteEmpresaFalso() as any,
    servicioReserva as any,
    new ServicioPagoFalso() as any
  );
  const req = crearRequestMock({ clienteId: "empresa1" }, {});
  const res = crearResponseMock();

  await controlador.obtenerReservas(req as any, res as any);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.length, 2);
}

async function consultarEstadoReservaPrueba() {
  const servicioReserva = new ServicioReservaFalso();
  const reserva = servicioReserva.crearReserva("empresa1", "O", "D", new Date(), 100, "v1", [], "c1", []);
  const controlador = new ControladorClienteEmpresa(
    new ServicioClienteEmpresaFalso() as any,
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
  const req = crearRequestMock({}, { monto: 500, fecha: "2024-06-01" });
  const res = crearResponseMock();

  await controlador.realizarPago(req as any, res as any);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.monto, 500);
  assert.strictEqual(res.body.data.estado, "Pendiente");
}

const pruebas = [
  ["Crear cliente empresa", crearClienteEmpresaPrueba],
  ["Obtener clientes empresa", obtenerClienteEmpresaPrueba],
  ["Obtener cliente empresa por id", obtenerClienteEmpresaPorIdPrueba],
  ["Actualizar cliente empresa", actualizarClienteEmpresaPrueba],
  ["Eliminar cliente empresa", eliminarClienteEmpresaPrueba],
  ["Realizar reserva", realizarReservaPrueba],
  ["Obtener reservas del cliente empresa", obtenerReservasPrueba],
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
