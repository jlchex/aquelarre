import { profession, weapon, gear, armor, ritual } from "./_factories.mjs";
import { SOCIETIES, MONEY, SEX } from "./_groups.mjs";

export const CRIMINAL_PROFESSIONS = {
  ...profession("ladron", {
    label: "Ladrón",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["marginado", "villano", "campesinado"],
    minStats: { agi: 15, per: 15 },
    skillPoints: 115,
    allowedSkills: ["sigilo", "cuchillos", "descubrir", "esquivar"],
    equipment: [
      weapon({
        name: "Daga corta",
        skill: "cuchillos",
        damage: "1d4+1",
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Ganzúas" }),
      gear({ name: "Capucha oscura", equipped: true })
    ],
    money: MONEY.VARIABLE
  }),

  ...profession("verdugo", {
    label: "Verdugo",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["marginado", "villano"],
    minStats: { fue: 15, res: 15 },
    skillPoints: 115,
    allowedSkills: ["hachas", "pelea", "descubrir"],
    equipment: [
      weapon({
        name: "Hacha de ejecución",
        skill: "hachas",
        damage: "1d8",
        hands: 2
      }),
      armor({
        name: "Mandil grueso",
        protection: 1,
        location: "torso"
      }),
      gear({ name: "Capucha de oficio", equipped: true })
    ],
    money: MONEY.MID
  }),

  ...profession("inquisidor", {
    label: "Inquisidor",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["clero", "baja-nobleza", "alta-nobleza"],
    sex: SEX.MALE,
    minStats: { cul: 15, com: 15, luck: 45 },
    skillPoints: 125,
    allowedSkills: ["culto", "persuasion", "leer_y_escribir", "descubrir", "medicina"],
    equipment: [
      gear({ name: "Símbolo inquisitorial", equipped: true }),
      gear({ name: "Expediente de acusaciones" }),
      ritual({
        name: "Exhortación de fe",
        skill: "culto",
        cost: "Oración",
        effect: "Presión espiritual y autoridad religiosa",
        requirements: "Símbolo sagrado"
      })
    ],
    money: MONEY.GOOD
  }),

  ...profession("barbero", {
    label: "Barbero",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["villano", "burguesia"],
    minStats: { hab: 15, com: 15 },
    skillPoints: 110,
    allowedSkills: ["medicina", "persuasion", "cuchillos", "descubrir"],
    equipment: [
      weapon({
        name: "Navaja de barbero",
        skill: "cuchillos",
        damage: "1d3+1",
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Cuenco y jabón" }),
      gear({ name: "Paños de trabajo", equipped: true })
    ],
    money: MONEY.MID
  }),

  ...profession("molinero", {
    label: "Molinero",
    society: SOCIETIES.ALL_MAIN,
    socialClass: ["campesinado", "villano"],
    minStats: { fue: 15, per: 15 },
    skillPoints: 100,
    allowedSkills: ["descubrir", "palos", "persuasion"],
    equipment: [
      gear({ name: "Herramientas del molino" }),
      gear({ name: "Saco de grano" }),
      gear({ name: "Ropa harinosa", equipped: true })
    ],
    money: MONEY.POOR
  })
};
