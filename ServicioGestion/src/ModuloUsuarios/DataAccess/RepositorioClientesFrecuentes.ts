import pool from '../../Shared/Database/DatabaseConnection';
import { Prioridad } from '../../ModuloReservas/WebApi/Cola/ColaPrioridad';

export class RepositorioClientesFrecuentes {
  /**
   * Recalcula los 20 clientes empresa con más reservas en los últimos 7 días
   * y actualiza el flag es_frecuente. Ejecutar semanalmente.
   */
  async actualizarTop20(): Promise<number> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query('UPDATE cliente_empresa SET es_frecuente = false');

      const res = await client.query(`
        UPDATE cliente_empresa
        SET es_frecuente = true
        WHERE cedula IN (
          SELECT r.cliente
          FROM reserva r
          WHERE r.fecha >= NOW() - INTERVAL '7 days'
          GROUP BY r.cliente
          ORDER BY COUNT(*) DESC
          LIMIT 20
        )
        RETURNING cedula
      `);

      await client.query('COMMIT');
      return res.rowCount ?? 0;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Determina la prioridad de un cliente dado su cedula:
   *   - 'alta'  → cliente_empresa con es_frecuente = true
   *   - 'media' → cliente_empresa no frecuente
   *   - 'baja'  → cliente_personal (o desconocido)
   */
  async determinarPrioridad(cedula: string): Promise<Prioridad> {
    const res = await pool.query(
      `SELECT es_frecuente FROM cliente_empresa WHERE cedula = $1`,
      [cedula]
    );
    if (res.rows.length === 0) return 'baja';
    return res.rows[0].es_frecuente ? 'alta' : 'media';
  }
}
