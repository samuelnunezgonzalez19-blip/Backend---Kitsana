import { NextFunction, Response } from "express";
import { AuthRequest } from "../../shared/types";
import * as service from "./aprendizaje.service";

export function progreso(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.status(200).json(service.obtenerProgreso(req.userId!));
  } catch (e) {
    next(e);
  }
}

export function ruta(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.status(200).json(service.obtenerRuta(req.userId!));
  } catch (e) {
    next(e);
  }
}

export function completarLeccion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.status(201).json(service.completarLeccion(req.userId!, req.params.id));
  } catch (e) {
    next(e);
  }
}

export function ranking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.status(200).json(service.rankingSemanal(req.userId!));
  } catch (e) {
    next(e);
  }
}
