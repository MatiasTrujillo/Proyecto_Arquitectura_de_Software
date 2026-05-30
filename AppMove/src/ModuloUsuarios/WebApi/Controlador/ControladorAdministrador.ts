import { Request, Response } from "express";
import { ServicioAdministrador } from "../../Servicio/ServicioAdministrador";
import { RepositorioAdministrador } from "../../DataAccess/RepositorioAdministrador";
import { IServicioAdministrador } from "../../IServicio/IServicioAdministrador";

export class ControladorAdministrador {
  private servicioAdministrador: IServicioAdministrador;

  constructor(servicioAdministrador?: IServicioAdministrador) {
    this.servicioAdministrador = servicioAdministrador ?? new ServicioAdministrador(new RepositorioAdministrador());
  }

  // CRUD ADMINISTRADORES
  crearAdministrador(req: Request, res: Response): void {
    try {
      const { cedula, nombre } = req.body;
      const administradorCreado = this.servicioAdministrador.crearAdministrador(cedula, nombre);

      res.status(201).json({ data: this.mapAdministrador(administradorCreado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerAdministradores(req: Request, res: Response): void {
    try {
      const administradores = this.servicioAdministrador.obtenerAdministradores();
      res.status(200).json({ data: administradores.map(administrador => this.mapAdministrador(administrador)) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  obtenerAdministradorPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const administrador = this.servicioAdministrador.obtenerAdministradorPorId(id as string);
      res.status(200).json({ data: this.mapAdministrador(administrador) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  actualizarAdministrador(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const { cedula, nombre } = req.body;
      const administradorActualizado = this.servicioAdministrador.actualizarAdministrador(id as string, cedula, nombre);

      res.status(200).json({ data: this.mapAdministrador(administradorActualizado) });
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  eliminarAdministrador(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      this.servicioAdministrador.eliminarAdministrador(id as string);
      res.status(204).send();
    } catch (error) {
      this.manejarError(res, error);
    }
  }

  // CRUD ZONAS GEOGRAFICAS
  crearZonaGeografica(req: Request, res: Response): void {
    try {
      // Lógica para crear zona geográfica
      res.status(201).json({ mensaje: "Zona geográfica creada" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  actualizarZonaGeografica(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      // Lógica para actualizar zona geográfica
      res.status(200).json({ mensaje: "Zona geográfica actualizada" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  eliminarZonaGeografica(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      // Lógica para eliminar zona geográfica
      res.status(204).json({ mensaje: "Zona geográfica eliminada" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  // CRUD USUARIOS
  crearUsuario(req: Request, res: Response): void {
    try {
      // Lógica para crear usuario
      res.status(201).json({ mensaje: "Usuario creado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  actualizarUsuario(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      // Lógica para actualizar usuario
      res.status(200).json({ mensaje: "Usuario actualizado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  eliminarUsuario(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      // Lógica para eliminar usuario
      res.status(204).json({ mensaje: "Usuario eliminado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  // REGISTRO Y MODIFICACION DE VEHICULOS
  registrarVehiculo(req: Request, res: Response): void {
    try {
      // Lógica para registrar vehículo
      res.status(201).json({ mensaje: "Vehículo registrado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  modificarVehiculo(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      // Lógica para modificar vehículo
      res.status(200).json({ mensaje: "Vehículo modificado" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  configurarCategoria(req: Request, res: Response): void {
    try {
        const { id } = req.params;
        // Lógica para configurar categoría
        res.status(200).json({ mensaje: "Categoría configurada" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
  }

  private mapAdministrador(administrador: any) {
    return {
      id: administrador.getId(),
      cedula: administrador.getCedula(),
      nombre: administrador.getNombre(),
      rol: administrador.obtenerRol(),
    };
  }

  private manejarError(res: Response, error: unknown): void {
    const mensaje = error instanceof Error ? error.message : String(error);

    if (/no se encontr|no encontrado/i.test(mensaje)) {
      res.status(404).json({ error: mensaje });
      return;
    }

    res.status(400).json({ error: mensaje });
  }
}
