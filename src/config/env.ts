export const env = {
  port: Number(process.env.PORT) || 3000,
  // En producción este valor DEBE venir de una variable de entorno.
  jwtSecret: process.env.JWT_SECRET || "dev-secret-solo-para-desarrollo",
  jwtExpiresIn: "7d",
};
