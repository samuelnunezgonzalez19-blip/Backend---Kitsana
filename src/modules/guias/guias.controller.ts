import { NextFunction, Request, Response } from "express";
import * as service from "./guias.service";

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const data = service.listar({ categoria: str(req.query.categoria), q: str(req.query.q) });
    res.status(200).json({ total: data.length, data });
  } catch (e) {
    next(e);
  }
}

export function obtener(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(service.obtener(req.params.id));
  } catch (e) {
    next(e);
  }
}
