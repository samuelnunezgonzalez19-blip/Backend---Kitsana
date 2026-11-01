import { CategoriaGuia, db, Guia } from "../../data/db";
import { badRequest, notFound } from "../../shared/errors";

const CATEGORIAS: CategoriaGuia[] = ["cardiovascular", "respiratorio", "trauma", "ambiental"];

export interface FiltroGuias {
  categoria?: string;
  q?: string;
}

export function listar(filtro: FiltroGuias): Guia[] {
  if (filtro.categoria && !CATEGORIAS.includes(filtro.categoria as CategoriaGuia)) {
    throw badRequest("Categoría inválida", [`Valores válidos: ${CATEGORIAS.join(", ")}`]);
  }
  let resultado = db.guias;
  if (filtro.categoria) resultado = resultado.filter((g) => g.categoria === filtro.categoria);
  if (filtro.q) {
    const q = filtro.q.toLowerCase();
    resultado = resultado.filter(
      (g) =>
        g.titulo.toLowerCase().includes(q) ||
        g.pasos.some((p) => `${p.titulo} ${p.detalle}`.toLowerCase().includes(q))
    );
  }
  return resultado;
}

export function obtener(id: string): Guia {
  const guia = db.guias.find((g) => g.id === id);
  if (!guia) throw notFound("Guía no encontrada");
  return guia;
}
