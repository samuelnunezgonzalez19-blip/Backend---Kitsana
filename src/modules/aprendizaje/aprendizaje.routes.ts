import { Router } from "express";
import { authRequired } from "../../shared/middleware/auth";
import * as controller from "./aprendizaje.controller";

// Se protege ruta por ruta (este router cuelga de /api/v1 y no debe
// convertir en 401 las rutas inexistentes).
const router = Router();
router.get("/progreso", authRequired, controller.progreso);
router.get("/ruta-aprendizaje", authRequired, controller.ruta);
router.post("/lecciones/:id/completar", authRequired, controller.completarLeccion);
router.get("/ranking/semanal", authRequired, controller.ranking);
export default router;
