import assert from "assert";
import { ServicioClientePersonal } from "../../src/ModuloUsuarios/Servicio/ServicioClientePersonal";
import { ClientePersonal } from "../../src/ModuloUsuarios/Dominio/ClientePersonal";

class RepositorioClientePersonalFalso {
  private data: ClientePersonal[] = [];
  private next = 1;

  crearClientePersonal(cedula: string, nombre: string) {
    const id = `${this.next++}`;
    const cliente = new ClientePersonal(id, cedula, nombre);
    this.data.push(cliente);
    return cliente;
  }

  obtenerClientePersonales() {
    return this.data;
  }

  obtenerClientePersonalPorId(id: string) {
    return this.data.find((c) => c.getId() === id);
  }

  actualizarClientePersonal(id: string, cedula: string, nombre: string) {
    const idx = this.data.findIndex((c) => c.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new ClientePersonal(id, cedula, nombre);
    this.data[idx] = actualizado;
    return actualizado;
  }

  eliminarClientePersonal(id: string) {
    const idx = this.data.findIndex((c) => c.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: string) {
    return this.data.some((c) => c.getId() === id);
  }
}

async function crearClientePersonalPrueba() {
  const repositorio = new RepositorioClientePersonalFalso();
  const servicio = new ServicioClientePersonal(repositorio as any);

  const cliente = await servicio.crearClientePersonal("999", "Pedro");
  assert.strictEqual(cliente.cedula, "999");
}

async function obtenerClientePersonalPorIdPrueba() {
  const repositorio = new RepositorioClientePersonalFalso();
  const servicio = new ServicioClientePersonal(repositorio as any);
  const cliente = repositorio.crearClientePersonal("888", "Ana");

  const encontrado = await servicio.obtenerClientePersonalPorId(cliente.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado.cedula, "888");

  let lanzo = false;
  try {
    await servicio.obtenerClientePersonalPorId("no");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function actualizarClientePersonalPrueba() {
  const repositorio = new RepositorioClientePersonalFalso();
  const servicio = new ServicioClientePersonal(repositorio as any);
  const cliente = repositorio.crearClientePersonal("111", "Old");

  const actualizado = await servicio.actualizarClientePersonal(cliente.getId(), "222", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.cedula, "222");
}

async function eliminarClientePersonalPrueba() {
  const repositorio = new RepositorioClientePersonalFalso();
  const servicio = new ServicioClientePersonal(repositorio as any);
  const cliente = repositorio.crearClientePersonal("55", "X");

  await servicio.eliminarClientePersonal(cliente.getId());
  assert.strictEqual(repositorio.existe(cliente.getId()), false);
}

const pruebas = [
  ["Crear cliente personal", crearClientePersonalPrueba],
  ["Obtener cliente personal por id", obtenerClientePersonalPorIdPrueba],
  ["Actualizar cliente personal", actualizarClientePersonalPrueba],
  ["Eliminar cliente personal", eliminarClientePersonalPrueba],
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
