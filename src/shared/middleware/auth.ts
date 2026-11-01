import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { unauthorized } from "../errors";
import { AuthRequest } from "../types";
import { db } from "../../data/db";

export function authRequired(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(unauthorized("Falta el token de autenticación (Authorization: Bearer <token>)"));
  }
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as { sub: string };
    if (!db.users.some((u) => u.id === payload.sub)) {
      return next(unauthorized("El usuario del token ya no existe"));
    }
    req.userId = payload.sub;
    next();
  } catch {
    next(unauthorized("Token inválido o expirado"));
  }
}
