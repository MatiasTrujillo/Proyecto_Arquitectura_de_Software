import { Request, Response } from "express";
import { ServicioReglaCategoria } from "../../Servicio/ServicioReglaCategoria";

const servicio = new ServicioReglaCategoria();

function manejarError(res: Response, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  const status = /no encontr/i.test(msg) ? 404 : 400;
  res.status(status).json({ error: msg });
}

export const obtenerCategorias = async (_req: Request, res: Response) => {
  try { res.json({ data: await servicio.obtenerCategorias() }); }
  catch (e) { manejarError(res, e); }
};

export const crearCategoria = async (req: Request, res: Response) => {
  try {
    const { nombre, nombreEs, descripcion } = req.body;
    res.status(201).json({ data: await servicio.crearCategoria(nombre, nombreEs, descripcion) });
  } catch (e) { manejarError(res, e); }
};

export const obtenerReglas = async (_req: Request, res: Response) => {
  try { res.json({ data: await servicio.obtenerReglas() }); }
  catch (e) { manejarError(res, e); }
};

export const crearRegla = async (req: Request, res: Response) => {
  try {
    const { categoriaId, requiereMonitoreo, generaAlertas, recargoPorcentaje } = req.body;
    const regla = await servicio.crearRegla(
      Number(categoriaId),
      Boolean(requiereMonitoreo),
      Boolean(generaAlertas),
      Number(recargoPorcentaje ?? 0)
    );
    res.status(201).json({ data: regla });
  } catch (e) { manejarError(res, e); }
};

export const actualizarRegla = async (req: Request, res: Response) => {
  try {
    const { requiereMonitoreo, generaAlertas, recargoPorcentaje } = req.body;
    const regla = await servicio.actualizarRegla(
      Number(req.params.id),
      Boolean(requiereMonitoreo),
      Boolean(generaAlertas),
      Number(recargoPorcentaje ?? 0)
    );
    res.json({ data: regla });
  } catch (e) { manejarError(res, e); }
};

export const eliminarRegla = async (req: Request, res: Response) => {
  try {
    await servicio.eliminarRegla(Number(req.params.id));
    res.status(204).send();
  } catch (e) { manejarError(res, e); }
};
