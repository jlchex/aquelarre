import { profession, weapon, gear } from "./_factories.mjs";
import { SOCIETIES, SOCIAL, MONEY, KINGDOM_SETS } from "./_groups.mjs";

export const MARITIME_PROFESSIONS = {
  ...profession("marinero", {
    label: "Marinero",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["villano", "campesinado", "burguesia", "marginado"],
    kingdoms: KINGDOM_SETS.MARITIME,
    minStats: { hab: 15, agi: 15 },
    skillPoints: 105,
    allowedSkills: ["descubrir", "palos", "pelea", "esquivar", "cuchillos"],
    equipment: [
      weapon({
        name: "Cuchillo marinero",
        skill: "cuchillos",
        damage: "1d4+1",
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Cuerda y ganchos" }),
      gear({ name: "Ropa de mar", equipped: true })
    ],
    money: MONEY.POOR
  }),

  ...profession("pescador", {
    label: "Pescador",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: SOCIAL.COMMON_RURAL,
    kingdoms: KINGDOM_SETS.MARITIME,
    minStats: { hab: 15, agi: 15 },
    skillPoints: 100,
    allowedSkills: ["descubrir", "palos", "pelea"],
    equipment: [
      gear({ name: "Red de pesca" }),
      gear({ name: "Anzuelos y sedal" }),
      gear({ name: "Cuchillo de faena" })
    ],
    money: MONEY.POOR
  }),

  ...profession("barquero", {
    label: "Barquero",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["villano", "campesinado", "burguesia"],
    kingdoms: KINGDOM_SETS.MARITIME,
    minStats: { hab: 15, per: 15 },
    skillPoints: 100,
    allowedSkills: ["descubrir", "palos", "persuasion"],
    equipment: [
      gear({ name: "Remo reforzado" }),
      gear({ name: "Capa encerada", equipped: true }),
      gear({ name: "Cuerda de amarre" })
    ],
    money: MONEY.POOR
  }),

  ...profession("estibador", {
    label: "Estibador",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["campesinado", "villano", "marginado"],
    kingdoms: KINGDOM_SETS.MARITIME,
    minStats: { fue: 15, res: 15 },
    skillPoints: 100,
    allowedSkills: ["pelea", "palos", "descubrir"],
    equipment: [
      gear({ name: "Gancho de carga" }),
      gear({ name: "Guantes de cuero" }),
      gear({ name: "Faja de trabajo", equipped: true })
    ],
    money: MONEY.POOR
  }),

  ...profession("corsario", {
    label: "Corsario",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: ["villano", "burguesia", "marginado", "baja-nobleza"],
    kingdoms: KINGDOM_SETS.MARITIME,
    minStats: { hab: 15, per: 15, res: 15 },
    skillPoints: 120,
    allowedSkills: ["espadas", "cuchillos", "esquivar", "descubrir", "pelea"],
    equipment: [
      weapon({
        name: "Sable corto",
        skill: "espadas",
        damage: "1d6+1",
        defensive: true,
        parryBonus: 5
      }),
      weapon({
        name: "Daga de abordaje",
        skill: "cuchillos",
        damage: "1d4+1",
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Cinto de mar", equipped: true }),
      gear({ name: "Cuerda con garfio" })
    ],
    money: MONEY.VARIABLE
  })
};
