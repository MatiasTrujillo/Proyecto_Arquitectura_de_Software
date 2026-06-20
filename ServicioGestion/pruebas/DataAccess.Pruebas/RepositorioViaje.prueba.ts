import assert from "assert";
import pool from "../../src/Shared/Database/DatabaseConnection";
import { RepositorioViaje } from "../../src/ModuloReservas/DataAccess/RepositorioViaje";

async function limpiarBD() {
  await pool.query('DELETE FROM viaje');
  await pool.query('ALTER SEQUENCE viaje_id_seq RESTART WITH 1');
}

async function crearViajeTest() {
  const repo = new RepositorioViaje();
  const viaje = await repo.crearViaje("R1", "Origen", "Destino", new Date("2026-01-01"), "Programado", "C1", "");

  assert.strictEqual(viaje.getId(), "1");
  assert.strictEqual(viaje.getReservaId(), "R1");
  assert.strictEqual(viaje.getOrigen(), "Origen");
  assert.strictEqual(viaje.getDestino(), "Destino");
  assert.strictEqual(viaje.getFecha().toISOString(), new Date("2026-01-01").toISOString());
  assert.strictEqual(viaje.getEstado(), "Programado");
  assert.strictEqual(viaje.getConductor(), "C1");
}

async function obtenerViajePorIdTest() {
  const repo = new RepositorioViaje();
  const viaje = await repo.crearViaje("R2", "O", "D", new Date("2026-02-01"), "EnCurso", "C2", "");

  const encontrado = await repo.obtenerViajePorId(viaje.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getOrigen(), "O");
  assert.strictEqual(await repo.obtenerViajePorId("999"), undefined);
}

async function obtenerTodosLosViajesTest() {
  const repo = new RepositorioViaje();
  await repo.crearViaje("R3", "A", "B", new Date("2026-03-01"), "X", "C", "");
  await repo.crearViaje("R4", "A2", "B2", new Date("2026-03-02"), "Y", "C", "");

  const viajes = await repo.obtenerViajes();
  assert.strictEqual(viajes.length, 2);
  assert.ok(viajes.some(v => v.getOrigen() === "A"));
  assert.ok(viajes.some(v => v.getOrigen() === "A2"));
}

async function existeViajeTest() {
  const repo = new RepositorioViaje();
  const viaje = await repo.crearViaje("R5", "X", "Y", new Date("2026-04-01"), "Z", "C", "");

  assert.strictEqual(await repo.existe(viaje.getId()), true);
  assert.strictEqual(await repo.existe("999"), false);
}

async function actualizarViajeTest() {
  const repo = new RepositorioViaje();
  const viaje = await repo.crearViaje("R6", "OldOrigin", "OldDest", new Date("2026-05-01"), "Old", "C", "");

  const actualizado = await repo.actualizarViaje(viaje.getId(), "R6", "NewOrigin", "NewDest", new Date("2026-05-02"), "Nuevo", "Cnew", "");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getOrigen(), "NewOrigin");
  assert.strictEqual(actualizado?.getDestino(), "NewDest");
  assert.strictEqual(actualizado?.getEstado(), "Nuevo");
}

async function eliminarViajeTest() {
  const repo = new RepositorioViaje();
  const viaje = await repo.crearViaje("R7", "ToDel", "ToDel", new Date("2026-07-01"), "S", "C", "");

  assert.strictEqual(await repo.eliminarViaje(viaje.getId()), true);
  assert.strictEqual(await repo.existe(viaje.getId()), false);
  assert.strictEqual((await repo.obtenerViajes()).length, 0);
}

const pruebas = [
  ["Crear viaje", crearViajeTest],
  ["Obtener viaje por id", obtenerViajePorIdTest],
  ["Obtener todos los viajes", obtenerTodosLosViajesTest],
  ["Existe", existeViajeTest],
  ["Actualizar viaje", actualizarViajeTest],
  ["Eliminar viaje", eliminarViajeTest],
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
