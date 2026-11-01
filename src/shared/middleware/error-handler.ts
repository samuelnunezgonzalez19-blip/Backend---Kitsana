import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

// Debe registrarse al final, con 4 parámetros.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, ...(err.detalle && { detalle: err.detalle }) });
  }
  // JSON mal formado enviado por el cliente
  if (err instanceof SyntaxError && "body" in (err as object)) {
    return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido" });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}
