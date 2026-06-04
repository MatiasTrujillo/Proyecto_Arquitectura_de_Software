import assert from "assert";
import { RepositorioVehiculo } from "../../src/ModuloVehiculos/DataAccess/RepositorioVehiculo";

async function crearVehiculoTest() {
  const repo = new RepositorioVehiculo();
  const v = await repo.crearVehiculo("ABC123", "Camion", 1000, "d1");
  assert.strictEqual(v.getId(), 1);
}

async function obtenerVehiculoPorIdTest() {
  const repo = new RepositorioVehiculo();
  const v = await repo.crearVehiculo("ABC123", "Auto", 4, "d1");

  const encontrado = await repo.obtenerVehiculoPorId(v.getId());
  assert.ok(encontrado);
  assert.strictEqual(await repo.obtenerVehiculoPorId(999), undefined);
}

async function obtenerTodosLosVehiculosTest() {
  const repo = new RepositorioVehiculo();
  await repo.crearVehiculo("A1", "Auto", 4, "d1");
  await repo.crearVehiculo("B2", "Camion", 1000, "d2");

  const list = await repo.obtenerVehiculos();
  assert.strictEqual(list.length, 2);
}

async function existeVehiculoTest() {
  const repo = new RepositorioVehiculo();
  const v = await repo.crearVehiculo("X1", "Auto", 2, "d1");

  assert.strictEqual(await repo.existe(v.getId()), true);
  assert.strictEqual(await repo.existe(999), false);
}

async function actualizarVehiculoTest() {
  const repo = new RepositorioVehiculo();
  const v = await repo.crearVehiculo("OLD", "Auto", 2, "d1");

  const actualizado = await repo.actualizarVehiculo(v.getId(), "NEW", "Camion", 500, "d2");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getId(), v.getId());
}

async function eliminarVehiculoTest() {
  const repo = new RepositorioVehiculo();
  const v = await repo.crearVehiculo("DEL", "Auto", 2, "d1");

  assert.strictEqual(await repo.eliminarVehiculo(v.getId()), true);
  assert.strictEqual(await repo.existe(v.getId()), false);
  assert.strictEqual((await repo.obtenerVehiculos()).length, 0);
}

const pruebas = [
  ["Crear vehículo", crearVehiculoTest],
  ["Obtener vehículo por id", obtenerVehiculoPorIdTest],
  ["Obtener todos los vehículos", obtenerTodosLosVehiculosTest],
  ["Existe", existeVehiculoTest],
  ["Actualizar vehículo", actualizarVehiculoTest],
  ["Eliminar vehículo", eliminarVehiculoTest],
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
