// "Base de datos" en memoria: arrays que se reinician al reiniciar el servidor.
// Cuando se agregue una BD real, solo cambian los servicios (o una capa repository).

export interface ContactoEmergencia {
  id: string;
  nombre: string;
  telefono: string;
  relacion?: string;
}

export interface User {
  id: string;
  nombre: string;
  edad?: number;
  correo: string;
  passwordHash: string;
  alergias: string;
  condicionMedica: string;
  grupoSanguineo: string;
  contactos: ContactoEmergencia[];
  createdAt: string;
}

export interface PasoGuia {
  orden: number;
  titulo: string;
  detalle: string;
}

export type CategoriaGuia = "cardiovascular" | "respiratorio" | "trauma" | "ambiental";

export interface Guia {
  id: string;
  titulo: string;
  categoria: CategoriaGuia;
  urgente: boolean;
  advertencia: string;
  pasos: PasoGuia[];
  // Solo para guías con ritmo (RCP): datos para el cronómetro/metrónomo de la app
  cronometro?: { duracionSegundos: number; ritmoMin: number; ritmoMax: number };
}

export interface Leccion {
  id: string;
  unidadId: string;
  titulo: string;
  duracionMin: number;
  xp: number;
}

export interface Unidad {
  id: string;
  titulo: string;
}

export interface ProgresoUsuario {
  userId: string;
  xp: number;
  xpHoy: number;
  xpSemana: number;
  racha: number;
  vidas: number;
  ultimaActividad: string | null; // YYYY-MM-DD
  leccionesCompletadas: string[];
}

export interface RivalRanking {
  nombre: string;
  xpSemana: number;
}

export const db = {
  users: [] as User[],
  progreso: [] as ProgresoUsuario[],
  guias: [] as Guia[],
  unidades: [] as Unidad[],
  lecciones: [] as Leccion[],
  rivales: [] as RivalRanking[],
};

let contador = 0;
export const nuevoId = (prefijo: string) => `${prefijo}_${++contador}`;
