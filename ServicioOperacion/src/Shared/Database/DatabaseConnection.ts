import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import registrador from '../Logging/logger';
import { contadorConsultasBd, histogramaDuracionConsultasBd } from '../Metrics/metrics';

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
  registrador.error('error_pool_bd', { mensaje: err?.message || err, pila: err?.stack });
});

const originalQuery = pool.query.bind(pool);

(pool as any).query = async function (text: string, params?: any[]) {
  const endTimer = histogramaDuracionConsultasBd.startTimer();
  contadorConsultasBd.inc();
  try {
    const result: QueryResult<any> = await originalQuery(text, params);
    endTimer();
    registrador.info('consulta_bd', { texto: text, parametros: params, cantidadFilas: result.rowCount });
    return result;
  } catch (error) {
    endTimer();
    registrador.error('error_consulta_bd', { texto: text, parametros: params, mensaje: error?.message || error, pila: error?.stack });
    throw error;
  }
};

export default pool;
