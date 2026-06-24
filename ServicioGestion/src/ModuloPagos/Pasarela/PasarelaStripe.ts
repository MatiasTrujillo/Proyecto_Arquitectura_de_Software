import Stripe from 'stripe';
import { IPasarelaPago, ResultadoPago } from './IPasarelaPago';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? '';
const STRIPE_ENABLED    = process.env.STRIPE_ENABLED !== 'false';

export class PasarelaStripe implements IPasarelaPago {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(STRIPE_SECRET_KEY);
  }

  async procesarPago(monto: number, reservaId: string, metodoPago: string): Promise<ResultadoPago> {
    if (!STRIPE_ENABLED) {
      throw new Error('Pasarela de pago fuera de servicio');
    }
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Pasarela de pago no configurada (STRIPE_SECRET_KEY ausente)');
    }

    try {
      const intent = await this.stripe.paymentIntents.create({
        amount:         Math.round(monto * 100),
        currency:       'usd',
        payment_method: metodoPago,
        confirm:        true,
        return_url:     'http://localhost:3001',
        metadata:       { reservaId },
      });

      return { estado: this.mapearEstado(intent.status), transaccionId: intent.id };

    } catch (err: any) {
      // Tarjeta rechazada: Stripe lanza StripeCardError con decline_code
      if (err?.type === 'StripeCardError') {
        const id = err?.payment_intent?.id ?? `stripe_err_${Date.now()}`;
        return { estado: 'rechazado', transaccionId: id };
      }
      // Cualquier otro error de Stripe (red, autenticación, etc.) → fuera de servicio
      throw new Error(`Pasarela de pago fuera de servicio: ${err?.message ?? String(err)}`);
    }
  }

  private mapearEstado(status: Stripe.PaymentIntent['status']): ResultadoPago['estado'] {
    switch (status) {
      case 'succeeded':               return 'aceptado';
      case 'requires_payment_method': return 'rechazado';
      case 'processing':
      case 'requires_action':
      case 'requires_confirmation':   return 'pendiente';
      default:                        return 'pendiente';
    }
  }
}
