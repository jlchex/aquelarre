import { profession, weapon, shield, armor, gear } from "./_factories.mjs";
import { SOCIETIES, MONEY, SEX } from "./_groups.mjs";

export const NOBILITY_PROFESSIONS = {
  ...profession("caballero", {
    label: "Caballero",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["baja-nobleza", "alta-nobleza"],
    sex: SEX.MALE,
    minStats: { fue: 15, hab: 20, com: 15 },
    skillPoints: 130,
    allowedSkills: ["espadas", "lanzas", "escudos", "esquivar", "persuasion"],
    equipment: [
      weapon({
        name: "Espada noble",
        skill: "espadas",
        damage: "1d8",
        defensive: true,
        parryBonus: 10
      }),
      weapon({
        name: "Lanza de caballería",
        skill: "lanzas",
        damage: "1d8",
        hands: 2
      }),
      shield({
        name: "Escudo heráldico",
        protection: 2,
        defenseBonus: 10
      }),
      armor({
        name: "Cota de malla",
        protection: 3,
        location: "general"
      }),
      gear({ name: "Tabardo con blasón", equipped: true })
    ],
    money: MONEY.GOOD
  }),

  ...profession("escudero", {
    label: "Escudero",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["baja-nobleza", "villano"],
    sex: SEX.MALE,
    minStats: { agi: 15, hab: 15 },
    skillPoints: 115,
    allowedSkills: ["espadas", "lanzas", "escudos", "descubrir"],
    equipment: [
      weapon({
        name: "Espada de servicio",
        skill: "espadas",
        damage: "1d6+1",
        defensive: true,
        parryBonus: 5
      }),
      shield({
        name: "Escudo de entrenamiento",
        protection: 1,
        defenseBonus: 10
      }),
      armor({
        name: "Jubón reforzado",
        protection: 1,
        location: "torso"
      }),
      gear({ name: "Librea", equipped: true })
    ],
    money: MONEY.MID
  }),

  ...profession("dama", {
    label: "Dama",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["baja-nobleza", "alta-nobleza"],
    sex: SEX.FEMALE,
    minStats: { com: 20, cul: 15 },
    skillPoints: 115,
    allowedSkills: ["persuasion", "leer_y_escribir", "culto", "descubrir"],
    equipment: [
      gear({ name: "Vestido noble", equipped: true }),
      gear({ name: "Joyero pequeño" }),
      gear({ name: "Cartas de familia" })
    ],
    money: MONEY.GOOD
  }),

  ...profession("noble_arruinado", {
    label: "Noble arruinado",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["baja-nobleza"],
    minStats: { com: 15 },
    skillPoints: 110,
    allowedSkills: ["persuasion", "espadas", "leer_y_escribir", "descubrir"],
    equipment: [
      weapon({
        name: "Espada gastada",
        skill: "espadas",
        damage: "1d6+1",
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Ropas venidas a menos", equipped: true }),
      gear({ name: "Anillo familiar empeñado" })
    ],
    money: MONEY.POOR
  })
};
