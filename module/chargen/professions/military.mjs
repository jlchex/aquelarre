import { profession, weapon, shield, armor, gear } from "./_factories.mjs";
import { SOCIETIES, SOCIAL, MONEY, SEX } from "./_groups.mjs";

export const MILITARY_PROFESSIONS = {
  ...profession("soldado", {
    label: "Soldado",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: SOCIAL.MILITARY_LOW,
    minStats: { fue: 15, hab: 15 },
    skillPoints: 120,
    allowedSkills: ["espadas", "escudos", "pelea", "esquivar", "lanzas"],
    equipment: [
      weapon({
        name: "Espada corta",
        skill: "espadas",
        damage: "1d6+1",
        defensive: true,
        parryBonus: 5
      }),
      shield({
        name: "Escudo redondo",
        protection: 1,
        defenseBonus: 10
      }),
      armor({
        name: "Cota acolchada",
        protection: 2,
        location: "torso"
      }),
      gear({ name: "Mochila militar" })
    ],
    money: MONEY.MID
  }),

  ...profession("guardia", {
    label: "Guardia",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: ["villano", "burguesia", "baja-nobleza"],
    sex: SEX.MALE,
    minStats: { agi: 15, hab: 15 },
    skillPoints: 115,
    allowedSkills: ["espadas", "escudos", "descubrir", "persuasion", "lanzas"],
    equipment: [
      weapon({
        name: "Lanza corta",
        skill: "lanzas",
        damage: "1d6+1",
        defensive: true
      }),
      shield({
        name: "Escudo de guardia",
        protection: 1,
        defenseBonus: 10
      }),
      armor({
        name: "Jubón reforzado",
        protection: 1,
        location: "torso"
      }),
      gear({ name: "Insignia del concejo", equipped: true })
    ],
    money: MONEY.MID
  }),

  ...profession("bandolero", {
    label: "Bandolero",
    society: SOCIETIES.CHRISTIAN_MUSLIM,
    socialClass: SOCIAL.FRINGE,
    minStats: { per: 15, res: 15 },
    skillPoints: 115,
    allowedSkills: ["sigilo", "cuchillos", "esquivar", "descubrir"],
    equipment: [
      weapon({
        name: "Cuchillo largo",
        skill: "cuchillos",
        damage: "1d6",
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Capucha raída", equipped: true }),
      gear({ name: "Bolsa de botín" })
    ],
    money: MONEY.VARIABLE
  })
};
