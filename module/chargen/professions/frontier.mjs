import { profession, weapon, shield, armor, gear } from "./_factories.mjs";
import { SOCIETIES, MONEY, SEX } from "./_groups.mjs";

export const FRONTIER_PROFESSIONS = {
  ...profession("almogavar", {
    label: "Almogávar",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["villano", "campesinado", "marginado"],
    sex: SEX.MALE,
    minStats: { fue: 15, agi: 15, res: 15 },
    skillPoints: 125,
    allowedSkills: ["lanzas", "cuchillos", "esquivar", "sigilo", "descubrir"],
    equipment: [
      weapon({
        name: "Azcona",
        skill: "lanzas",
        damage: "1d8",
        hands: 1
      }),
      weapon({
        name: "Cuchillo almogávar",
        skill: "cuchillos",
        damage: "1d6",
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Zurrón de campaña" }),
      gear({ name: "Sayo basto", equipped: true })
    ],
    money: MONEY.VARIABLE
  }),

  ...profession("ballestero", {
    label: "Ballestero",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: ["villano", "campesinado", "burguesia"],
    minStats: { per: 20, hab: 15 },
    skillPoints: 120,
    allowedSkills: ["ballestas", "cuchillos", "descubrir", "esquivar"],
    equipment: [
      weapon({
        name: "Ballesta",
        skill: "ballestas",
        damage: "1d10",
        kind: "ranged",
        hands: 2,
        range: "20/40/80"
      }),
      weapon({
        name: "Daga de cinto",
        skill: "cuchillos",
        damage: "1d4+1",
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Caja de virotes" }),
      gear({ name: "Capelina simple", equipped: true })
    ],
    money: MONEY.MID
  }),

  ...profession("frontero", {
    label: "Frontero",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: ["villano", "campesinado", "marginado", "baja-nobleza"],
    minStats: { per: 15, res: 15 },
    skillPoints: 115,
    allowedSkills: ["arcos", "lanzas", "descubrir", "sigilo", "esquivar"],
    equipment: [
      weapon({
        name: "Arco de frontera",
        skill: "arcos",
        damage: "1d6",
        kind: "ranged",
        hands: 2,
        range: "30/60/120"
      }),
      weapon({
        name: "Lanza ligera",
        skill: "lanzas",
        damage: "1d6+1"
      }),
      gear({ name: "Manta de campaña" }),
      gear({ name: "Capucha parda", equipped: true })
    ],
    money: MONEY.POOR
  }),

  ...profession("guia", {
    label: "Guía",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["campesinado", "villano", "marginado"],
    minStats: { per: 20, agi: 15 },
    skillPoints: 110,
    allowedSkills: ["descubrir", "sigilo", "esquivar", "palos"],
    equipment: [
      weapon({
        name: "Bastón de camino",
        skill: "palos",
        damage: "1d6",
        defensive: true
      }),
      gear({ name: "Morral de viaje" }),
      gear({ name: "Manta de monte", equipped: true })
    ],
    money: MONEY.POOR
  })
};
