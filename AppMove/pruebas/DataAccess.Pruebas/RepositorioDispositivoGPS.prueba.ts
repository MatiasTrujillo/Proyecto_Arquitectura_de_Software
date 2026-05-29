import assert from "assert";
import { RepositorioDispositivoGPS } from "../../src/ModuloVehiculos/DataAccess/RepositorioDispositivoGPS";

function crearDispositivoTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = repo.crearDispositivoGPS();

  assert.strictEqual(d.getId(), 1);
}

function obtenerDispositivoPorIdTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = repo.crearDispositivoGPS();

  const encontrado = repo.obtenerDispositivoGPSPorId(d.getId());
  assert.ok(encontrado);
  assert.strictEqual(repo.obtenerDispositivoGPSPorId(999), undefined);
}

function obtenerTodosLosDispositivosTest() {
  const repo = new RepositorioDispositivoGPS();
  repo.crearDispositivoGPS();
  repo.crearDispositivoGPS();

  const list = repo.obtenerDispositivosGPS();
  assert.strictEqual(list.length, 2);
}

function existeDispositivoTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = repo.crearDispositivoGPS();

  assert.strictEqual(repo.existe(d.getId()), true);
  assert.strictEqual(repo.existe(999), false);
}

function actualizarDispositivoTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = repo.crearDispositivoGPS();

  const actualizado = repo.actualizarDispositivoGPS(d.getId());
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getId(), d.getId());
}

function eliminarDispositivoTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = repo.crearDispositivoGPS();

  assert.strictEqual(repo.eliminarDispositivoGPS(d.getId()), true);
  assert.strictEqual(repo.existe(d.getId()), false);
  assert.strictEqual(repo.obtenerDispositivosGPS().length, 0);
}

const pruebas = [
  ["Crear dispositivo GPS", crearDispositivoTest],
  ["Obtener dispositivo por id", obtenerDispositivoPorIdTest],
  ["Obtener todos los dispositivos", obtenerTodosLosDispositivosTest],
  ["Existe", existeDispositivoTest],
  ["Actualizar dispositivo", actualizarDispositivoTest],
  ["Eliminar dispositivo", eliminarDispositivoTest],
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
