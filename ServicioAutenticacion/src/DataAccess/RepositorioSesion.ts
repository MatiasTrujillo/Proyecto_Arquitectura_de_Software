import pool from '../Shared/Database/DatabaseConnection';

export class RepositorioSesion {
  async revocar(token: string, cedula: string, expiraEn: Date): Promise<void> {
    await pool.query(
      `INSERT INTO tokens_revocados (token, cedula, expira_en)
       VALUES ($1, $2, $3)
       ON CONFLICT (token) DO NOTHING`,
      [token, cedula, expiraEn]
    );
  }

  async estaRevocado(token: string): Promise<boolean> {
    const res = await pool.query(
      'SELECT 1 FROM tokens_revocados WHERE token = $1 AND expira_en > NOW()',
      [token]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
