import assert from "assert";
import pool from "../../src/Shared/Database/DatabaseConnection";
import { RepositorioAdministrador } from "../../src/ModuloUsuarios/DataAccess/RepositorioAdministrador";

/**
 * Limpia la tabla de administradores antes de cada prueba
 * Esto asegura que cada test comienza con una BD vacía
 */
async function limpiarBD() {
  await pool.query('DELETE FROM administrador');
  await pool.query('ALTER SEQUENCE administrador_id_seq RESTART WITH 1');
}

async function crearAdministradorTest() {
  const repo = new RepositorioAdministrador();
  const admin = await repo.crearAdministrador("123456", "Admin Nombre");

  assert.strictEqual(admin.getId(), "1");
  assert.strictEqual(admin.getCedula(), "123456");
  assert.strictEqual(admin.getNombre(), "Admin Nombre");
}

async function obtenerAdministradorPorIdTest() {
  const repo = new RepositorioAdministrador();
  const admin = await repo.crearAdministrador("111", "A");

  const encontrado = await repo.obtenerAdministradorPorId(admin.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getCedula(), "111");
  
  const noEncontrado = await repo.obtenerAdministradorPorId("999");
  assert.strictEqual(noEncontrado, undefined);
}

async function obtenerTodosLosAdministradoresTest() {
  const repo = new RepositorioAdministrador();
  await repo.crearAdministrador("1", "A");
  await repo.crearAdministrador("2", "B");

  const admins = await repo.obtenerAdministradores();
  assert.strictEqual(admins.length, 2);
  assert.ok(admins.some(a => a.getCedula() === "1"));
  assert.ok(admins.some(a => a.getCedula() === "2"));
}

async function existeAdministradorTest() {
  const repo = new RepositorioAdministrador();
  const admin = await repo.crearAdministrador("9", "X");

  const existe = await repo.existe(admin.getId());
  assert.strictEqual(existe, true);
  
  const noExiste = await repo.existe("999");
  assert.strictEqual(noExiste, false);
}

async function actualizarAdministradorTest() {
  const repo = new RepositorioAdministrador();
  const admin = await repo.crearAdministrador("oldCed", "OldN");

  const actualizado = await repo.actualizarAdministrador(admin.getId(), "newCed", "NewN");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getCedula(), "newCed");
  assert.strictEqual(actualizado?.getNombre(), "NewN");
}

async function eliminarAdministradorTest() {
  const repo = new RepositorioAdministrador();
  const admin = await repo.crearAdministrador("toDel", "X");

  const eliminado = await repo.eliminarAdministrador(admin.getId());
  assert.strictEqual(eliminado, true);
  
  const existe = await repo.existe(admin.getId());
  assert.strictEqual(existe, false);
  
  const admins = await repo.obtenerAdministradores();
  assert.strictEqual(admins.length, 0);
}

const pruebas = [
  ["Crear administrador", crearAdministradorTest],
  ["Obtener administrador por id", obtenerAdministradorPorIdTest],
  ["Obtener todos los administradores", obtenerTodosLosAdministradoresTest],
  ["Existe", existeAdministradorTest],
  ["Actualizar administrador", actualizarAdministradorTest],
  ["Eliminar administrador", eliminarAdministradorTest],
] as const;

async function ejecutarPruebas() {
  try {
    console.log('🧪 Iniciando pruebas del RepositorioAdministrador...\n');
    
    for (const [nombre, prueba] of pruebas) {
      try {
        // Limpia la BD antes de cada prueba
        await limpiarBD();
        
        // Ejecuta la prueba
        await prueba();
        console.log(`✅ ${nombre}`);
      } catch (error) {
        console.error(`❌ ${nombre}`);
        console.error(error);
        process.exit(1);
      }
    }
    
    console.log('\n✨ Todas las pruebas pasaron correctamente');
  } finally {
    // Cierra la conexión a la BD
    await pool.end();
  }
}

if (require.main === module) {
  ejecutarPruebas();
}
