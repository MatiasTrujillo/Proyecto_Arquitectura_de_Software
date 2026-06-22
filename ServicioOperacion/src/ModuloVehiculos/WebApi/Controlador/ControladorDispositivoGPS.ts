import { Request, Response } from 'express';
import { ServicioDispositivoGPS } from '../../Servicio/ServicioDispositivoGPS';
import { RepositorioDispositivoGPS } from '../../DataAccess/RepositorioDispositivoGPS';
import { IServicioDispositivoGPS } from '../../IServicio/IServicioDispositivoGPS';
import { RepositorioUbicacionGPS } from '../../DataAccess/RepositorioUbicacionGPS';
import { RepositorioAlerta } from '../../DataAccess/RepositorioAlerta';
import { pointInPolygon, distanciaMetros } from '../../../Shared/Utils/geoUtils';
import { RepositorioVehiculo } from '../../DataAccess/RepositorioVehiculo';

const GESTION_URL = process.env.GESTION_URL || 'http://localhost:3001';

export class ControladorDispositivoGPS {
  private servicio: IServicioDispositivoGPS;
  private repoDispositivo: RepositorioDispositivoGPS;
  private repoUbicacion: RepositorioUbicacionGPS;
  private repoAlerta: RepositorioAlerta;

  constructor(servicio?: IServicioDispositivoGPS) {
    this.servicio = servicio ?? new ServicioDispositivoGPS(new RepositorioDispositivoGPS());
    this.repoDispositivo = new RepositorioDispositivoGPS();
    this.repoUbicacion = new RepositorioUbicacionGPS();
    this.repoAlerta = new RepositorioAlerta();
  }

  async crearDispositivoGPS(req: Request, res: Response): Promise<void> {
    try {
      const { nombre } = req.body;
      const dispositivoDTO = await this.servicio.crearDispositivoGPS(nombre);
      res.status(201).json({ data: dispositivoDTO });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerDispositivoGPS(req: Request, res: Response): Promise<void> {
    try {
      const dispositivos = await this.servicio.obtenerDispositivosGPS();
      res.status(200).json({ data: dispositivos });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async obtenerDispositivoGPSPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dispositivo = await this.servicio.obtenerDispositivoGPSPorId(Number(id));
      res.status(200).json({ data: dispositivo });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async actualizarDispositivoGPS(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      const dispositivoDTO = await this.servicio.actualizarDispositivoGPS(Number(id), nombre);
      res.status(200).json({ data: dispositivoDTO });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  async eliminarDispositivoGPS(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.servicio.eliminarDispositivoGPS(Number(id));
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  // F14 + F15 + F16
  async recibirInformacion(req: Request, res: Response): Promise<void> {
    try {
      const { dispositivoId, vehiculoMatricula, lat, lng, velocidad } = req.body;

      if (!dispositivoId || lat === undefined || lng === undefined) {
        res.status(400).json({ error: 'Faltan campos requeridos: dispositivoId, lat, lng' });
        return;
      }

      const idNum = Number(dispositivoId);
      const latNum = Number(lat);
      const lngNum = Number(lng);
      const velNum = Number(velocidad ?? 0);

      // F14: Verificar que el dispositivo esté registrado
      const existe = await this.repoDispositivo.existe(idNum);
      if (!existe) {
        res.status(404).json({ error: `Dispositivo ${dispositivoId} no está registrado` });
        return;
      }

      // Auto-detectar el vehículo asociado al dispositivo GPS
      let matriculaResuelta: string | undefined = vehiculoMatricula ?? undefined;
      if (!matriculaResuelta) {
        try {
          const repoVehiculo = new RepositorioVehiculo();
          const vehiculo = await repoVehiculo.obtenerPorDispositivoGps(String(idNum));
          matriculaResuelta = vehiculo?.getMatricula() ?? undefined;
        } catch {}
      }

      // Guardar posición
      await this.repoUbicacion.guardar({
        dispositivoId: idNum,
        vehiculoMatricula: matriculaResuelta,
        lat: latNum,
        lng: lngNum,
        velocidad: velNum,
      });

      const alertasGeneradas: string[] = [];

      // F15: Detectar detención prolongada (últimas 6 lecturas ≈ 60 segundos)
      const ultimas = await this.repoUbicacion.obtenerUltimas(idNum, 6);
      if (ultimas.length >= 6) {
        const todasLentas = ultimas.every(p => p.velocidad < 2);
        const referencia = ultimas[ultimas.length - 1];
        const dist = distanciaMetros(latNum, lngNum, referencia.lat, referencia.lng);
        if (todasLentas && dist < 50) {
          await this.repoAlerta.guardar({
            tipo: 'detencion_prolongada',
            descripcion: `Vehículo detenido más de 60 segundos cerca de (${latNum.toFixed(5)}, ${lngNum.toFixed(5)})`,
            vehiculoMatricula,
            dispositivoId: idNum,
            lat: latNum,
            lng: lngNum,
          });
          alertasGeneradas.push('detencion_prolongada');
          if (vehiculoMatricula) await this.notificarAlertaGestion(vehiculoMatricula);
        }
      }

      // F15: Detectar ingreso a zona roja
      try {
        const respZonas = await fetch(`${GESTION_URL}/internal/zonas-geograficas`);
        if (respZonas.ok) {
          const zonas: any[] = await respZonas.json();
          const rojasCount = zonas.filter((z: any) => z.tipo === 'roja').length;
          console.log(`[GPS] Zonas recibidas: ${zonas.length}, zonas rojas: ${rojasCount}, punto: (${latNum},${lngNum})`);
          for (const zona of zonas.filter((z: any) => z.tipo === 'roja')) {
            try {
              const poligono: [number, number][] = JSON.parse(zona.delimitacion);
              const dentro = pointInPolygon(latNum, lngNum, poligono);
              console.log(`[GPS] Zona "${zona.nombre}" (${zona.tipo}): dentro=${dentro}, polígono=${zona.delimitacion.substring(0,80)}`);
              if (dentro) {
                await this.repoAlerta.guardar({
                  tipo: 'zona_roja',
                  descripcion: `Vehículo ingresó a zona de riesgo: "${zona.nombre}"`,
                  vehiculoMatricula,
                  dispositivoId: idNum,
                  lat: latNum,
                  lng: lngNum,
                });
                alertasGeneradas.push(`zona_roja:${zona.nombre}`);
                if (vehiculoMatricula) await this.notificarAlertaGestion(vehiculoMatricula);
              }
            } catch (e) {
              console.log(`[GPS] Error procesando polígono zona "${zona.nombre}":`, e);
            }
          }
        } else {
          console.log(`[GPS] Error al obtener zonas: HTTP ${respZonas.status}`);
        }
      } catch (e) {
        console.log(`[GPS] ServicioGestion no disponible (${GESTION_URL}):`, (e as Error).message);
      }

      res.status(200).json({ mensaje: 'GPS procesado', alertas: alertasGeneradas });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  // F15: Monitorear posición actual de un dispositivo
  async verificarInformacion(req: Request, res: Response): Promise<void> {
    try {
      const idNum = Number(req.params.dispositivoId);
      const existe = await this.repoDispositivo.existe(idNum);
      if (!existe) {
        res.status(404).json({ error: 'Dispositivo no registrado' });
        return;
      }
      const ultima = await this.repoUbicacion.obtenerUltima(idNum);
      res.status(200).json({
        data: {
          dispositivoId: idNum,
          ultimaUbicacion: ultima ? { lat: ultima.lat, lng: ultima.lng } : null,
          ultimaActualizacion: ultima?.timestamp ?? null,
        },
      });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  private async notificarAlertaGestion(vehiculoMatricula: string): Promise<void> {
    try {
      await fetch(
        `${GESTION_URL}/internal/viajes/vehiculo/${encodeURIComponent(vehiculoMatricula)}/alertas`,
        { method: 'PATCH' }
      );
    } catch {
      // ServicioGestion no disponible — la alerta queda guardada localmente
    }
  }

  private manejarError(res: Response, error: any): void {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: String(error) });
    }
  }
}
