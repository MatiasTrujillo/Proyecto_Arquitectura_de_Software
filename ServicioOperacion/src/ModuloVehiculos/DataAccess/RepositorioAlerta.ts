import pool from '../../Shared/Database/DatabaseConnection';

export interface NuevaAlerta {
  tipo: 'zona_roja' | 'detencion_prolongada';
  descripcion: string;
  vehiculoMatricula?: string;
  dispositivoId?: number;
  lat?: number;
  lng?: number;
}

export class RepositorioAlerta {
  async guardar(alerta: NuevaAlerta): Promise<void> {
    await pool.query(
      `INSERT INTO alerta (tipo, descripcion, vehiculo_matricula, dispositivo_id, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        alerta.tipo,
        alerta.descripcion,
        alerta.vehiculoMatricula ?? null,
        alerta.dispositivoId ?? null,
        alerta.lat ?? null,
        alerta.lng ?? null,
      ]
    );
  }

  async obtenerPorVehiculo(matricula: string): Promise<any[]> {
    const res = await pool.query(
      `SELECT id, tipo, descripcion, vehiculo_matricula, lat, lng, timestamp
       FROM alerta WHERE vehiculo_matricula = $1
       ORDER BY timestamp DESC`,
      [matricula]
    );
    return res.rows;
  }
}
