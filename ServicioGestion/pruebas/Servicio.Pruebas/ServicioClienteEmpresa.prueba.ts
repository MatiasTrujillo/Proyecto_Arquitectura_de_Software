import assert from "assert";
import { ServicioClienteEmpresa } from "../../src/ModuloUsuarios/Servicio/ServicioClienteEmpresa";
import { ClienteEmpresa } from "../../src/ModuloUsuarios/Dominio/ClienteEmpresa";

class RepositorioClienteEmpresaFalso {
  private data: ClienteEmpresa[] = [];
  private next = 1;

  crearClienteEmpresa(cedula: string, nombre: string) {
    const id = `${this.next++}`;
    const cliente = new ClienteEmpresa(id, cedula, nombre);
    this.data.push(cliente);
    return cliente;
  }

  obtenerClienteEmpresas() {
    return this.data;
  }

  obtenerClienteEmpresaPorId(id: string) {
    return this.data.find((c) => c.getId() === id);
  }

  actualizarClienteEmpresa(id: string, cedula: string, nombre: string) {
    const idx = this.data.findIndex((c) => c.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new ClienteEmpresa(id, cedula, nombre);
    this.data[idx] = actualizado;
    return actualizado;
  }

  eliminarClienteEmpresa(id: string) {
    const idx = this.data.findIndex((c) => c.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: string) {
    return this.data.some((c) => c.getId() === id);
  }
}

async function crearClienteEmpresaPrueba() {
  const repositorio = new RepositorioClienteEmpresaFalso();
  const servicio = new ServicioClienteEmpresa(repositorio as any);

  const cliente = await servicio.crearClienteEmpresa("999", "EmpresaX");
  assert.strictEqual(cliente.cedula, "999");
}

async function obtenerClienteEmpresaPorIdPrueba() {
  const repositorio = new RepositorioClienteEmpresaFalso();
  const servicio = new ServicioClienteEmpresa(repositorio as any);
  const cliente = repositorio.crearClienteEmpresa("888", "EmpresaY");

  const encontrado = await servicio.obtenerClienteEmpresaPorId(cliente.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado.cedula, "888");

  let lanzo = false;
  try {
    await servicio.obtenerClienteEmpresaPorId("no");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function actualizarClienteEmpresaPrueba() {
  const repositorio = new RepositorioClienteEmpresaFalso();
  const servicio = new ServicioClienteEmpresa(repositorio as any);
  const cliente = repositorio.crearClienteEmpresa("111", "Old");

  const actualizado = await servicio.actualizarClienteEmpresa(cliente.getId(), "222", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.cedula, "222");
}

async function eliminarClienteEmpresaPrueba() {
  const repositorio = new RepositorioClienteEmpresaFalso();
  const servicio = new ServicioClienteEmpresa(repositorio as any);
  const cliente = repositorio.crearClienteEmpresa("55", "X");

  await servicio.eliminarClienteEmpresa(cliente.getId());
  assert.strictEqual(repositorio.existe(cliente.getId()), false);
}

const pruebas = [
  ["Crear cliente empresa", crearClienteEmpresaPrueba],
  ["Obtener cliente empresa por id", obtenerClienteEmpresaPorIdPrueba],
  ["Actualizar cliente empresa", actualizarClienteEmpresaPrueba],
  ["Eliminar cliente empresa", eliminarClienteEmpresaPrueba],
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
