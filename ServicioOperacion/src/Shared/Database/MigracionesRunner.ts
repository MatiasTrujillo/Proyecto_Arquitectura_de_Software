import pool from './DatabaseConnection';
import fs from 'fs';
import path from 'path';

async function ejecutarMigraciones() {
  try {
    const migracionesDir = path.join(__dirname, 'migrations');
    const archivos = fs.readdirSync(migracionesDir)
      .filter(archivo => archivo.endsWith('.sql'))
      .sort();

    for (const archivo of archivos) {
      const sql = fs.readFileSync(path.join(migracionesDir, archivo), 'utf-8');
      await pool.query(sql);
    }
  } catch (error) {
    throw error;
  }
}

if (require.main === module) {
  ejecutarMigraciones()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default ejecutarMigraciones;
