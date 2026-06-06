import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

/**
 * Pool de conexión a PostgreSQL
 * 
 * ¿Qué es un Pool?
 * Es un conjunto de conexiones reutilizables a la base de datos.
 * En lugar de crear una nueva conexión cada vez que necesites hablar con la BD,
 * reutilizas las conexiones existentes. Esto es más eficiente.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Manejo de errores de conexión
 * Si la BD se desconecta inesperadamente, registramos el error
 */
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});

export default pool;
