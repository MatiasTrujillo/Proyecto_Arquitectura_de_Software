import { Request } from 'express';

export interface SolicitudAuth extends Request {
  usuario: { cedula: string; rol: string };
}
