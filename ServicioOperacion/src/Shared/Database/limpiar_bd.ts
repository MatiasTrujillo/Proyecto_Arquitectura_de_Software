import pool from './DatabaseConnection';

export async function limpiar() {
  try {
    await pool.query('TRUNCATE TABLE vehiculo, dispositivo_gps RESTART IDENTITY CASCADE');
  } catch (error) {
    console.error('Error limpiando tablas:', error);
    throw error;
  }
}

if (require.main === module) {
  (async () => {
    try {
      console.log('Limpiando tablas de prueba...');
      await limpiar();
      console.log('Tablas limpiadas.');
      process.exit(0);
    } catch (err) {
      process.exit(1);
    }
  })();
}
