import { NextFunction, Request, Response } from "express";
import * as service from "./auth.service";

export async function registrar(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(await service.registrar(req.body));
  } catch (e) {
    next(e);
  }
}

export async function iniciarSesion(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(await service.iniciarSesion(req.body));
  } catch (e) {
    next(e);
  }
}
