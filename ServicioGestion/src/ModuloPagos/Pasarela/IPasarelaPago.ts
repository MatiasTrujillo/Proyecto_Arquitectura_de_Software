export interface ResultadoPago {
  estado: 'aceptado' | 'rechazado' | 'pendiente';
  transaccionId: string;
}

export interface IPasarelaPago {
  procesarPago(monto: number, reservaId: string, metodoPago: string): Promise<ResultadoPago>;
}
