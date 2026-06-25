import pool from './DatabaseConnection';

const DISPOSITIVOS = ['GPS-001', 'GPS-002', 'GPS-003', 'GPS-004'];

const VEHICULOS = [
  { matricula: 'ABC 1234', tipo: 'Auto',      capacidad: 4, gps: 'GPS-001' },
  { matricula: 'DEF 5678', tipo: 'Van',       capacidad: 8, gps: 'GPS-002' },
  { matricula: 'GHI 9012', tipo: 'Auto',      capacidad: 4, gps: 'GPS-003' },
  { matricula: 'JKL 3456', tipo: 'Camioneta', capacidad: 6, gps: 'GPS-004' },
];

export async function ejecutarSeed(): Promise<void> {
  try {
    for (const nombre of DISPOSITIVOS) {
      const existe = await pool.query('SELECT id FROM dispositivo_gps WHERE nombre = $1', [nombre]);
      if (existe.rows.length === 0) {
        await pool.query('INSERT INTO dispositivo_gps (nombre) VALUES ($1)', [nombre]);
      }
    }

    for (const v of VEHICULOS) {
      const existe = await pool.query('SELECT id FROM vehiculo WHERE matricula = $1', [v.matricula]);
      if (existe.rows.length === 0) {
        await pool.query(
          `INSERT INTO vehiculo (matricula, tipo, capacidad, dispositivo_gps, caracteristicas)
           VALUES ($1, $2, $3, $4, '{}')`,
          [v.matricula, v.tipo, v.capacidad, v.gps]
        );
      }
    }
  } catch {
    // seed no bloquea el arranque
  }
}
