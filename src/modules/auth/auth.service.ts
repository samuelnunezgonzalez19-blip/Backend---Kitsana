import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { db, nuevoId, User } from "../../data/db";
import { VIDAS_INICIALES } from "../../data/seed";
import { badRequest, conflict, unauthorized } from "../../shared/errors";
import { asObject, isEmail, isNonEmptyString } from "../../shared/validation";
import { AuthResponse, LoginDTO, RegistroDTO } from "./auth.dto";

function firmarToken(user: User): string {
  return jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

function respuesta(user: User): AuthResponse {
  return { usuario: { id: user.id, nombre: user.nombre, correo: user.correo }, token: firmarToken(user) };
}

export async function registrar(body: unknown): Promise<AuthResponse> {
  const b = asObject(body);
  const errores: string[] = [];
  if (!isNonEmptyString(b.nombre)) errores.push("nombre es obligatorio");
  if (!isEmail(b.correo)) errores.push("correo no tiene un formato válido");
  if (typeof b.contrasena !== "string" || b.contrasena.length < 8) {
    errores.push("contrasena debe tener al menos 8 caracteres");
  }
  if (errores.length) throw badRequest("Datos de registro inválidos", errores);

  const dto = b as unknown as RegistroDTO;
  const correo = dto.correo.trim().toLowerCase();
  if (db.users.some((u) => u.correo === correo)) {
    throw conflict("Ya existe una cuenta con ese correo");
  }

  const user: User = {
    id: nuevoId("usr"),
    nombre: dto.nombre.trim(),
    correo,
    // La contraseña NUNCA se guarda en texto plano
    passwordHash: await bcrypt.hash(dto.contrasena, 10),
    alergias: "N/A",
    condicionMedica: "N/A",
    grupoSanguineo: "",
    contactos: [],
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  db.progreso.push({
    userId: user.id,
    xp: 0,
    xpHoy: 0,
    xpSemana: 0,
    racha: 0,
    vidas: VIDAS_INICIALES,
    ultimaActividad: null,
    leccionesCompletadas: [],
  });
  return respuesta(user);
}

export async function iniciarSesion(body: unknown): Promise<AuthResponse> {
  const b = asObject(body);
  if (!isEmail(b.correo) || !isNonEmptyString(b.contrasena)) {
    throw badRequest("Debes enviar correo y contrasena");
  }
  const dto = b as unknown as LoginDTO;
  const user = db.users.find((u) => u.correo === dto.correo.trim().toLowerCase());
  // Mismo mensaje si falla el correo o la contraseña (no revelar cuál fue)
  if (!user || !(await bcrypt.compare(dto.contrasena, user.passwordHash))) {
    throw unauthorized("Correo o contraseña incorrectos");
  }
  return respuesta(user);
}
