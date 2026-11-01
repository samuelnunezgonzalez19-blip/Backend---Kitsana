import { NextFunction, Response } from "express";
import { AuthRequest } from "../../shared/types";
import * as service from "./perfil.service";

export function obtener(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.status(200).json(service.obtener(req.userId!));
  } catch (e) {
    next(e);
  }
}

export function actualizar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.status(200).json(service.actualizar(req.userId!, req.body));
  } catch (e) {
    next(e);
  }
}

export function agregarContacto(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.status(201).json(service.agregarContacto(req.userId!, req.body));
  } catch (e) {
    next(e);
  }
}

export function eliminarContacto(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    service.eliminarContacto(req.userId!, req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
