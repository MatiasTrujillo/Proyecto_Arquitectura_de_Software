// Tres niveles de prioridad para SLA de reservas:
//   alta  → ClienteEmpresa frecuente (top 20)
//   media → ClienteEmpresa no frecuente
//   baja  → ClientePersonal

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

export const colaReservas = new ColaPrioridad<any>(10);
