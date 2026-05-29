import assert from "assert";
import { RepositorioClientePersonal } from "../../src/ModuloUsuarios/DataAccess/RepositorioClientePersonal";

function crearClientePersonalTest() {
  const repo = new RepositorioClientePersonal();
  const c = repo.crearClientePersonal("123", "Persona");

  assert.strictEqual(c.getId(), "1");
  assert.strictEqual(c.getCedula(), "123");
  assert.strictEqual(c.getNombre(), "Persona");
}

function obtenerClientePersonalPorIdTest() {
  const repo = new RepositorioClientePersonal();
  const c = repo.crearClientePersonal("11", "P");

  const encontrado = repo.obtenerClientePersonalPorId(c.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "11");
  assert.strictEqual(repo.obtenerClientePersonalPorId("999"), undefined);
}

function obtenerTodosLosClientesTest() {
  const repo = new RepositorioClientePersonal();
  repo.crearClientePersonal("1", "A");
  repo.crearClientePersonal("2", "B");

  const list = repo.obtenerClientePersonales();
  assert.strictEqual(list.length, 2);
  assert.ok(list.some(x => x.getCedula() === "1"));
}

function existeClienteTest() {
  const repo = new RepositorioClientePersonal();
  const c = repo.crearClientePersonal("9", "X");

  assert.strictEqual(repo.existe(c.getId()), true);
  assert.strictEqual(repo.existe("999"), false);
}

function actualizarClienteTest() {
  const repo = new RepositorioClientePersonal();
  const c = repo.crearClientePersonal("old", "Old");

  const actualizado = repo.actualizarClientePersonal(c.getId(), "new", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "new");
  assert.strictEqual(actualizado?.getNombre(), "New");
}

function eliminarClienteTest() {
  const repo = new RepositorioClientePersonal();
  const c = repo.crearClientePersonal("del", "D");

  assert.strictEqual(repo.eliminarClientePersonal(c.getId()), true);
  assert.strictEqual(repo.existe(c.getId()), false);
  assert.strictEqual(repo.obtenerClientePersonales().length, 0);
}

const pruebas = [
  ["Crear cliente personal", crearClientePersonalTest],
  ["Obtener cliente personal por id", obtenerClientePersonalPorIdTest],
  ["Obtener todos los clientes", obtenerTodosLosClientesTest],
  ["Existe", existeClienteTest],
  ["Actualizar cliente", actualizarClienteTest],
  ["Eliminar cliente", eliminarClienteTest],
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
