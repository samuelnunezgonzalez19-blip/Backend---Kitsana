import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import guiasRoutes from "./modules/guias/guias.routes";
import perfilRoutes from "./modules/perfil/perfil.routes";
import aprendizajeRoutes from "./modules/aprendizaje/aprendizaje.routes";
import { errorHandler, notFoundHandler } from "./shared/middleware/error-handler";

export function crearApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => res.json({ mensaje: "API de KitSana funcionando", version: "v1" }));

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/guias", guiasRoutes);
  app.use("/api/v1/perfil", perfilRoutes);
  // Rutas de aprendizaje: /progreso, /ruta-aprendizaje, /lecciones/:id/completar, /ranking/semanal
  app.use("/api/v1", aprendizajeRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
