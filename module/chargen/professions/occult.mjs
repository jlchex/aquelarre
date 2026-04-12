import { profession, gear, spell } from "./_factories.mjs";
import { SOCIETIES, MONEY, SEX } from "./_groups.mjs";

export const OCCULT_PROFESSIONS = {
  ...profession("curandero", {
    label: "Curandero",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["campesinado", "villano", "marginado", "burguesia"],
    minStats: { cul: 15, per: 15 },
    skillPoints: 115,
    allowedSkills: ["medicina", "descubrir", "persuasion", "sigilo"],
    equipment: [
      gear({ name: "Bolsa de hierbas" }),
      gear({ name: "Cuchillo de corte" }),
      gear({ name: "Vendajes", quantity: 3 })
    ],
    money: MONEY.POOR
  }),

  ...profession("alquimista", {
    label: "Alquimista",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["burguesia", "baja-nobleza", "clero"],
    minStats: { cul: 20 },
    skillPoints: 125,
    allowedSkills: ["alquimia", "leer_y_escribir", "descubrir", "medicina"],
    equipment: [
      gear({ name: "Redoma y alambique" }),
      gear({ name: "Cuaderno de fórmulas" }),
      spell({
        name: "Preparación menor",
        skill: "alquimia",
        cost: "1 preparación",
        effect: "Produce una mezcla simple de uso alquímico"
      })
    ],
    money: MONEY.MID
  }),

  ...profession("bruja", {
    label: "Bruja",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["marginado", "campesinado", "villano", "burguesia"],
    sex: SEX.FEMALE,
    minStats: { cul: 15, per: 15, luck: 40 },
    skillPoints: 125,
    allowedSkills: ["alquimia", "astrologia", "sigilo", "persuasion"],
    equipment: [
      gear({ name: "Bolsa de componentes" }),
      gear({ name: "Amuleto extraño", equipped: true }),
      spell({
        name: "Ojo de la noche",
        skill: "alquimia",
        cost: "1 preparación",
        effect: "Permite ver mejor en penumbra"
      })
    ],
    money: MONEY.POOR
  })
};
