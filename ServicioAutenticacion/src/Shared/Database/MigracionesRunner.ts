import pool from './DatabaseConnection';
import fs from 'fs';
import path from 'path';

async function ejecutarMigraciones() {
  try {
    console.log('Iniciando migraciones de ServicioAutenticacion...');

    const migracionesDir = path.join(__dirname, 'migrations');
    const archivos = fs.readdirSync(migracionesDir)
      .filter(archivo => archivo.endsWith('.sql'))
      .sort();

    for (const archivo of archivos) {
      const sql = fs.readFileSync(path.join(migracionesDir, archivo), 'utf-8');
      console.log(`Ejecutando: ${archivo}`);
      await pool.query(sql);
      console.log(`Completado: ${archivo}`);
    }

    console.log('Migraciones completadas');
  } catch (error) {
    console.error('Error en las migraciones:', error);
    throw error;
  }
}

if (require.main === module) {
  ejecutarMigraciones()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default ejecutarMigraciones;
