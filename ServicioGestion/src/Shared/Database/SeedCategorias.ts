import * as fs from 'fs';
import * as path from 'path';
import pool from './DatabaseConnection';

export async function seedCategorias(): Promise<void> {
  try {
    const csvPath = path.join(process.cwd(), 'product-categories(in).csv');
    if (!fs.existsSync(csvPath)) {
      console.log('CSV de categorías no encontrado, omitiendo seed');
      return;
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').slice(1); // skip header

    let insertadas = 0;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Remove outer wrapping quote and trailing ;; or ";
      const inner = line.replace(/^"/, '').replace(/"[;]*$/, '');

      // Split only on first 3 commas
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
        'INSERT INTO categoria (nombre, nombre_es, descripcion) VALUES ($1, $2, $3) ON CONFLICT (nombre) DO NOTHING',
        [nombre, nombreEs, descripcion || null]
      );
      insertadas++;
    }

    console.log(`Seed categorías: ${insertadas} filas procesadas desde CSV`);
  } catch (e) {
    console.error('Error en seed de categorías:', e);
  }
}
