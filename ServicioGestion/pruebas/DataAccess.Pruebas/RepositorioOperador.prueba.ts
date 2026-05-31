import assert from "assert";
import pool from "../../src/Shared/Database/DatabaseConnection";
import { RepositorioOperador } from "../../src/ModuloUsuarios/DataAccess/RepositorioOperador";

async function limpiarBD() {
  await pool.query('DELETE FROM operador');
  await pool.query('ALTER SEQUENCE operador_id_seq RESTART WITH 1');
}

async function crearOperadorTest() {
  const repo = new RepositorioOperador();
  const c = await repo.crearOperador("123", "Operador");

  assert.strictEqual(c.getId(), "1");
  assert.strictEqual(c.getCedula(), "123");
  assert.strictEqual(c.getNombre(), "Operador");
}

async function obtenerOperadorPorIdTest() {
  const repo = new RepositorioOperador();
  const c = await repo.crearOperador("11", "P");

  const encontrado = await repo.obtenerOperadorPorId(c.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "11");
  assert.strictEqual(await repo.obtenerOperadorPorId("999"), undefined);
}

async function obtenerTodosLosOperadoresTest() {
  const repo = new RepositorioOperador();
  await repo.crearOperador("1", "A");
  await repo.crearOperador("2", "B");

  const list = await repo.obtenerOperadores();
  assert.strictEqual(list.length, 2);
  assert.ok(list.some(x => x.getCedula() === "1"));
}

async function existeOperadorTest() {
  const repo = new RepositorioOperador();
  const c = await repo.crearOperador("9", "X");

  assert.strictEqual(await repo.existe(c.getId()), true);
  assert.strictEqual(await repo.existe("999"), false);
}

async function actualizarOperadorTest() {
  const repo = new RepositorioOperador();
  const c = await repo.crearOperador("old", "Old");

  const actualizado = await repo.actualizarOperador(c.getId(), "new", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "new");
  assert.strictEqual(actualizado?.getNombre(), "New");
}

async function eliminarOperadorTest() {
  const repo = new RepositorioOperador();
  const c = await repo.crearOperador("del", "D");

  assert.strictEqual(await repo.eliminarOperador(c.getId()), true);
  assert.strictEqual(await repo.existe(c.getId()), false);
  assert.strictEqual((await repo.obtenerOperadores()).length, 0);
}

const pruebas = [
  ["Crear operador", crearOperadorTest],
  ["Obtener operador por id", obtenerOperadorPorIdTest],
  ["Obtener todos los operadores", obtenerTodosLosOperadoresTest],
  ["Existe", existeOperadorTest],
  ["Actualizar operador", actualizarOperadorTest],
  ["Eliminar operador", eliminarOperadorTest],
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
