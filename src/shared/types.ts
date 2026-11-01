import { Request } from "express";

// Request autenticado: el middleware agrega userId a partir del token.
export interface AuthRequest extends Request {
  userId?: string;
}
