import assert from "assert";
import pool from "../../src/Shared/Database/DatabaseConnection";
import { RepositorioIncidente } from "../../src/ModuloReservas/DataAccess/RepositorioIncidente";

async function limpiarBD() {
  await pool.query('DELETE FROM incidente');
  await pool.query('ALTER SEQUENCE incidente_id_seq RESTART WITH 1');
}

async function crearIncidenteTest() {
  const repo = new RepositorioIncidente();
  const incidente = await repo.crearIncidente("Desc", new Date("2026-01-01"), "R1", "Abierto", "Alta", "");

  assert.strictEqual(incidente.getId(), "1");
  assert.strictEqual(incidente.getDescripcion(), "Desc");
  assert.strictEqual(incidente.getFecha().toISOString(), new Date("2026-01-01").toISOString());
  assert.strictEqual(incidente.getReservaId(), "R1");
  assert.strictEqual(incidente.getEstado(), "Abierto");
  assert.strictEqual(incidente.getSeveridad(), "Alta");
}

async function obtenerIncidentePorIdTest() {
  const repo = new RepositorioIncidente();
  const incidente = await repo.crearIncidente("X", new Date("2026-02-01"), "R2", "Cerrado", "Baja", "");

  const encontrado = await repo.obtenerIncidentePorId(incidente.getId());
  assert.ok(encontrado);
  assert.strictEqual(encontrado?.getDescripcion(), "X");
  assert.strictEqual(await repo.obtenerIncidentePorId("999"), undefined);
}

async function obtenerTodosLosIncidentesTest() {
  const repo = new RepositorioIncidente();
  await repo.crearIncidente("A", new Date("2026-03-01"), "R3", "Abierto", "Media", "");
  await repo.crearIncidente("B", new Date("2026-03-02"), "R4", "Abierto", "Baja", "");

  const incidentes = await repo.obtenerIncidentes();
  assert.strictEqual(incidentes.length, 2);
  assert.ok(incidentes.some(i => i.getDescripcion() === "A"));
  assert.ok(incidentes.some(i => i.getDescripcion() === "B"));
}

async function existeIncidenteTest() {
  const repo = new RepositorioIncidente();
  const incidente = await repo.crearIncidente("E", new Date("2026-04-01"), "R5", "Abierto", "Alta", "");

  assert.strictEqual(await repo.existe(incidente.getId()), true);
  assert.strictEqual(await repo.existe("999"), false);
}

async function actualizarIncidenteTest() {
  const repo = new RepositorioIncidente();
  const incidente = await repo.crearIncidente("Old", new Date("2026-05-01"), "R6", "Abierto", "Baja", "");

  const actualizado = await repo.actualizarIncidente(incidente.getId(), "New", new Date("2026-05-02"), "R6", "Cerrado", "Alta", "");
  assert.ok(actualizado);
  assert.strictEqual(actualizado?.getDescripcion(), "New");
  assert.strictEqual(actualizado?.getEstado(), "Cerrado");
  assert.strictEqual(actualizado?.getSeveridad(), "Alta");
}

async function eliminarIncidenteTest() {
  const repo = new RepositorioIncidente();
  const incidente = await repo.crearIncidente("ToDel", new Date("2026-07-01"), "R7", "Abierto", "Media", "");

  assert.strictEqual(await repo.eliminarIncidente(incidente.getId()), true);
  assert.strictEqual(await repo.existe(incidente.getId()), false);
  assert.strictEqual((await repo.obtenerIncidentes()).length, 0);
}

const pruebas = [
  ["Crear incidente", crearIncidenteTest],
  ["Obtener incidente por id", obtenerIncidentePorIdTest],
  ["Obtener todos los incidentes", obtenerTodosLosIncidentesTest],
  ["Existe", existeIncidenteTest],
  ["Actualizar incidente", actualizarIncidenteTest],
  ["Eliminar incidente", eliminarIncidenteTest],
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
