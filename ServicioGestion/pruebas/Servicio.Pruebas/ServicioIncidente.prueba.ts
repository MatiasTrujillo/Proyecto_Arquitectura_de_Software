import assert from "assert";
import { ServicioIncidente } from "../../src/ModuloReservas/Servicio/ServicioIncidente";
import { Incidente } from "../../src/ModuloReservas/Dominio/Incidente";

class RepositorioIncidenteFalso {
  private data: Incidente[] = [];
  private next = 1;

  crearIncidente(descripcion: string, fecha: Date, reservaId: string, estado: string, severidad: string, conductorId: string = "") {
    const id = `${this.next++}`;
    const incidente = new Incidente(id, descripcion, fecha, reservaId, estado, severidad, conductorId);
    this.data.push(incidente);
    return incidente;
  }

  obtenerIncidentes() {
    return this.data;
  }

  obtenerIncidentePorId(id: string) {
    return this.data.find((i) => i.getId() === id);
  }

  actualizarIncidente(id: string, descripcion: string, fecha: Date, reservaId: string, estado: string, severidad: string, conductorId: string = "") {
    const idx = this.data.findIndex((i) => i.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new Incidente(id, descripcion, fecha, reservaId, estado, severidad, conductorId);
    this.data[idx] = actualizado;
    return actualizado;
  }

  eliminarIncidente(id: string) {
    const idx = this.data.findIndex((i) => i.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: string) {
    return this.data.some((i) => i.getId() === id);
  }
}

async function crearIncidentePrueba() {
  const repositorio = new RepositorioIncidenteFalso();
  const servicio = new ServicioIncidente(repositorio as any);

  const inc = await servicio.crearIncidente("desc", "2024-01-01", "r1", "abierto", "alta", "");
  assert.strictEqual(inc.reservaId, "r1");
}

async function obtenerIncidentePorIdPrueba() {
  const repositorio = new RepositorioIncidenteFalso();
  const servicio = new ServicioIncidente(repositorio as any);
  const incidente = repositorio.crearIncidente("d", new Date(), "r2", "ok", "media");

  const encontrado = await servicio.obtenerIncidentePorId(incidente.getId());
  assert.ok(encontrado);

  let lanzo = false;
  try {
    await servicio.obtenerIncidentePorId("no");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function actualizarIncidentePrueba() {
  const repositorio = new RepositorioIncidenteFalso();
  const servicio = new ServicioIncidente(repositorio as any);
  const incidente = repositorio.crearIncidente("d", new Date(), "r", "s", "baja");

  const actualizado = await servicio.actualizarIncidente(incidente.getId(), "d2", new Date(), "r", "s2", "alta", "");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.reservaId, "r");
}

async function eliminarIncidentePrueba() {
  const repositorio = new RepositorioIncidenteFalso();
  const servicio = new ServicioIncidente(repositorio as any);
  const incidente = repositorio.crearIncidente("d", new Date(), "r", "s", "baja");

  await servicio.eliminarIncidente(incidente.getId());
  assert.strictEqual(repositorio.existe(incidente.getId()), false);
}

const pruebas = [
  ["Crear incidente", crearIncidentePrueba],
  ["Obtener incidente por id", obtenerIncidentePorIdPrueba],
  ["Actualizar incidente", actualizarIncidentePrueba],
  ["Eliminar incidente", eliminarIncidentePrueba],
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
