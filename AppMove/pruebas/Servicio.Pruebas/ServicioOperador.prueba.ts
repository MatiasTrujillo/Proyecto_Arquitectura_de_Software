import assert from "assert";
import { ServicioOperador } from "../../src/ModuloUsuarios/Servicio/ServicioOperador";
import { Operador } from "../../src/ModuloUsuarios/Dominio/Operador";

class RepositorioOperadorFalso {
  private data: Operador[] = [];
  private next = 1;

  crearOperador(cedula: string, nombre: string) {
    const id = `${this.next++}`;
    const operador = new Operador(id, cedula, nombre);
    this.data.push(operador);
    return operador;
  }

  obtenerOperadores() {
    return this.data;
  }

  obtenerOperadorPorId(id: string) {
    return this.data.find((o) => o.getId() === id);
  }

  actualizarOperador(id: string, cedula: string, nombre: string) {
    const idx = this.data.findIndex((o) => o.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new Operador(id, cedula, nombre);
    this.data[idx] = actualizado;
    return actualizado;
  }

  eliminarOperador(id: string) {
    const idx = this.data.findIndex((o) => o.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: string) {
    return this.data.some((o) => o.getId() === id);
  }
}

function crearOperadorPrueba() {
  const repositorio = new RepositorioOperadorFalso();
  const servicio = new ServicioOperador(repositorio as any);

  const operador = servicio.crearOperador("999", "Pedro");
  assert.strictEqual(operador.getCedula(), "999");
}

function obtenerOperadorPorIdPrueba() {
  const repositorio = new RepositorioOperadorFalso();
  const servicio = new ServicioOperador(repositorio as any);
  const operador = repositorio.crearOperador("888", "Ana");

  const encontrado = servicio.obtenerOperadorPorId(operador.getId());
  assert.ok(encontrado);

  let lanzo = false;
  try {
    servicio.obtenerOperadorPorId("no");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

function actualizarOperadorPrueba() {
  const repositorio = new RepositorioOperadorFalso();
  const servicio = new ServicioOperador(repositorio as any);
  const operador = repositorio.crearOperador("111", "Old");

  const actualizado = servicio.actualizarOperador(operador.getId(), "222", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.getCedula(), "222");
}

function eliminarOperadorPrueba() {
  const repositorio = new RepositorioOperadorFalso();
  const servicio = new ServicioOperador(repositorio as any);
  const operador = repositorio.crearOperador("55", "X");

  servicio.eliminarOperador(operador.getId());
  assert.strictEqual(repositorio.existe(operador.getId()), false);
}

const pruebas = [
  ["Crear operador", crearOperadorPrueba],
  ["Obtener operador por id", obtenerOperadorPorIdPrueba],
  ["Actualizar operador", actualizarOperadorPrueba],
  ["Eliminar operador", eliminarOperadorPrueba],
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
