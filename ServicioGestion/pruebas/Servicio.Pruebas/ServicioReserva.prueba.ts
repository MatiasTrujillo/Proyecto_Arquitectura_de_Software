import assert from "assert";
import { ServicioReserva } from "../../src/ModuloReservas/Servicio/ServicioReserva";
import { Reserva } from "../../src/ModuloReservas/Dominio/Reserva";

class RepositorioReservaFalso {
  private data: Reserva[] = [];
  private next = 1;

  crearReserva(
    cliente: string, origen: string, destino: string, fecha: Date,
    estado: string, costo: number, vehiculo: string, productos: string[],
    conductor: string, categorias: string[]
  ) {
    const reserva = new Reserva(`${this.next++}`, cliente, origen, destino, fecha, estado, costo, vehiculo, productos, conductor, categorias);
    this.data.push(reserva);
    return reserva;
  }

  obtenerReservas() { return this.data; }

  obtenerReservaPorId(id: string) {
    return this.data.find(r => r.getId() === id);
  }

  obtenerReservasPorCliente(clienteId: string) {
    return this.data.filter(r => r.getCliente() === clienteId);
  }

  actualizarEstadoReserva(id: string, estado: string) {
    const reserva = this.data.find(r => r.getId() === id);
    if (!reserva) return undefined;
    reserva.setEstado(estado);
    return reserva;
  }

  existe(id: string) {
    return this.data.some(r => r.getId() === id);
  }
}

async function crearReservaPrueba() {
  const repositorio = new RepositorioReservaFalso();
  const servicio = new ServicioReserva(repositorio as any);

  const reserva = await servicio.crearReserva("c1", "ZonaA", "ZonaB", "2024-06-01", 150, [], [], "v1", "cond1");
  assert.strictEqual(reserva.cliente, "c1");
  assert.strictEqual(reserva.estado, "Pendiente");
  assert.strictEqual(reserva.costo, 150);
}

async function crearReservaClienteIdInvalidoPrueba() {
  const servicio = new ServicioReserva(new RepositorioReservaFalso() as any);

  let lanzo = false;
  try {
    await servicio.crearReserva("", "ZonaA", "ZonaB", "2024-06-01", 100, [], [], "v1", "cond1");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function crearReservaFechaInvalidaPrueba() {
  const servicio = new ServicioReserva(new RepositorioReservaFalso() as any);

  let lanzo = false;
  try {
    await servicio.crearReserva("c1", "ZonaA", "ZonaB", "no-es-fecha", 100, [], [], "v1", "cond1");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function crearReservaCostoInvalidoPrueba() {
  const servicio = new ServicioReserva(new RepositorioReservaFalso() as any);

  let lanzo = false;
  try {
    await servicio.crearReserva("c1", "ZonaA", "ZonaB", "2024-06-01", -50, [], [], "v1", "cond1");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function obtenerReservasPorClientePrueba() {
  const repositorio = new RepositorioReservaFalso();
  const servicio = new ServicioReserva(repositorio as any);

  await servicio.crearReserva("clienteA", "O1", "D1", "2024-01-01", 100, [], [], "v1", "c1");
  await servicio.crearReserva("clienteA", "O2", "D2", "2024-01-02", 200, [], [], "v2", "c2");
  await servicio.crearReserva("clienteB", "O3", "D3", "2024-01-03", 300, [], [], "v3", "c3");

  const reservas = await servicio.obtenerReservasPorCliente("clienteA");
  assert.strictEqual(reservas.length, 2);
  assert.ok(reservas.every(r => r.cliente === "clienteA"));
}

async function consultarEstadoReservaPrueba() {
  const repositorio = new RepositorioReservaFalso();
  const servicio = new ServicioReserva(repositorio as any);

  const reserva = await servicio.crearReserva("c1", "O", "D", "2024-01-01", 100, [], [], "v1", "cond1");
  const estado = await servicio.consultarEstadoReserva(reserva.id);
  assert.strictEqual(estado, "Pendiente");
}

async function consultarEstadoReservaNoEncontradaPrueba() {
  const servicio = new ServicioReserva(new RepositorioReservaFalso() as any);

  let lanzo = false;
  try {
    await servicio.consultarEstadoReserva("id-inexistente");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

const pruebas = [
  ["Crear reserva exitosamente", crearReservaPrueba],
  ["Crear reserva con clienteId inválido lanza error", crearReservaClienteIdInvalidoPrueba],
  ["Crear reserva con fecha inválida lanza error", crearReservaFechaInvalidaPrueba],
  ["Crear reserva con costo negativo lanza error", crearReservaCostoInvalidoPrueba],
  ["Obtener reservas por cliente", obtenerReservasPorClientePrueba],
  ["Consultar estado de reserva existente", consultarEstadoReservaPrueba],
  ["Consultar estado de reserva no encontrada lanza error", consultarEstadoReservaNoEncontradaPrueba],
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
