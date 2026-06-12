export class Sesion {
  constructor(
    public token: string,
    public cedula: string,
    public rol: string,
    public activa: boolean = true,
    public expiraEn?: Date,
  ) {}
}
