/**
 * Pattern: Priority Queue
 *
 * R1 define tres niveles de SLA para procesamiento de reservas:
 *   - 'alta'  → ClienteEmpresa frecuente (top 20 por semana) → < 600 ms
 *   - 'media' → ClienteEmpresa no frecuente                  → 700–1000 ms
 *   - 'baja'  → ClientePersonal (categorización por IA)      → 5–10 s
 *
 * Bajo carga concurrente, la cola garantiza que las tareas de prioridad 'alta'
 * se ejecuten antes que las de 'media', y estas antes que las de 'baja'.
 * El nivel de concurrencia controla cuántas tareas corren en paralelo.
 */

export type Prioridad = 'alta' | 'media' | 'baja';

interface ItemCola<T> {
  tarea:   () => Promise<T>;
  resolve: (value: T)        => void;
  reject:  (reason: unknown) => void;
}

export class ColaPrioridad<T> {
  private readonly colas: Record<Prioridad, ItemCola<T>[]> = {
    alta:  [],
    media: [],
    baja:  [],
  };
  private procesando = 0;

  constructor(private readonly concurrencia: number = 10) {}

  encolar(prioridad: Prioridad, tarea: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.colas[prioridad].push({ tarea, resolve, reject });
      this.procesar();
    });
  }

  private siguiente(): ItemCola<T> | undefined {
    return this.colas.alta.shift() ?? this.colas.media.shift() ?? this.colas.baja.shift();
  }

  private procesar(): void {
    if (this.procesando >= this.concurrencia) return;
    const item = this.siguiente();
    if (!item) return;

    this.procesando++;
    item.tarea()
      .then(item.resolve)
      .catch(item.reject)
      .finally(() => {
        this.procesando--;
        this.procesar();
      });
  }

  get pendientes(): number {
    return this.colas.alta.length + this.colas.media.length + this.colas.baja.length;
  }
}

// Instancia singleton para reservas — compartida por todos los controladores
export const colaReservas = new ColaPrioridad<any>(10);
