import pool from '../../Shared/Database/DatabaseConnection';
import { ResultadoClasificacion } from '../../Shared/Eventos/BusEventos';

const OLLAMA_URL        = process.env.OLLAMA_URL    || 'http://localhost:11434';
const OLLAMA_MODEL      = process.env.OLLAMA_MODEL  || 'tinyllama';
const OLLAMA_TIMEOUT_MS = 8000;

interface Categoria { nombre: string; nombreEs: string; descripcion: string | null }

async function cargarCategorias(): Promise<Categoria[]> {
  const res = await pool.query('SELECT nombre, nombre_es, descripcion FROM categoria');
  return res.rows.map((r: any) => ({ nombre: r.nombre, nombreEs: r.nombre_es, descripcion: r.descripcion }));
}

// Quita plurales comunes (mesas→mesa, sillas→silla)
function stemEsp(w: string): string {
  if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s')) return w.slice(0, -1);
  return w;
}

function tokenizar(texto: string): Set<string> {
  return new Set(
    texto.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita tildes
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2)
      .map(stemEsp)
      .filter(w => w.length > 2)
  );
}

export async function clasificarConKeyword(descripcion: string): Promise<ResultadoClasificacion> {
  const t0 = Date.now();
  try {
    const categorias = await cargarCategorias();
    const tokens = tokenizar(descripcion);
    let mejorScore = 0;
    let mejorCategoria: string | null = null;

    for (const cat of categorias) {
      const textoCategoria = `${cat.nombre} ${cat.nombreEs} ${cat.descripcion ?? ''}`;
      const tokensCat = tokenizar(textoCategoria);
      let score = 0;
      for (const t of tokens) if (tokensCat.has(t)) score++;
      if (score > mejorScore) { mejorScore = score; mejorCategoria = cat.nombreEs; }
    }

    const confianza = mejorScore > 0 ? Math.min(mejorScore / tokens.size, 1) : 0;
    return {
      metodo: 'keyword',
      categoria: confianza >= 0.3 ? mejorCategoria : null,
      confianza,
      tiempoMs: Date.now() - t0,
    };
  } catch (e) {
    return { metodo: 'keyword', categoria: null, confianza: 0, tiempoMs: Date.now() - t0, error: String(e) };
  }
}

function buildIDF(docs: string[][]): Map<string, number> {
  const N = docs.length;
  const df = new Map<string, number>();
  for (const doc of docs) {
    for (const t of new Set(doc)) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [t, count] of df) idf.set(t, Math.log((N + 1) / (count + 1)) + 1); // suavizado IDF
  return idf;
}

function buildTFIDF(tokens: string[], idf: Map<string, number>): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  const vec = new Map<string, number>();
  for (const [t, freq] of tf) {
    vec.set(t, (freq / tokens.length) * (idf.get(t) ?? 0));
  }
  return vec;
}

function coseno(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, na = 0, nb = 0;
  for (const [t, va] of a) { dot += va * (b.get(t) ?? 0); na += va * va; }
  for (const [, vb] of b) nb += vb * vb;
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

export async function clasificarConTFIDF(descripcion: string): Promise<ResultadoClasificacion> {
  const t0 = Date.now();
  try {
    const categorias = await cargarCategorias();
    const docs = categorias.map(c =>
      Array.from(tokenizar(`${c.nombre} ${c.nombreEs} ${c.descripcion ?? ''}`))
    );

    const idf = buildIDF(docs);
    const queryVec = buildTFIDF(Array.from(tokenizar(descripcion)), idf);

    let mejorScore = 0;
    let mejorCategoria: string | null = null;

    categorias.forEach((cat, i) => {
      const score = coseno(queryVec, buildTFIDF(docs[i], idf));
      if (score > mejorScore) { mejorScore = score; mejorCategoria = cat.nombreEs; }
    });

    return {
      metodo: 'tfidf',
      categoria: mejorScore >= 0.15 ? mejorCategoria : null,
      confianza: mejorScore,
      tiempoMs: Date.now() - t0,
    };
  } catch (e) {
    return { metodo: 'tfidf', categoria: null, confianza: 0, tiempoMs: Date.now() - t0, error: String(e) };
  }
}

export async function clasificarConIA(descripcion: string): Promise<ResultadoClasificacion> {
  const t0 = Date.now();
  try {
    const categorias = await cargarCategorias();
    const listaCats = categorias.map(c => c.nombreEs).join(', ');

    const prompt =
      `Tenés las siguientes categorías de bienes: ${listaCats}.\n` +
      `Un cliente quiere transportar: "${descripcion}".\n` +
      `Respondé SOLO con el nombre exacto de la categoría más apropiada de la lista, o "sin_categoria" si ninguna aplica.`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

    const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!resp.ok) throw new Error(`Ollama HTTP ${resp.status}`);
    const json = await resp.json() as any;
    const respuesta = (json.response ?? '').trim().toLowerCase();

    const match = categorias.find(c =>
      respuesta.includes(c.nombreEs.toLowerCase()) || respuesta.includes(c.nombre.toLowerCase())
    );

    return {
      metodo: 'ia-generativa',
      categoria: match ? match.nombreEs : null,
      confianza: match ? 0.9 : 0,
      tiempoMs: Date.now() - t0,
    };
  } catch (e: any) {
    const esTimeout = e?.name === 'AbortError' || String(e).includes('abort');
    return {
      metodo: 'ia-generativa',
      categoria: null,
      confianza: 0,
      tiempoMs: Date.now() - t0,
      error: esTimeout ? 'Timeout (Ollama no disponible)' : String(e),
    };
  }
}

export async function compararMetodos(descripcion: string): Promise<ResultadoClasificacion[]> {
  return Promise.all([
    clasificarConKeyword(descripcion),
    clasificarConTFIDF(descripcion),
    clasificarConIA(descripcion),
  ]);
}
