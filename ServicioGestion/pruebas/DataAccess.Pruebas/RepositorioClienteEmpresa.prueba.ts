import assert from "assert";
import { RepositorioClienteEmpresa } from "../../src/ModuloUsuarios/DataAccess/RepositorioClienteEmpresa";

function crearClienteEmpresaTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = repo.crearClienteEmpresa("123", "Empresa SA");

  assert.strictEqual(c.getId(), "1");
  assert.strictEqual(c.getCedula(), "123");
  assert.strictEqual(c.getNombre(), "Empresa SA");
}

function obtenerClienteEmpresaPorIdTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = repo.crearClienteEmpresa("11", "E");

  const encontrado = repo.obtenerClienteEmpresaPorId(c.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "11");
  assert.strictEqual(repo.obtenerClienteEmpresaPorId("999"), undefined);
}

function obtenerTodosLosClientesTest() {
  const repo = new RepositorioClienteEmpresa();
  repo.crearClienteEmpresa("1", "A");
  repo.crearClienteEmpresa("2", "B");

  const list = repo.obtenerClienteEmpresas();
  assert.strictEqual(list.length, 2);
  assert.ok(list.some(x => x.getCedula() === "1"));
}

function existeClienteTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = repo.crearClienteEmpresa("9", "X");

  assert.strictEqual(repo.existe(c.getId()), true);
  assert.strictEqual(repo.existe("999"), false);
}

function actualizarClienteTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = repo.crearClienteEmpresa("old", "Old");

  const actualizado = repo.actualizarClienteEmpresa(c.getId(), "new", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "new");
  assert.strictEqual(actualizado?.getNombre(), "New");
}

function eliminarClienteTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = repo.crearClienteEmpresa("del", "D");

  assert.strictEqual(repo.eliminarClienteEmpresa(c.getId()), true);
  assert.strictEqual(repo.existe(c.getId()), false);
  assert.strictEqual(repo.obtenerClienteEmpresas().length, 0);
}

const pruebas = [
  ["Crear cliente empresa", crearClienteEmpresaTest],
  ["Obtener cliente empresa por id", obtenerClienteEmpresaPorIdTest],
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
