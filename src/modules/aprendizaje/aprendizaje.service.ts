import { db, ProgresoUsuario } from "../../data/db";
import { META_DIARIA_XP } from "../../data/seed";
import { conflict, forbidden, notFound } from "../../shared/errors";

type Estado = "completada" | "actual" | "bloqueada";

const hoy = () => new Date().toISOString().slice(0, 10);

function diasEntre(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

function progresoDe(userId: string): ProgresoUsuario {
  const p = db.progreso.find((x) => x.userId === userId);
  if (!p) throw notFound("Progreso no encontrado");
  return p;
}

// La ruta es lineal: una lección está desbloqueada si todas las anteriores están completadas.
function estadoLecciones(p: ProgresoUsuario): Map<string, Estado> {
  const estados = new Map<string, Estado>();
  let actualAsignada = false;
  for (const l of db.lecciones) {
    if (p.leccionesCompletadas.includes(l.id)) estados.set(l.id, "completada");
    else if (!actualAsignada) {
      estados.set(l.id, "actual");
      actualAsignada = true;
    } else estados.set(l.id, "bloqueada");
  }
  return estados;
}

export function obtenerProgreso(userId: string) {
  const p = progresoDe(userId);
  const fecha = hoy();
  return {
    racha: p.racha,
    xp: p.xp,
    vidas: p.vidas,
    metaDiaria: { xpHoy: p.ultimaActividad === fecha ? p.xpHoy : 0, meta: META_DIARIA_XP },
    leccionesCompletadas: p.leccionesCompletadas.length,
    leccionesTotales: db.lecciones.length,
  };
}

export function obtenerRuta(userId: string) {
  const estados = estadoLecciones(progresoDe(userId));
  const unidades = db.unidades.map((u) => {
    const lecciones = db.lecciones
      .filter((l) => l.unidadId === u.id)
      .map((l) => ({ id: l.id, titulo: l.titulo, duracionMin: l.duracionMin, xp: l.xp, estado: estados.get(l.id)! }));
    const completadas = lecciones.filter((l) => l.estado === "completada").length;
    const estado: Estado =
      completadas === lecciones.length ? "completada" : lecciones.some((l) => l.estado === "actual") ? "actual" : "bloqueada";
    return { id: u.id, titulo: u.titulo, leccionesCompletadas: completadas, leccionesTotales: lecciones.length, estado, lecciones };
  });
  return { unidades };
}

export function completarLeccion(userId: string, leccionId: string) {
  const leccion = db.lecciones.find((l) => l.id === leccionId);
  if (!leccion) throw notFound("Lección no encontrada");

  const p = progresoDe(userId);
  const estado = estadoLecciones(p).get(leccionId);
  if (estado === "completada") throw conflict("La lección ya fue completada");
  if (estado === "bloqueada") throw forbidden("Completa la lección anterior para desbloquear esta");

  const fecha = hoy();
  // Racha: mismo día no cambia, día siguiente suma, si se saltó un día reinicia en 1
  if (p.ultimaActividad !== fecha) {
    p.racha = p.ultimaActividad && diasEntre(p.ultimaActividad, fecha) === 1 ? p.racha + 1 : 1;
    p.xpHoy = 0;
  }
  p.ultimaActividad = fecha;
  p.xpHoy += leccion.xp;
  p.xp += leccion.xp;
  p.xpSemana += leccion.xp;
  p.leccionesCompletadas.push(leccion.id);

  const siguiente = db.lecciones.find((l) => !p.leccionesCompletadas.includes(l.id));
  return {
    leccion: { id: leccion.id, titulo: leccion.titulo },
    xpGanado: leccion.xp,
    xpTotal: p.xp,
    racha: p.racha,
    metaDiaria: { xpHoy: p.xpHoy, meta: META_DIARIA_XP, cumplida: p.xpHoy >= META_DIARIA_XP },
    siguienteLeccionId: siguiente ? siguiente.id : null,
  };
}

export function rankingSemanal(userId: string) {
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw notFound("Usuario no encontrado");
  const p = progresoDe(userId);

  const filas = [
    ...db.rivales.map((r) => ({ nombre: r.nombre, xp: r.xpSemana, esUsuario: false })),
    { nombre: user.nombre, xp: p.xpSemana, esUsuario: true },
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((f, i) => ({ posicion: i + 1, ...f }));

  // Días que faltan para el lunes (cuando se reinicia la semana)
  const diaSemana = new Date().getDay(); // 0 = domingo
  const diasRestantes = diaSemana === 1 ? 7 : (8 - diaSemana) % 7 || 7;
  return {
    diasRestantes,
    posicionUsuario: filas.find((f) => f.esUsuario)!.posicion,
    ranking: filas,
  };
}
