import { Router } from "express";
import * as controller from "./guias.controller";

const router = Router();
router.get("/", controller.listar);
router.get("/:id", controller.obtener);
export default router;
