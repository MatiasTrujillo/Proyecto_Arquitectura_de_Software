import assert from "assert";
import { RepositorioOperador } from "../../src/ModuloUsuarios/DataAccess/RepositorioOperador";

function crearOperadorTest() {
  const repo = new RepositorioOperador();
  const c = repo.crearOperador("123", "Operador");

  assert.strictEqual(c.getId(), "1");
  assert.strictEqual(c.getCedula(), "123");
  assert.strictEqual(c.getNombre(), "Operador");
}

function obtenerOperadorPorIdTest() {
  const repo = new RepositorioOperador();
  const c = repo.crearOperador("11", "P");

  const encontrado = repo.obtenerOperadorPorId(c.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "11");
  assert.strictEqual(repo.obtenerOperadorPorId("999"), undefined);
}

function obtenerTodosLosOperadoresTest() {
  const repo = new RepositorioOperador();
  repo.crearOperador("1", "A");
  repo.crearOperador("2", "B");

  const list = repo.obtenerOperadores();
  assert.strictEqual(list.length, 2);
  assert.ok(list.some(x => x.getCedula() === "1"));
}

function existeOperadorTest() {
  const repo = new RepositorioOperador();
  const c = repo.crearOperador("9", "X");

  assert.strictEqual(repo.existe(c.getId()), true);
  assert.strictEqual(repo.existe("999"), false);
}

function actualizarOperadorTest() {
  const repo = new RepositorioOperador();
  const c = repo.crearOperador("old", "Old");

  const actualizado = repo.actualizarOperador(c.getId(), "new", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "new");
  assert.strictEqual(actualizado?.getNombre(), "New");
}

function eliminarOperadorTest() {
  const repo = new RepositorioOperador();
  const c = repo.crearOperador("del", "D");

  assert.strictEqual(repo.eliminarOperador(c.getId()), true);
  assert.strictEqual(repo.existe(c.getId()), false);
  assert.strictEqual(repo.obtenerOperadores().length, 0);
}

const pruebas = [
  ["Crear operador", crearOperadorTest],
  ["Obtener operador por id", obtenerOperadorPorIdTest],
  ["Obtener todos los operadores", obtenerTodosLosOperadoresTest],
  ["Existe", existeOperadorTest],
  ["Actualizar operador", actualizarOperadorTest],
  ["Eliminar operador", eliminarOperadorTest],
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
