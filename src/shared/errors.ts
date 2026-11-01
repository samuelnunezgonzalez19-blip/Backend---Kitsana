// Error de aplicación con código HTTP. Los servicios lanzan AppError;
// el middleware de errores lo convierte en respuesta JSON.
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public detalle?: string[]
  ) {
    super(message);
  }
}

export const badRequest = (msg: string, detalle?: string[]) => new AppError(400, msg, detalle);
export const unauthorized = (msg = "No autenticado") => new AppError(401, msg);
export const forbidden = (msg: string) => new AppError(403, msg);
export const notFound = (msg: string) => new AppError(404, msg);
export const conflict = (msg: string) => new AppError(409, msg);
