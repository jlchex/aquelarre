import { profession, weapon, gear, armor } from "./_factories.mjs";
import { SOCIETIES, SOCIAL, MONEY, SEX } from "./_groups.mjs";

export const CIVIC_PROFESSIONS = {
  ...profession("herrero", {
    label: "Herrero",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["villano", "burguesia"],
    minStats: { fue: 15, hab: 15 },
    skillPoints: 110,
    allowedSkills: ["descubrir", "hachas", "mazas", "leer_y_escribir"],
    equipment: [
      gear({ name: "Martillo de herrero" }),
      gear({ name: "Tenazas" }),
      gear({ name: "Delantal de cuero", equipped: true })
    ],
    money: MONEY.MID
  }),

  ...profession("boticario", {
    label: "Boticario",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["burguesia", "clero", "villano"],
    minStats: { cul: 15, hab: 15 },
    skillPoints: 120,
    allowedSkills: ["medicina", "alquimia", "leer_y_escribir", "descubrir"],
    equipment: [
      gear({ name: "Caja de ungüentos" }),
      gear({ name: "Mortero y maja" }),
      gear({ name: "Recetario" })
    ],
    money: MONEY.MID
  }),

  ...profession("medico", {
    label: "Médico",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["burguesia", "clero", "baja-nobleza"],
    minStats: { cul: 20, per: 15 },
    skillPoints: 125,
    allowedSkills: ["medicina", "leer_y_escribir", "descubrir", "persuasion"],
    equipment: [
      gear({ name: "Maletín médico" }),
      gear({ name: "Instrumental de cura" }),
      gear({ name: "Tratado de medicina" })
    ],
    money: MONEY.GOOD
  }),

  ...profession("posadero", {
    label: "Posadero",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["villano", "burguesia"],
    minStats: { com: 15 },
    skillPoints: 105,
    allowedSkills: ["persuasion", "descubrir", "leer_y_escribir"],
    equipment: [
      gear({ name: "Libro de cuentas" }),
      gear({ name: "Llaves de la posada", equipped: true }),
      gear({ name: "Jarra y vajilla" })
    ],
    money: MONEY.MID
  }),

  ...profession("juglar", {
    label: "Juglar",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["villano", "burguesia", "marginado"],
    minStats: { com: 15, hab: 15 },
    skillPoints: 110,
    allowedSkills: ["persuasion", "sigilo", "leer_y_escribir", "descubrir"],
    equipment: [
      gear({ name: "Instrumento musical" }),
      gear({ name: "Vestido colorido", equipped: true }),
      gear({ name: "Bolsa de propinas" })
    ],
    money: MONEY.VARIABLE
  }),

  ...profession("cortesano", {
    label: "Cortesano",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: ["burguesia", "baja-nobleza", "alta-nobleza"],
    minStats: { com: 20, cul: 15 },
    skillPoints: 120,
    allowedSkills: ["persuasion", "leer_y_escribir", "descubrir", "culto"],
    equipment: [
      gear({ name: "Ropas elegantes", equipped: true }),
      gear({ name: "Perfume o aceites" }),
      gear({ name: "Cartas de presentación" })
    ],
    money: MONEY.GOOD
  }),

  ...profession("mensajero", {
    label: "Mensajero",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["villano", "burguesia", "campesinado"],
    minStats: { agi: 15, res: 15 },
    skillPoints: 105,
    allowedSkills: ["descubrir", "esquivar", "sigilo"],
    equipment: [
      gear({ name: "Valija de mensajes", equipped: true }),
      gear({ name: "Botas resistentes" }),
      gear({ name: "Manta de viaje" })
    ],
    money: MONEY.POOR
  }),

  ...profession("notario", {
    label: "Notario",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["burguesia", "clero", "baja-nobleza"],
    minStats: { cul: 20, com: 15 },
    skillPoints: 125,
    allowedSkills: ["leer_y_escribir", "persuasion", "culto", "descubrir"],
    equipment: [
      gear({ name: "Sello notarial", equipped: true }),
      gear({ name: "Cofre de documentos" }),
      gear({ name: "Estuche de escritura" })
    ],
    money: MONEY.GOOD
  })
};
