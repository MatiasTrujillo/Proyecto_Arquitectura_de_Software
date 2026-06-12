export class Credencial {
  constructor(
    public id: number,
    public cedula: string,
    public passwordHash: string,
    public rol: string,
    public activa: boolean = true,
  ) {}
}
