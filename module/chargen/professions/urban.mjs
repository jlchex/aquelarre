import { profession, gear } from "./_factories.mjs";
import { SOCIETIES, SOCIAL, MONEY } from "./_groups.mjs";

export const URBAN_PROFESSIONS = {
  ...profession("artesano", {
    label: "Artesano",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["burguesia", "villano"],
    minStats: { hab: 20, per: 15 },
    skillPoints: 105,
    allowedSkills: ["descubrir", "persuasion", "leer_y_escribir"],
    equipment: [
      gear({ name: "Herramientas de oficio" }),
      gear({ name: "Ropa de trabajo", equipped: true }),
      gear({ name: "Caja de materiales" })
    ],
    money: MONEY.MID
  }),

  ...profession("mercader", {
    label: "Mercader",
    society: SOCIETIES.ALL_MAIN,
    socialClass: SOCIAL.COMMON_URBAN,
    minStats: { com: 20 },
    skillPoints: 110,
    allowedSkills: ["persuasion", "leer_y_escribir", "descubrir"],
    equipment: [
      gear({ name: "Bolsa de monedas", equipped: true }),
      gear({ name: "Libro de cuentas" }),
      gear({ name: "Balanza pequeña" })
    ],
    money: MONEY.MID
  }),

  ...profession("escriba", {
    label: "Escriba",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["burguesia", "clero", "baja-nobleza"],
    skillPoints: 115,
    allowedSkills: ["leer_y_escribir", "culto", "persuasion"],
    equipment: [
      gear({ name: "Estuche de escritura" }),
      gear({ name: "Pergaminos", quantity: 3 }),
      gear({ name: "Libro de notas" })
    ],
    money: MONEY.MID
  })
};
