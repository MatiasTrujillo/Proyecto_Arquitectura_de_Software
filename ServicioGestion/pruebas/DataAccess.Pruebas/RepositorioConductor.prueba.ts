import assert from "assert";
import pool from "../../src/Shared/Database/DatabaseConnection";
import { RepositorioConductor } from "../../src/ModuloUsuarios/DataAccess/RepositorioConductor";

async function limpiarBD() {
  await pool.query('DELETE FROM conductor');
  await pool.query('ALTER SEQUENCE conductor_id_seq RESTART WITH 1');
}

async function crearConductorTest() {
  const repo = new RepositorioConductor();
  const c = await repo.crearConductor("123", "Conductor");

  assert.strictEqual(c.getId(), "1");
  assert.strictEqual(c.getCedula(), "123");
  assert.strictEqual(c.getNombre(), "Conductor");
}

async function obtenerConductorPorIdTest() {
  const repo = new RepositorioConductor();
  const c = await repo.crearConductor("11", "P");

  const encontrado = await repo.obtenerConductorPorId(c.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "11");
  assert.strictEqual(await repo.obtenerConductorPorId("999"), undefined);
}

async function obtenerTodosLosConductoresTest() {
  const repo = new RepositorioConductor();
  await repo.crearConductor("1", "A");
  await repo.crearConductor("2", "B");

  const list = await repo.obtenerConductores();
  assert.strictEqual(list.length, 2);
  assert.ok(list.some(x => x.getCedula() === "1"));
}

async function existeConductorTest() {
  const repo = new RepositorioConductor();
  const c = await repo.crearConductor("9", "X");

  assert.strictEqual(await repo.existe(c.getId()), true);
  assert.strictEqual(await repo.existe("999"), false);
}

async function actualizarConductorTest() {
  const repo = new RepositorioConductor();
  const c = await repo.crearConductor("old", "Old");

  const actualizado = await repo.actualizarConductor(c.getId(), "new", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "new");
  assert.strictEqual(actualizado?.getNombre(), "New");
}

async function eliminarConductorTest() {
  const repo = new RepositorioConductor();
  const c = await repo.crearConductor("del", "D");

  assert.strictEqual(await repo.eliminarConductor(c.getId()), true);
  assert.strictEqual(await repo.existe(c.getId()), false);
  assert.strictEqual((await repo.obtenerConductores()).length, 0);
}

const pruebas = [
  ["Crear conductor", crearConductorTest],
  ["Obtener conductor por id", obtenerConductorPorIdTest],
  ["Obtener todos los conductores", obtenerTodosLosConductoresTest],
  ["Existe", existeConductorTest],
  ["Actualizar conductor", actualizarConductorTest],
  ["Eliminar conductor", eliminarConductorTest],
] as const;

async function ejecutarPruebas() {
  try {
    for (const [nombre, prueba] of pruebas) {
      try {
        await limpiarBD();
        await prueba();
        console.log(`✅ ${nombre}`);
      } catch (error) {
        console.error(`❌ ${nombre}`);
        console.error(error);
        process.exit(1);
      }
    }
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  ejecutarPruebas();
}
