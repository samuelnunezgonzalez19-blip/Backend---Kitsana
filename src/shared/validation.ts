// Helpers mínimos de validación (sin dependencias externas).
export const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export const isEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const isPhone = (v: unknown): v is string =>
  typeof v === "string" && /^\+?\d{7,15}$/.test(v.replace(/\s/g, ""));

// Convierte el body en un objeto seguro (evita errores si llega null o un array).
export const asObject = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
