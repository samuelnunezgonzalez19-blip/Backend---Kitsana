import { Router } from "express";
import * as controller from "./auth.controller";

const router = Router();
router.post("/register", controller.registrar);
router.post("/login", controller.iniciarSesion);
export default router;
