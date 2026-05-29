import assert from "assert";
import { RepositorioConductor } from "../../src/ModuloUsuarios/DataAccess/RepositorioConductor";

function crearConductorTest() {
  const repo = new RepositorioConductor();
  const c = repo.crearConductor("123", "Conductor");

  assert.strictEqual(c.getId(), "1");
  assert.strictEqual(c.getCedula(), "123");
  assert.strictEqual(c.getNombre(), "Conductor");
}

function obtenerConductorPorIdTest() {
  const repo = new RepositorioConductor();
  const c = repo.crearConductor("11", "P");

  const encontrado = repo.obtenerConductorPorId(c.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "11");
  assert.strictEqual(repo.obtenerConductorPorId("999"), undefined);
}

function obtenerTodosLosConductoresTest() {
  const repo = new RepositorioConductor();
  repo.crearConductor("1", "A");
  repo.crearConductor("2", "B");

  const list = repo.obtenerConductores();
  assert.strictEqual(list.length, 2);
  assert.ok(list.some(x => x.getCedula() === "1"));
}

function existeConductorTest() {
  const repo = new RepositorioConductor();
  const c = repo.crearConductor("9", "X");

  assert.strictEqual(repo.existe(c.getId()), true);
  assert.strictEqual(repo.existe("999"), false);
}

function actualizarConductorTest() {
  const repo = new RepositorioConductor();
  const c = repo.crearConductor("old", "Old");

  const actualizado = repo.actualizarConductor(c.getId(), "new", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "new");
  assert.strictEqual(actualizado?.getNombre(), "New");
}

function eliminarConductorTest() {
  const repo = new RepositorioConductor();
  const c = repo.crearConductor("del", "D");

  assert.strictEqual(repo.eliminarConductor(c.getId()), true);
  assert.strictEqual(repo.existe(c.getId()), false);
  assert.strictEqual(repo.obtenerConductores().length, 0);
}

const pruebas = [
  ["Crear conductor", crearConductorTest],
  ["Obtener conductor por id", obtenerConductorPorIdTest],
  ["Obtener todos los conductores", obtenerTodosLosConductoresTest],
  ["Existe", existeConductorTest],
  ["Actualizar conductor", actualizarConductorTest],
  ["Eliminar conductor", eliminarConductorTest],
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
