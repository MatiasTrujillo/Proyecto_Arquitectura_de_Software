import * as fs from 'fs';
import * as path from 'path';
import pool from './DatabaseConnection';

export async function seedCategorias(): Promise<void> {
  try {
    const csvPath = path.join(process.cwd(), 'product-categories(in).csv');
    if (!fs.existsSync(csvPath)) return;

    // El CSV está en ISO-8859-1; releer como latin1→utf8 evita el mojibake
    const rawContent = fs.readFileSync(csvPath, 'latin1');
    const content = Buffer.from(rawContent, 'latin1').toString('utf8');
    const lines = content.split('\n').slice(1);

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const inner = line.replace(/^"/, '').replace(/"[;]*$/, '');

      // Remove outer wrapping quote and trailing ;; or ";
      const first  = inner.indexOf(',');
      const second = inner.indexOf(',', first + 1);
      const third  = inner.indexOf(',', second + 1);
      if (first < 0 || second < 0 || third < 0) continue;

      const nombre   = inner.substring(first + 1, second).trim();
      const nombreEs = inner.substring(second + 1, third).trim();
      const descripcion = inner.substring(third + 1).trim()
        .replace(/^""/, '').replace(/""[;]*$/, '').replace(/""/g, '"');

      if (!nombre || !nombreEs) continue;

      await pool.query(
        `INSERT INTO categoria (nombre, nombre_es, descripcion) VALUES ($1, $2, $3)
         ON CONFLICT (nombre) DO UPDATE SET nombre_es = EXCLUDED.nombre_es, descripcion = EXCLUDED.descripcion`,
        [nombre, nombreEs, descripcion || null]
      );
    }
  } catch {
    // seed no bloquea el arranque
  }
}
