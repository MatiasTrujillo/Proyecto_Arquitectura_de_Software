import pool from '../Shared/Database/DatabaseConnection';

export async function calcularCosto(categorias: string[]): Promise<number> {
  const base = Math.floor(Math.random() * 801) + 200; // 200-1000

  if (!categorias || categorias.length === 0) return base;

  // Buscar el mayor recargo entre las reglas de las categorías asignadas
  const res = await pool.query(
    `SELECT MAX(rc.recargo_porcentaje) AS max_recargo
     FROM regla_categoria rc
     JOIN categoria c ON c.id = rc.categoria_id
     WHERE c.nombre = ANY($1) OR c.nombre_es = ANY($1)`,
    [categorias]
  );

  const recargo = Number(res.rows[0]?.max_recargo ?? 0);
  return Math.round(base * (1 + recargo / 100));
}
