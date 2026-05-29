import assert from "assert";
import { RepositorioAdministrador } from "../../src/ModuloUsuarios/DataAccess/RepositorioAdministrador";

function crearAdministradorTest() {
  const repo = new RepositorioAdministrador();
  const admin = repo.crearAdministrador("123456", "Admin Nombre");

  assert.strictEqual(admin.getId(), "1");
  assert.strictEqual(admin.getCedula(), "123456");
  assert.strictEqual(admin.getNombre(), "Admin Nombre");
}

function obtenerAdministradorPorIdTest() {
  const repo = new RepositorioAdministrador();
  const admin = repo.crearAdministrador("111", "A");

  const encontrado = repo.obtenerAdministradorPorId(admin.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "111");
  assert.strictEqual(repo.obtenerAdministradorPorId("999"), undefined);
}

function obtenerTodosLosAdministradoresTest() {
  const repo = new RepositorioAdministrador();
  repo.crearAdministrador("1", "A");
  repo.crearAdministrador("2", "B");

  const admins = repo.obtenerAdministradores();
  assert.strictEqual(admins.length, 2);
  assert.ok(admins.some(a => a.getCedula() === "1"));
  assert.ok(admins.some(a => a.getCedula() === "2"));
}

function existeAdministradorTest() {
  const repo = new RepositorioAdministrador();
  const admin = repo.crearAdministrador("9", "X");

  assert.strictEqual(repo.existe(admin.getId()), true);
  assert.strictEqual(repo.existe("999"), false);
}

function actualizarAdministradorTest() {
  const repo = new RepositorioAdministrador();
  const admin = repo.crearAdministrador("oldCed", "OldN");

  const actualizado = repo.actualizarAdministrador(admin.getId(), "newCed", "NewN");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "newCed");
  assert.strictEqual(actualizado?.getNombre(), "NewN");
}

function eliminarAdministradorTest() {
  const repo = new RepositorioAdministrador();
  const admin = repo.crearAdministrador("toDel", "X");

  assert.strictEqual(repo.eliminarAdministrador(admin.getId()), true);
  assert.strictEqual(repo.existe(admin.getId()), false);
  assert.strictEqual(repo.obtenerAdministradores().length, 0);
}

const pruebas = [
  ["Crear administrador", crearAdministradorTest],
  ["Obtener administrador por id", obtenerAdministradorPorIdTest],
  ["Obtener todos los administradores", obtenerTodosLosAdministradoresTest],
  ["Existe", existeAdministradorTest],
  ["Actualizar administrador", actualizarAdministradorTest],
  ["Eliminar administrador", eliminarAdministradorTest],
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
