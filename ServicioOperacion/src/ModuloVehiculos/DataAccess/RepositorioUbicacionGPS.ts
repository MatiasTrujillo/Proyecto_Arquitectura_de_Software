import pool from '../../Shared/Database/DatabaseConnection';

export interface UbicacionGPS {
  dispositivoId: number;
  vehiculoMatricula?: string;
  lat: number;
  lng: number;
  velocidad?: number;
}

export class RepositorioUbicacionGPS {
  async guardar(u: UbicacionGPS): Promise<void> {
    await pool.query(
      `INSERT INTO ubicacion_gps (dispositivo_id, vehiculo_matricula, lat, lng, velocidad)
       VALUES ($1, $2, $3, $4, $5)`,
      [u.dispositivoId, u.vehiculoMatricula ?? null, u.lat, u.lng, u.velocidad ?? 0]
    );
  }

  async obtenerUltimas(dispositivoId: number, cantidad: number): Promise<{ lat: number; lng: number; velocidad: number; timestamp: Date }[]> {
    const res = await pool.query(
      `SELECT lat, lng, velocidad, timestamp
       FROM ubicacion_gps
       WHERE dispositivo_id = $1
       ORDER BY timestamp DESC
       LIMIT $2`,
      [dispositivoId, cantidad]
    );
    return res.rows.map((r: any) => ({
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lng),
      velocidad: parseFloat(r.velocidad),
      timestamp: r.timestamp,
    }));
  }

  async obtenerUltima(dispositivoId: number): Promise<{ lat: number; lng: number; timestamp: Date } | null> {
    const res = await pool.query(
      `SELECT lat, lng, timestamp FROM ubicacion_gps
       WHERE dispositivo_id = $1
       ORDER BY timestamp DESC LIMIT 1`,
      [dispositivoId]
    );
    if (!res.rows[0]) return null;
    return { lat: parseFloat(res.rows[0].lat), lng: parseFloat(res.rows[0].lng), timestamp: res.rows[0].timestamp };
  }

  async obtenerUltimaByMatricula(matricula: string): Promise<{ lat: number; lng: number; velocidad: number; timestamp: Date } | null> {
    const res = await pool.query(
      `SELECT lat, lng, velocidad, timestamp FROM ubicacion_gps
       WHERE vehiculo_matricula = $1
       ORDER BY timestamp DESC LIMIT 1`,
      [matricula]
    );
    if (!res.rows[0]) return null;
    return {
      lat: parseFloat(res.rows[0].lat),
      lng: parseFloat(res.rows[0].lng),
      velocidad: parseFloat(res.rows[0].velocidad),
      timestamp: res.rows[0].timestamp,
    };
  }
}
