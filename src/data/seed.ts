import { db, Leccion } from "./db";

export const META_DIARIA_XP = 40;
export const VIDAS_INICIALES = 5;

function lecciones(unidadId: string, items: [string, string, number][]): Leccion[] {
  return items.map(([id, titulo, duracionMin]) => ({ id, unidadId, titulo, duracionMin, xp: 20 }));
}

export function cargarDatosIniciales() {
  db.guias.push(
    {
      id: "rcp-adulto",
      titulo: "RCP - Adulto",
      categoria: "cardiovascular",
      urgente: true,
      advertencia:
        "Si no responde y no respira como debería, llama al 123, pide un DEA y sigue las instrucciones.",
      cronometro: { duracionSegundos: 120, ritmoMin: 100, ritmoMax: 120 },
      pasos: [
        { orden: 1, titulo: "Coloca las manos", detalle: "En el centro del pecho, una sobre otra." },
        { orden: 2, titulo: "Comprime fuerte y rápido", detalle: "Brazos rectos. Profundidad de 5 a 6 cm." },
        { orden: 3, titulo: "Deja que el pecho se eleve", detalle: "Permite que el tórax se expanda completamente." },
        { orden: 4, titulo: "Continúa sin interrumpir", detalle: "Hasta que llegue ayuda o un DEA." },
      ],
    },
    {
      id: "heimlich-adulto",
      titulo: "Atragantamiento - Adulto",
      categoria: "respiratorio",
      urgente: true,
      advertencia: "Si la persona no puede toser, hablar ni respirar, actúa de inmediato y llama al 123.",
      pasos: [
        { orden: 1, titulo: "Colócate detrás", detalle: "Rodea su cintura con tus brazos." },
        { orden: 2, titulo: "Posiciona el puño", detalle: "Sobre el ombligo, sujétalo con la otra mano." },
        { orden: 3, titulo: "Comprime hacia adentro y arriba", detalle: "Repite hasta que expulse el objeto." },
      ],
    },
    {
      id: "quemadura-leve",
      titulo: "Quemadura leve",
      categoria: "trauma",
      urgente: false,
      advertencia: "Si la quemadura es extensa, profunda o en el rostro, busca atención médica.",
      pasos: [
        { orden: 1, titulo: "Enfría la zona", detalle: "Agua corriente fría durante 10 a 20 minutos." },
        { orden: 2, titulo: "Cubre la quemadura", detalle: "Con un apósito limpio, sin reventar ampollas." },
      ],
    },
    {
      id: "hemorragia",
      titulo: "Hemorragia externa",
      categoria: "trauma",
      urgente: true,
      advertencia: "Si el sangrado no cede en 10 minutos, llama al 123.",
      pasos: [
        { orden: 1, titulo: "Presiona directamente", detalle: "Con una gasa o tela limpia sobre la herida." },
        { orden: 2, titulo: "Mantén la presión", detalle: "No retires el apósito si se empapa; agrega otro encima." },
      ],
    }
  );

  db.unidades.push(
    { id: "u1", titulo: "Unidad 1: Heridas y cortes" },
    { id: "u2", titulo: "Unidad 2: Quemaduras" },
    { id: "u3", titulo: "Unidad 3: Atragantamiento" },
    { id: "u4", titulo: "Unidad 4: RCP" }
  );

  db.lecciones.push(
    ...lecciones("u1", [
      ["u1-l1", "Reconocer una herida", 4],
      ["u1-l2", "El botiquín esencial", 3],
      ["u1-l3", "Repaso de la unidad", 5],
    ]),
    ...lecciones("u2", [
      ["u2-l1", "Tipos de quemaduras", 4],
      ["u2-l2", "Reconocer los riesgos", 5],
      ["u2-l3", "Repaso de la unidad", 3],
    ]),
    ...lecciones("u3", [
      ["u3-l1", "Reconocer las señales", 4],
      ["u3-l2", "Situaciones cotidianas", 5],
      ["u3-l3", "Repaso de la unidad", 3],
    ]),
    ...lecciones("u4", [
      ["u4-l1", "Conceptos esenciales", 5],
      ["u4-l2", "Conocer el DEA", 4],
      ["u4-l3", "Repaso de la unidad", 3],
    ])
  );

  // Rivales de ejemplo para el ranking semanal (datos ficticios)
  db.rivales.push(
    { nombre: "Camila R.", xpSemana: 320 },
    { nombre: "Diego P.", xpSemana: 280 },
    { nombre: "Sofía L.", xpSemana: 210 }
  );
}
