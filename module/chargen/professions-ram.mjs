export const PROFESSIONS_RAW = {
  labrador: {
    label: "Labrador",
    skillPoints: 100,
    allowedSkills: ["descubrir", "sigilo", "pelea"],
    equipment: [
      { name: "Azada", type: "gear", system: { quantity: 1, equipped: false, notes: "Herramienta de trabajo" } },
      { name: "Ropa de trabajo", type: "gear", system: { quantity: 1, equipped: true, notes: "Ropa campesina" } }
    ],
    money: "Poco"
  },

  pastor: {
    label: "Pastor",
    skillPoints: 100,
    allowedSkills: ["descubrir", "sigilo", "palos"],
    equipment: [
      { name: "Cayado", type: "weapon", system: { skill: "palos", damage: "1d6", kind: "melee", hands: 2, range: "", equipped: true, defensive: true, parryBonus: 0, notes: "" } },
      { name: "Ropa de lana", type: "gear", system: { quantity: 1, equipped: true, notes: "" } }
    ],
    money: "Poco"
  },

  soldado: {
    label: "Soldado",
    skillPoints: 120,
    allowedSkills: ["espadas", "escudos", "pelea", "esquivar", "lanzas"],
    equipment: [
      { name: "Espada corta", type: "weapon", system: { skill: "espadas", damage: "1d6+1", kind: "melee", hands: 1, range: "", equipped: true, defensive: true, parryBonus: 5, notes: "" } },
      { name: "Escudo redondo", type: "shield", system: { skill: "escudos", protection: 1, equipped: true, defenseBonus: 10, notes: "" } },
      { name: "Cota acolchada", type: "armor", system: { protection: 2, location: "torso", equipped: true, notes: "" } }
    ],
    money: "Medio"
  },

  clerigo: {
    label: "Clérigo",
    skillPoints: 120,
    allowedSkills: ["culto", "leerEscribir", "medicina", "persuasion"],
    equipment: [
      { name: "Símbolo religioso", type: "gear", system: { quantity: 1, equipped: true, notes: "" } },
      { name: "Bendición menor", type: "ritual", system: { skill: "culto", cost: "Oración", difficultyMod: 0, effect: "Otorga consuelo o apoyo espiritual", requirements: "Símbolo sagrado", notes: "" } }
    ],
    money: "Medio"
  },

  brujo: {
    label: "Brujo",
    skillPoints: 120,
    allowedSkills: ["alquimia", "astrologia", "leerEscribir", "sigilo"],
    equipment: [
      { name: "Bolsa de componentes", type: "gear", system: { quantity: 1, equipped: false, notes: "Hierbas, velas y polvo ritual" } },
      { name: "Ungüento de ojos nocturnos", type: "spell", system: { skill: "alquimia", cost: "1 preparación", difficultyMod: 0, effect: "Mejora la visión en la oscuridad", components: "Hierbas y grasa animal", notes: "" } }
    ],
    money: "Variable"
  },

  mercader: {
    label: "Mercader",
    skillPoints: 110,
    allowedSkills: ["persuasion", "leerEscribir", "descubrir"],
    equipment: [
      { name: "Bolsa de monedas", type: "gear", system: { quantity: 1, equipped: false, notes: "Dinero y pagarés" } },
      { name: "Ropas de viaje", type: "gear", system: { quantity: 1, equipped: true, notes: "" } }
    ],
    money: "Medio"
  },

  cazador: {
    label: "Cazador",
    skillPoints: 110,
    allowedSkills: ["arcos", "descubrir", "sigilo", "cuchillos"],
    equipment: [
      { name: "Arco corto", type: "weapon", system: { skill: "arcos", damage: "1d6", kind: "ranged", hands: 2, range: "corto", equipped: true, defensive: false, parryBonus: 0, notes: "" } },
      { name: "Cuchillo de monte", type: "weapon", system: { skill: "cuchillos", damage: "1d4", kind: "melee", hands: 1, range: "", equipped: false, defensive: true, parryBonus: 0, notes: "" } }
    ],
    money: "Poco"
  }
};

export function professionOptionsRAW() {
  return Object.entries(PROFESSIONS_RAW).map(([key, value]) => [key, value.label]);
}
