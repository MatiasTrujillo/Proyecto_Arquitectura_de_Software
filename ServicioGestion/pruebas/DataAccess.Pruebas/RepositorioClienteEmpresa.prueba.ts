import assert from "assert";
import pool from "../../src/Shared/Database/DatabaseConnection";
import { RepositorioClienteEmpresa } from "../../src/ModuloUsuarios/DataAccess/RepositorioClienteEmpresa";

async function limpiarBD() {
  await pool.query('DELETE FROM cliente_empresa');
  await pool.query('ALTER SEQUENCE cliente_empresa_id_seq RESTART WITH 1');
}

async function crearClienteEmpresaTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = await repo.crearClienteEmpresa("123", "Empresa SA");

  assert.strictEqual(c.getId(), "1");
  assert.strictEqual(c.getCedula(), "123");
  assert.strictEqual(c.getNombre(), "Empresa SA");
}

async function obtenerClienteEmpresaPorIdTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = await repo.crearClienteEmpresa("11", "E");

  const encontrado = await repo.obtenerClienteEmpresaPorId(c.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "11");
  assert.strictEqual(await repo.obtenerClienteEmpresaPorId("999"), undefined);
}

async function obtenerTodosLosClientesTest() {
  const repo = new RepositorioClienteEmpresa();
  await repo.crearClienteEmpresa("1", "A");
  await repo.crearClienteEmpresa("2", "B");

  const list = await repo.obtenerClienteEmpresas();
  assert.strictEqual(list.length, 2);
  assert.ok(list.some(x => x.getCedula() === "1"));
}

async function existeClienteTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = await repo.crearClienteEmpresa("9", "X");

  assert.strictEqual(await repo.existe(c.getId()), true);
  assert.strictEqual(await repo.existe("999"), false);
}

async function actualizarClienteTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = await repo.crearClienteEmpresa("old", "Old");

  const actualizado = await repo.actualizarClienteEmpresa(c.getId(), "new", "New");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "new");
  assert.strictEqual(actualizado?.getNombre(), "New");
}

async function eliminarClienteTest() {
  const repo = new RepositorioClienteEmpresa();
  const c = await repo.crearClienteEmpresa("del", "D");

  assert.strictEqual(await repo.eliminarClienteEmpresa(c.getId()), true);
  assert.strictEqual(await repo.existe(c.getId()), false);
  assert.strictEqual((await repo.obtenerClienteEmpresas()).length, 0);
}

const pruebas = [
  ["Crear cliente empresa", crearClienteEmpresaTest],
  ["Obtener cliente empresa por id", obtenerClienteEmpresaPorIdTest],
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
