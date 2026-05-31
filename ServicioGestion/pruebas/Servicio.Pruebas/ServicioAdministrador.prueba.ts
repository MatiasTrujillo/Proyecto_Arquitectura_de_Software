import assert from "assert";
import { ServicioAdministrador } from "../../src/ModuloUsuarios/Servicio/ServicioAdministrador";
import { Administrador } from "../../src/ModuloUsuarios/Dominio/Administrador";

class RepositorioAdministradorFalso {
  private data: Administrador[] = [];
  private next = 1;

  crearAdministrador(cedula: string, nombre: string) {
    const id = `${this.next++}`;
    const administrador = new Administrador(id, cedula, nombre);
    this.data.push(administrador);
    return administrador;
  }

  obtenerAdministradores() {
    return this.data;
  }

  obtenerAdministradorPorId(id: string) {
    return this.data.find((a) => a.getId() === id);
  }

  actualizarAdministrador(id: string, cedula: string, nombre: string) {
    const idx = this.data.findIndex((a) => a.getId() === id);
    if (idx === -1) return undefined;
    const actualizado = new Administrador(id, cedula, nombre);
    this.data[idx] = actualizado;
    return actualizado;
  }

  eliminarAdministrador(id: string) {
    const idx = this.data.findIndex((a) => a.getId() === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }

  existe(id: string) {
    return this.data.some((a) => a.getId() === id);
  }
}

async function crearAdministradorPrueba() {
  const repositorio = new RepositorioAdministradorFalso();
  const servicio = new ServicioAdministrador(repositorio as any);

  const administrador = await servicio.crearAdministrador("123", "Juan");
  assert.strictEqual(administrador.cedula, "123");
}

async function obtenerAdministradorPorIdPrueba() {
  const repositorio = new RepositorioAdministradorFalso();
  const servicio = new ServicioAdministrador(repositorio as any);
  const administrador = repositorio.crearAdministrador("321", "Ana");

  const encontrado = await servicio.obtenerAdministradorPorId(administrador.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado.cedula, "321");

  let lanzo = false;
  try {
    servicio.obtenerAdministradorPorId("no");
  } catch (e) {
    lanzo = true;
  }
  assert.strictEqual(lanzo, true);
}

async function actualizarAdministradorPrueba() {
  const repositorio = new RepositorioAdministradorFalso();
  const servicio = new ServicioAdministrador(repositorio as any);
  const administrador = repositorio.crearAdministrador("111", "Old");

  const actualizado = await servicio.actualizarAdministrador(administrador.getId(), "222", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado.cedula, "222");
}

function eliminarAdministradorPrueba() {
  const repositorio = new RepositorioAdministradorFalso();
  const servicio = new ServicioAdministrador(repositorio as any);
  const administrador = repositorio.crearAdministrador("55", "X");

  servicio.eliminarAdministrador(administrador.getId());
  assert.strictEqual(repositorio.existe(administrador.getId()), false);
}

const pruebas = [
  ["Crear administrador", crearAdministradorPrueba],
  ["Obtener administrador por id", obtenerAdministradorPorIdPrueba],
  ["Actualizar administrador", actualizarAdministradorPrueba],
  ["Eliminar administrador", eliminarAdministradorPrueba],
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
