import pool from './DatabaseConnection';
import fs from 'fs';
import path from 'path';

/**
 * Ejecuta todas las migraciones SQL
 * Las migraciones son scripts que preparan la estructura de la base de datos
 */
async function ejecutarMigraciones() {
  try {
    console.log('🔄 Iniciando migraciones de base de datos...');
    
    // Obtenemos la ruta de la carpeta de migraciones
    const migracionesDir = path.join(__dirname, 'migrations');
    
    // Leemos todos los archivos SQL ordenados por nombre
    const archivos = fs.readdirSync(migracionesDir)
      .filter(archivo => archivo.endsWith('.sql'))
      .sort();

    // Ejecutamos cada migración
    for (const archivo of archivos) {
      const rutaArchivo = path.join(migracionesDir, archivo);
      const sql = fs.readFileSync(rutaArchivo, 'utf-8');
      
      console.log(`⏳ Ejecutando: ${archivo}`);
      await pool.query(sql);
      console.log(`✅ Completado: ${archivo}`);
    }

    console.log('✨ Migraciones completadas exitosamente');
  } catch (error) {
    console.error('❌ Error en las migraciones:', error);
    throw error;
  }
}

// Si se ejecuta directamente (no como importación), ejecutar migraciones
if (require.main === module) {
  ejecutarMigraciones()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default ejecutarMigraciones;
