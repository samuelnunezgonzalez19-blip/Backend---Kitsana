import { ContactoEmergencia, db, nuevoId, User } from "../../data/db";
import { badRequest, notFound } from "../../shared/errors";
import { asObject, isNonEmptyString, isPhone } from "../../shared/validation";

const GRUPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MAX_CONTACTOS = 5;

function buscarUsuario(userId: string): User {
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw notFound("Usuario no encontrado");
  return user;
}

// Nunca se expone passwordHash
function publico(u: User) {
  const { passwordHash, ...resto } = u;
  return resto;
}

export function obtener(userId: string) {
  return publico(buscarUsuario(userId));
}

export function actualizar(userId: string, body: unknown) {
  const user = buscarUsuario(userId);
  const b = asObject(body);
  const errores: string[] = [];

  if (b.nombre !== undefined && !isNonEmptyString(b.nombre)) errores.push("nombre no puede estar vacío");
  if (b.edad !== undefined && !(Number.isInteger(b.edad) && (b.edad as number) >= 0 && (b.edad as number) <= 120)) {
    errores.push("edad debe ser un entero entre 0 y 120");
  }
  if (b.alergias !== undefined && typeof b.alergias !== "string") errores.push("alergias debe ser texto");
  if (b.condicionMedica !== undefined && typeof b.condicionMedica !== "string") {
    errores.push("condicionMedica debe ser texto");
  }
  if (
    b.grupoSanguineo !== undefined &&
    b.grupoSanguineo !== "" &&
    !GRUPOS_SANGUINEOS.includes(b.grupoSanguineo as string)
  ) {
    errores.push(`grupoSanguineo debe ser uno de: ${GRUPOS_SANGUINEOS.join(", ")}`);
  }
  if (errores.length) throw badRequest("Datos de perfil inválidos", errores);

  if (b.nombre !== undefined) user.nombre = (b.nombre as string).trim();
  if (b.edad !== undefined) user.edad = b.edad as number;
  if (b.alergias !== undefined) user.alergias = b.alergias as string;
  if (b.condicionMedica !== undefined) user.condicionMedica = b.condicionMedica as string;
  if (b.grupoSanguineo !== undefined) user.grupoSanguineo = b.grupoSanguineo as string;
  return publico(user);
}

export function agregarContacto(userId: string, body: unknown): ContactoEmergencia {
  const user = buscarUsuario(userId);
  const b = asObject(body);
  const errores: string[] = [];
  if (!isNonEmptyString(b.nombre)) errores.push("nombre es obligatorio");
  if (!isPhone(b.telefono)) errores.push("telefono debe tener entre 7 y 15 dígitos (puede iniciar con +)");
  if (b.relacion !== undefined && typeof b.relacion !== "string") errores.push("relacion debe ser texto");
  if (errores.length) throw badRequest("Datos de contacto inválidos", errores);
  if (user.contactos.length >= MAX_CONTACTOS) {
    throw badRequest(`Solo se permiten ${MAX_CONTACTOS} contactos de emergencia`);
  }

  const contacto: ContactoEmergencia = {
    id: nuevoId("ctc"),
    nombre: (b.nombre as string).trim(),
    telefono: (b.telefono as string).replace(/\s/g, ""),
    ...(typeof b.relacion === "string" && { relacion: b.relacion }),
  };
  user.contactos.push(contacto);
  return contacto;
}

export function eliminarContacto(userId: string, contactoId: string): void {
  const user = buscarUsuario(userId);
  const i = user.contactos.findIndex((c) => c.id === contactoId);
  if (i === -1) throw notFound("Contacto no encontrado");
  user.contactos.splice(i, 1);
}
