import { Router } from "express";
import { authRequired } from "../../shared/middleware/auth";
import * as controller from "./perfil.controller";

const router = Router();
router.use(authRequired); // todo el módulo requiere token

router.get("/", controller.obtener);
router.put("/", controller.actualizar);
router.post("/contactos", controller.agregarContacto);
router.delete("/contactos/:id", controller.eliminarContacto);
export default router;
