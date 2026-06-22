import { EventEmitter } from 'events';

export const busEventos = new EventEmitter();
busEventos.setMaxListeners(50);

export const EVENTO_RESERVA_CREADA        = 'reserva:creada';
export const EVENTO_RESERVA_NO_RECONOCIDA = 'reserva:no-reconocida';

export interface PayloadReservaCreada {
  reservaId: string;
  clienteId: string;
  productosIds: number[];
}

export interface PayloadReservaNoReconocida {
  reservaId: string;
  clienteId: string;
  descripcionesBienes: string[];
  resultadosClasificacion: ResultadoClasificacion[];
  timestamp: string;
}

export interface ResultadoClasificacion {
  metodo: 'keyword' | 'tfidf' | 'ia-generativa';
  categoria: string | null;
  confianza: number;
  tiempoMs: number;
  error?: string;
}
