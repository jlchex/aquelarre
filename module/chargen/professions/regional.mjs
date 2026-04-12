import { profession, weapon, shield, gear, spell } from "./_factories.mjs";
import { SOCIETIES, MONEY, SEX } from "./_groups.mjs";

export const REGIONAL_PROFESSIONS = {
  ...profession("sorguina", {
    label: "Sorguiña",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["campesinado", "villano", "marginado"],
    kingdoms: ["navarra", "castilla"],
    sex: SEX.FEMALE,
    minStats: { cul: 15, per: 15, luck: 40 },
    skillPoints: 125,
    allowedSkills: ["alquimia", "astrologia", "sigilo", "persuasion"],
    equipment: [
      gear({ name: "Bolsa de hierbas del norte" }),
      gear({ name: "Amuleto de hueso", equipped: true }),
      spell({
        name: "Susurro del bosque",
        skill: "alquimia",
        cost: "1 preparación",
        effect: "Favorece el sigilo y la percepción en parajes agrestes"
      })
    ],
    money: MONEY.POOR
  }),

  ...profession("irmadino", {
    label: "Irmadiño",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["campesinado", "villano"],
    kingdoms: ["castilla", "portugal"],
    minStats: { fue: 15, res: 15 },
    skillPoints: 115,
    allowedSkills: ["palos", "hachas", "pelea", "descubrir"],
    equipment: [
      weapon({
        name: "Palo ferrado",
        skill: "palos",
        damage: "1d6+1",
        hands: 2,
        defensive: true
      }),
      weapon({
        name: "Hacha de labor",
        skill: "hachas",
        damage: "1d8"
      }),
      gear({ name: "Capucha de paño", equipped: true })
    ],
    money: MONEY.POOR
  }),

  ...profession("banderizo", {
    label: "Banderizo",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["baja-nobleza", "villano"],
    kingdoms: ["navarra", "castilla"],
    sex: SEX.MALE,
    minStats: { hab: 15, res: 15 },
    skillPoints: 120,
    allowedSkills: ["espadas", "lanzas", "escudos", "persuasion"],
    equipment: [
      weapon({
        name: "Espada banderiza",
        skill: "espadas",
        damage: "1d6+1",
        defensive: true,
        parryBonus: 5
      }),
      shield({
        name: "Adarga norteña",
        protection: 1,
        defenseBonus: 10
      }),
      gear({ name: "Colores de linaje", equipped: true })
    ],
    money: MONEY.MID
  }),

  ...profession("mudabbar", {
    label: "Mudabbār",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: ["burguesia", "baja-nobleza", "villano"],
    kingdoms: ["granada", "aragon", "castilla"],
    minStats: { cul: 15, com: 15 },
    skillPoints: 115,
    allowedSkills: ["leer_y_escribir", "persuasion", "culto", "descubrir"],
    equipment: [
      gear({ name: "Registros y cuentas" }),
      gear({ name: "Sello administrativo", equipped: true }),
      gear({ name: "Tintero y cálamo" })
    ],
    money: MONEY.GOOD
  })
};
