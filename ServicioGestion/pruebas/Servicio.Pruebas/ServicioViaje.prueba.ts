import assert from "assert";
import { ServicioViaje } from "../../src/ModuloReservas/Servicio/ServicioViaje";
import { Viaje } from "../../src/ModuloReservas/Dominio/Viaje";

class RepositorioViajeFalso {
  private data: Viaje[] = [];
  private next = 1;

  crearViaje(reservaId: string, origen: string, destino: string, fecha: Date, estado: string, conductor: string) {
    const id = `${this.next++}`;
    const viaje = new Viaje(id, reservaId, origen, destino, fecha, estado, conductor);
    this.data.push(viaje);
    return viaje;
  }

  obtenerViajes() {
    return this.data;
  }

  obtenerViajePorId(id: string) {
    return this.data.find((v) => v.getId() === id);
  }

  actualizarViaje(id: string, reservaId: string, origen: string, destino: string, fecha: Date, estado: string, conductor: string) {
    const idx = this.data.findIndex((v) => v.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new Viaje(id, reservaId, origen, destino, fecha, estado, conductor);
    this.data[idx] = actualizado;
    return actualizado;
  }

  eliminarViaje(id: string) {
    const idx = this.data.findIndex((v) => v.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: string) {
    return this.data.some((v) => v.getId() === id);
  }
}

async function crearViajePrueba() {
  const repositorio = new RepositorioViajeFalso();
  const servicio = new ServicioViaje(repositorio as any);

  const viaje = await servicio.crearViaje("r1", "A", "B", "2024-01-01", "activo", "c1");
  assert.strictEqual(viaje.reservaId, "r1");
}

async function obtenerViajePorIdPrueba() {
  const repositorio = new RepositorioViajeFalso();
  const servicio = new ServicioViaje(repositorio as any);
  const viaje = repositorio.crearViaje("r2", "X", "Y", new Date(), "ok", "c2");

  const encontrado = await servicio.obtenerViajePorId(viaje.getId());
  assert.ok(encontrado);

  let lanzo = false;
  try {
    await servicio.obtenerViajePorId("no-existe");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function obtenerTodosLosViajesPrueba() {
  const repositorio = new RepositorioViajeFalso();
  const servicio = new ServicioViaje(repositorio as any);
  repositorio.crearViaje("r1", "A", "B", new Date(), "s", "c1");
  repositorio.crearViaje("r2", "C", "D", new Date(), "s", "c2");

  const viajes = await servicio.obtenerViajes();
  assert.strictEqual(viajes.length, 2);
}

async function actualizarViajePrueba() {
  const repositorio = new RepositorioViajeFalso();
  const servicio = new ServicioViaje(repositorio as any);
  const viaje = repositorio.crearViaje("r", "A", "B", new Date(), "s", "c");

  const actualizado = await servicio.actualizarViaje(viaje.getId(), "r-upd", "A2", "B2", new Date(), "s2", "c2");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.origen, "A2");
}

async function eliminarViajePrueba() {
  const repositorio = new RepositorioViajeFalso();
  const servicio = new ServicioViaje(repositorio as any);
  const viaje = repositorio.crearViaje("r", "o", "d", new Date(), "s", "c");

  await servicio.eliminarViaje(viaje.getId());
  assert.strictEqual(repositorio.existe(viaje.getId()), false);
}

const pruebas = [
  ["Crear viaje", crearViajePrueba],
  ["Obtener viaje por id", obtenerViajePorIdPrueba],
  ["Obtener todos los viajes", obtenerTodosLosViajesPrueba],
  ["Actualizar viaje", actualizarViajePrueba],
  ["Eliminar viaje", eliminarViajePrueba],
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
