import assert from "assert";
import pool from "../../src/Shared/Database/DatabaseConnection";
import { RepositorioClientePersonal } from "../../src/ModuloUsuarios/DataAccess/RepositorioClientePersonal";

async function limpiarBD() {
  await pool.query('DELETE FROM cliente_personal');
  await pool.query('ALTER SEQUENCE cliente_personal_id_seq RESTART WITH 1');
}

async function crearClientePersonalTest() {
  const repo = new RepositorioClientePersonal();
  const c = await repo.crearClientePersonal("123", "Persona");

  assert.strictEqual(c.getId(), "1");
  assert.strictEqual(c.getCedula(), "123");
  assert.strictEqual(c.getNombre(), "Persona");
}

async function obtenerClientePersonalPorIdTest() {
  const repo = new RepositorioClientePersonal();
  const c = await repo.crearClientePersonal("11", "P");

  const encontrado = await repo.obtenerClientePersonalPorId(c.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "11");
  assert.strictEqual(await repo.obtenerClientePersonalPorId("999"), undefined);
}

async function obtenerTodosLosClientesTest() {
  const repo = new RepositorioClientePersonal();
  await repo.crearClientePersonal("1", "A");
  await repo.crearClientePersonal("2", "B");

  const list = await repo.obtenerClientePersonales();
  assert.strictEqual(list.length, 2);
  assert.ok(list.some(x => x.getCedula() === "1"));
}

async function existeClienteTest() {
  const repo = new RepositorioClientePersonal();
  const c = await repo.crearClientePersonal("9", "X");

  assert.strictEqual(await repo.existe(c.getId()), true);
  assert.strictEqual(await repo.existe("999"), false);
}

async function actualizarClienteTest() {
  const repo = new RepositorioClientePersonal();
  const c = await repo.crearClientePersonal("old", "Old");

  const actualizado = await repo.actualizarClientePersonal(c.getId(), "new", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "new");
  assert.strictEqual(actualizado?.getNombre(), "New");
}

async function eliminarClienteTest() {
  const repo = new RepositorioClientePersonal();
  const c = await repo.crearClientePersonal("del", "D");

  assert.strictEqual(await repo.eliminarClientePersonal(c.getId()), true);
  assert.strictEqual(await repo.existe(c.getId()), false);
  assert.strictEqual((await repo.obtenerClientePersonales()).length, 0);
}

const pruebas = [
  ["Crear cliente personal", crearClientePersonalTest],
  ["Obtener cliente personal por id", obtenerClientePersonalPorIdTest],
  ["Obtener todos los clientes", obtenerTodosLosClientesTest],
  ["Existe", existeClienteTest],
  ["Actualizar cliente", actualizarClienteTest],
  ["Eliminar cliente", eliminarClienteTest],
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
