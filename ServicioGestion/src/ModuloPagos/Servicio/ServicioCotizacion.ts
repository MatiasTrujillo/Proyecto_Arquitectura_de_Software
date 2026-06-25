import pool from '../../Shared/Database/DatabaseConnection';

export interface DesgloseCosto {
  total: number;
  base: number;
  recargo: number;
  porcentaje: number;
  categoriaAplicada: string | null;
}

export async function calcularCostoConDesglose(categorias: string[]): Promise<DesgloseCosto> {
  const base = Math.floor(Math.random() * 801) + 200; // 200-1000

  if (!categorias || categorias.length === 0) {
    return { total: base, base, recargo: 0, porcentaje: 0, categoriaAplicada: null };
  }

  const res = await pool.query(
    `SELECT rc.recargo_porcentaje, c.nombre_es AS categoria
     FROM regla_categoria rc
     JOIN categoria c ON c.id = rc.categoria_id
     WHERE c.nombre = ANY($1) OR c.nombre_es = ANY($1)
     ORDER BY rc.recargo_porcentaje DESC
     LIMIT 1`,
    [categorias]
  );

  const porcentaje  = Number(res.rows[0]?.recargo_porcentaje ?? 0);
  const categoria   = res.rows[0]?.categoria ?? null;
  const recargo     = Math.round(base * porcentaje / 100);
  return { total: base + recargo, base, recargo, porcentaje, categoriaAplicada: categoria };
}

export async function calcularCosto(categorias: string[]): Promise<number> {
  return (await calcularCostoConDesglose(categorias)).total;
}
