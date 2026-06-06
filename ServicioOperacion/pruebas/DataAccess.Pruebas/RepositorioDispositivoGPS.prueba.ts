import assert from "assert";
import { RepositorioDispositivoGPS } from "../../src/ModuloVehiculos/DataAccess/RepositorioDispositivoGPS";

async function crearDispositivoTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = await repo.crearDispositivoGPS("Ubicación inicial");

  assert.strictEqual(d.getId(), 1);
}

async function obtenerDispositivoPorIdTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = await repo.crearDispositivoGPS("Ubicación A");

  const encontrado = await repo.obtenerDispositivoGPSPorId(d.getId());
  assert.ok(encontrado);
  assert.strictEqual(await repo.obtenerDispositivoGPSPorId(999), undefined);
}

async function obtenerTodosLosDispositivosTest() {
  const repo = new RepositorioDispositivoGPS();
  await repo.crearDispositivoGPS("Ubicación 1");
  await repo.crearDispositivoGPS("Ubicación 2");

  const list = await repo.obtenerDispositivosGPS();
  assert.strictEqual(list.length, 2);
}

async function existeDispositivoTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = await repo.crearDispositivoGPS("Ubicación test");

  assert.strictEqual(await repo.existe(d.getId()), true);
  assert.strictEqual(await repo.existe(999), false);
}

async function actualizarDispositivoTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = await repo.crearDispositivoGPS("Ubicación original");

  const actualizado = await repo.actualizarDispositivoGPS(d.getId(), "Ubicación actualizada");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getId(), d.getId());
  assert.strictEqual(actualizado?.getUbicacion(), "Ubicación actualizada");
}

async function eliminarDispositivoTest() {
  const repo = new RepositorioDispositivoGPS();
  const d = await repo.crearDispositivoGPS("Ubicación a eliminar");

  assert.strictEqual(await repo.eliminarDispositivoGPS(d.getId()), true);
  assert.strictEqual(await repo.existe(d.getId()), false);
  assert.strictEqual((await repo.obtenerDispositivosGPS()).length, 0);
}

const pruebas = [
  ["Crear dispositivo GPS", crearDispositivoTest],
  ["Obtener dispositivo por id", obtenerDispositivoPorIdTest],
  ["Obtener todos los dispositivos", obtenerTodosLosDispositivosTest],
  ["Existe", existeDispositivoTest],
  ["Actualizar dispositivo", actualizarDispositivoTest],
  ["Eliminar dispositivo", eliminarDispositivoTest],
] as const;

async function ejecutarPruebas() {
  for (const [nombre, prueba] of pruebas) {
    try {
      await prueba();
      console.log(`✅ ${nombre}`);
    } catch (error) {
      console.error(`❌ ${nombre}`);
      console.error(error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  ejecutarPruebas().catch(error => {
    console.error("❌ Error en las pruebas:", error);
    process.exit(1);
  });
}
