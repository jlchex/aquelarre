import { profession, weapon, gear } from "./_factories.mjs";
import { SOCIETIES, SOCIAL, MONEY } from "./_groups.mjs";

export const RURAL_PROFESSIONS = {
  ...profession("labrador", {
    label: "Labrador",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: SOCIAL.COMMON_RURAL,
    skillPoints: 100,
    allowedSkills: ["descubrir", "sigilo", "pelea"],
    equipment: [
      gear({ name: "Azada", notes: "Herramienta de trabajo" }),
      gear({ name: "Ropa de trabajo", equipped: true }),
      gear({ name: "Saco de semillas" })
    ],
    money: MONEY.POOR
  }),

  ...profession("pastor", {
    label: "Pastor",
    society: SOCIETIES.ALL_MAIN,
    socialClass: SOCIAL.COMMON_RURAL,
    minStats: { agi: 15, per: 20 },
    skillPoints: 100,
    allowedSkills: ["descubrir", "sigilo", "palos"],
    equipment: [
      weapon({
        name: "Cayado",
        skill: "palos",
        damage: "1d6",
        hands: 2,
        defensive: true
      }),
      gear({ name: "Ropa de lana", equipped: true }),
      gear({ name: "Zurrón" })
    ],
    money: MONEY.POOR
  }),

  ...profession("cazador", {
    label: "Cazador",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: ["campesinado", "villano", "marginado"],
    minStats: { per: 20 },
    skillPoints: 105,
    allowedSkills: ["descubrir", "sigilo", "arcos", "cuchillos"],
    equipment: [
      weapon({
        name: "Arco corto",
        skill: "arcos",
        damage: "1d6",
        kind: "ranged",
        hands: 2,
        range: "30/60/120"
      }),
      weapon({
        name: "Cuchillo de monte",
        skill: "cuchillos",
        damage: "1d4+1",
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Carcaj" }),
      gear({ name: "Trampas sencillas" })
    ],
    money: MONEY.POOR
  })
};
