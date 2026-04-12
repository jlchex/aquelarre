import { profession, gear, ritual } from "./_factories.mjs";
import { SOCIETIES, SOCIAL, MONEY, SEX } from "./_groups.mjs";

export const RELIGIOUS_PROFESSIONS = {
  ...profession("clerigo", {
    label: "Clérigo",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: SOCIAL.RELIGIOUS_CHRISTIAN,
    sex: SEX.MALE,
    minStats: { cul: 15, luck: 50 },
    skillPoints: 120,
    allowedSkills: ["culto", "leer_y_escribir", "medicina", "persuasion"],
    equipment: [
      gear({ name: "Símbolo religioso", equipped: true }),
      gear({ name: "Librito de oraciones" }),
      ritual({
        name: "Bendición menor",
        skill: "culto",
        cost: "Oración",
        effect: "Otorga consuelo o apoyo espiritual",
        requirements: "Símbolo sagrado"
      })
    ],
    money: MONEY.MID
  }),

  ...profession("monje", {
    label: "Monje",
    society: SOCIETIES.CHRISTIAN_ONLY,
    socialClass: ["clero", "burguesia", "baja-nobleza", "villano", "campesinado"],
    sex: SEX.MALE,
    minStats: { cul: 15, luck: 45 },
    skillPoints: 115,
    allowedSkills: ["culto", "leer_y_escribir", "medicina"],
    equipment: [
      gear({ name: "Hábito monástico", equipped: true }),
      gear({ name: "Rosario de madera" }),
      gear({ name: "Manual de salmos" })
    ],
    money: MONEY.POOR
  })
};
