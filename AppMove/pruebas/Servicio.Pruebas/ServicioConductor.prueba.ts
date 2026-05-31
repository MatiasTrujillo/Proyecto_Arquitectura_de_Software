import assert from "assert";
import { ServicioConductor } from "../../src/ModuloUsuarios/Servicio/ServicioConductor";
import { Conductor } from "../../src/ModuloUsuarios/Dominio/Conductor";

class RepositorioConductorFalso {
  private data: Conductor[] = [];
  private next = 1;

  crearConductor(cedula: string, nombre: string) {
    const id = `${this.next++}`;
    const conductor = new Conductor(id, cedula, nombre);
    this.data.push(conductor);
    return conductor;
  }

  obtenerConductores() {
    return this.data;
  }

  obtenerConductorPorId(id: string) {
    return this.data.find((c) => c.getId() === id);
  }

  actualizarConductor(id: string, cedula: string, nombre: string) {
    const idx = this.data.findIndex((c) => c.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new Conductor(id, cedula, nombre);
    this.data[idx] = actualizado;
    return actualizado;
  }

  eliminarConductor(id: string) {
    const idx = this.data.findIndex((c) => c.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: string) {
    return this.data.some((c) => c.getId() === id);
  }
}

function crearConductorPrueba() {
  const repositorio = new RepositorioConductorFalso();
  const servicio = new ServicioConductor(repositorio as any);

  const conductor = servicio.crearConductor("999", "Pedro");
  assert.strictEqual(conductor.cedula, "999");
}

function obtenerConductorPorIdPrueba() {
  const repositorio = new RepositorioConductorFalso();
  const servicio = new ServicioConductor(repositorio as any);
  const conductor = repositorio.crearConductor("888", "Ana");

  const encontrado = servicio.obtenerConductorPorId(conductor.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado.cedula, "888");

  let lanzo = false;
  try {
    servicio.obtenerConductorPorId("no");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

function actualizarConductorPrueba() {
  const repositorio = new RepositorioConductorFalso();
  const servicio = new ServicioConductor(repositorio as any);
  const conductor = repositorio.crearConductor("111", "Old");

  const actualizado = servicio.actualizarConductor(conductor.getId(), "222", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.cedula, "222");
}

function eliminarConductorPrueba() {
  const repositorio = new RepositorioConductorFalso();
  const servicio = new ServicioConductor(repositorio as any);
  const conductor = repositorio.crearConductor("55", "X");

  servicio.eliminarConductor(conductor.getId());
  assert.strictEqual(repositorio.existe(conductor.getId()), false);
}

const pruebas = [
  ["Crear conductor", crearConductorPrueba],
  ["Obtener conductor por id", obtenerConductorPorIdPrueba],
  ["Actualizar conductor", actualizarConductorPrueba],
  ["Eliminar conductor", eliminarConductorPrueba],
] as const;

function ejecutarPruebas() {
  for (const [nombre, prueba] of pruebas) {
    try {
      prueba();
      console.log(`✅ ${nombre}`);
    } catch (error) {
      console.error(`❌ ${nombre}`);
      console.error(error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  ejecutarPruebas();
}
