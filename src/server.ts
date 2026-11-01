import { env } from "./config/env";
import { cargarDatosIniciales } from "./data/seed";
import { crearApp } from "./app";

cargarDatosIniciales();
crearApp().listen(env.port, () => {
  console.log(`KitSana API corriendo en http://localhost:${env.port}`);
});
