// module/chargen/professions-raw.mjs

function clone(data) {
  return foundry.utils.deepClone(data);
}

function weapon({
  name,
  skill,
  damage = "1d6",
  kind = "melee",
  hands = 1,
  range = "",
  equipped = true,
  defensive = false,
  parryBonus = 0,
  notes = ""
}) {
  return {
    name,
    type: "weapon",
    system: {
      skill,
      damage,
      kind,
      hands,
      range,
      equipped,
      defensive,
      parryBonus,
      notes
    }
  };
}

function shield({
  name,
  protection = 1,
  equipped = true,
  defenseBonus = 5,
  notes = ""
}) {
  return {
    name,
    type: "shield",
    system: {
      skill: "escudos",
      protection,
      equipped,
      defenseBonus,
      notes
    }
  };
}

function armor({
  name,
  protection = 1,
  location = "general",
  equipped = true,
  notes = ""
}) {
  return {
    name,
    type: "armor",
    system: {
      protection,
      location,
      equipped,
      notes
    }
  };
}

function gear({
  name,
  quantity = 1,
  equipped = false,
  notes = ""
}) {
  return {
    name,
    type: "gear",
    system: {
      quantity,
      equipped,
      notes
    }
  };
}

function spell({
  name,
  skill = "alquimia",
  cost = "1 preparación",
  difficultyMod = 0,
  effect = "",
  components = "",
  notes = ""
}) {
  return {
    name,
    type: "spell",
    system: {
      skill,
      cost,
      difficultyMod,
      effect,
      components,
      notes
    }
  };
}

function ritual({
  name,
  skill = "culto",
  cost = "Oración",
  difficultyMod = 0,
  effect = "",
  requirements = "",
  notes = ""
}) {
  return {
    name,
    type: "ritual",
    system: {
      skill,
      cost,
      difficultyMod,
      effect,
      requirements,
      notes
    }
  };
}

export const PROFESSIONS_RAW = {
  labrador: {
    label: "Labrador",
    society: ["cristiana"],
    socialClass: ["campesinado", "villano"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: {},
    skillPoints: 100,
    allowedSkills: ["descubrir", "sigilo", "pelea"],
    equipment: [
      gear({ name: "Azada", notes: "Herramienta de trabajo" }),
      gear({ name: "Ropa de trabajo", equipped: true, notes: "Ropa campesina" }),
      gear({ name: "Saco de semillas", notes: "Aperos y simiente" })
    ],
    money: "Poco"
  },

  pastor: {
    label: "Pastor",
    society: ["cristiana", "islamica", "judia"],
    socialClass: ["campesinado", "villano"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { agi: 15, per: 20 },
    skillPoints: 100,
    allowedSkills: ["descubrir", "sigilo", "palos"],
    equipment: [
      weapon({
        name: "Cayado",
        skill: "palos",
        damage: "1d6",
        hands: 2,
        defensive: true,
        parryBonus: 0
      }),
      gear({ name: "Ropa de lana", equipped: true }),
      gear({ name: "Zurrón", notes: "Útiles de viaje y comida" })
    ],
    money: "Poco"
  },

  cazador: {
    label: "Cazador",
    society: ["cristiana", "islamica"],
    socialClass: ["campesinado", "villano", "marginado"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
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
        range: "30/60/120",
        defensive: false
      }),
      weapon({
        name: "Cuchillo de monte",
        skill: "cuchillos",
        damage: "1d4+1",
        hands: 1,
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Carcaj", quantity: 1, notes: "Con varias flechas" }),
      gear({ name: "Trampas sencillas", notes: "Utensilios para la caza menor" })
    ],
    money: "Poco"
  },

  pescador: {
    label: "Pescador",
    society: ["cristiana", "islamica"],
    socialClass: ["campesinado", "villano"],
    ethnicities: [],
    kingdoms: ["castilla", "aragon", "portugal", "granada"],
    sex: [],
    minStats: { hab: 15, agi: 15 },
    skillPoints: 100,
    allowedSkills: ["descubrir", "palos", "pelea"],
    equipment: [
      gear({ name: "Red de pesca", notes: "Aparejos sencillos" }),
      gear({ name: "Anzuelos y sedal" }),
      gear({ name: "Cuchillo de faena", notes: "Útil para pescado y cuerda" })
    ],
    money: "Poco"
  },

  artesano: {
    label: "Artesano",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["burguesia", "villano"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { hab: 20, per: 15 },
    skillPoints: 105,
    allowedSkills: ["descubrir", "persuasion", "leerEscribir"],
    equipment: [
      gear({ name: "Herramientas de oficio", notes: "Útiles propios del taller" }),
      gear({ name: "Ropa de trabajo", equipped: true }),
      gear({ name: "Caja de materiales", notes: "Recambios y piezas" })
    ],
    money: "Medio"
  },

  mercader: {
    label: "Mercader",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["burguesia", "villano"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { com: 20 },
    skillPoints: 110,
    allowedSkills: ["persuasion", "leerEscribir", "descubrir"],
    equipment: [
      gear({ name: "Bolsa de monedas", equipped: true, notes: "Capital comercial inicial" }),
      gear({ name: "Libro de cuentas", notes: "Anotaciones de negocio" }),
      gear({ name: "Balanza pequeña", notes: "Para pesar mercancías" })
    ],
    money: "Medio"
  },

  escriba: {
    label: "Escriba",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["burguesia", "clero", "baja-nobleza"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: {},
    skillPoints: 115,
    allowedSkills: ["leerEscribir", "culto", "persuasion"],
    equipment: [
      gear({ name: "Estuche de escritura", notes: "Cálamos, tinta y cuchilla" }),
      gear({ name: "Pergaminos", quantity: 3, notes: "Hojas de trabajo" }),
      gear({ name: "Libro devocional o de notas", notes: "Según formación" })
    ],
    money: "Medio"
  },

  soldado: {
    label: "Soldado",
    society: ["cristiana", "islamica"],
    socialClass: ["villano", "campesinado", "baja-nobleza", "marginado"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { fue: 15, hab: 15 },
    skillPoints: 120,
    allowedSkills: ["espadas", "escudos", "pelea", "esquivar", "lanzas"],
    equipment: [
      weapon({
        name: "Espada corta",
        skill: "espadas",
        damage: "1d6+1",
        hands: 1,
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
      gear({ name: "Mochila militar", notes: "Ración y útiles básicos" })
    ],
    money: "Medio"
  },

  guardia: {
    label: "Guardia",
    society: ["cristiana", "islamica"],
    socialClass: ["villano", "burguesia", "baja-nobleza"],
    ethnicities: [],
    kingdoms: [],
    sex: ["male"],
    minStats: { agi: 15, hab: 15 },
    skillPoints: 115,
    allowedSkills: ["espadas", "escudos", "descubrir", "persuasion"],
    equipment: [
      weapon({
        name: "Lanza corta",
        skill: "lanzas",
        damage: "1d6+1",
        hands: 1,
        defensive: true,
        parryBonus: 0
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
    money: "Medio"
  },

  bandolero: {
    label: "Bandolero",
    society: ["cristiana", "islamica"],
    socialClass: ["marginado", "campesinado", "villano"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { per: 15, res: 15 },
    skillPoints: 115,
    allowedSkills: ["sigilo", "cuchillos", "esquivar", "descubrir"],
    equipment: [
      weapon({
        name: "Cuchillo largo",
        skill: "cuchillos",
        damage: "1d6",
        hands: 1,
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Capucha raída", equipped: true }),
      gear({ name: "Bolsa de botín", notes: "Pertenencias mal habidas" })
    ],
    money: "Variable"
  },

  marinero: {
    label: "Marinero",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["villano", "campesinado", "burguesia", "marginado"],
    ethnicities: [],
    kingdoms: ["castilla", "aragon", "portugal", "granada"],
    sex: [],
    minStats: { hab: 15, agi: 15 },
    skillPoints: 105,
    allowedSkills: ["descubrir", "palos", "pelea", "esquivar"],
    equipment: [
      weapon({
        name: "Cuchillo marinero",
        skill: "cuchillos",
        damage: "1d4+1",
        hands: 1,
        defensive: true,
        parryBonus: 5
      }),
      gear({ name: "Cuerda y ganchos", notes: "Útiles de cubierta" }),
      gear({ name: "Ropa de mar", equipped: true })
    ],
    money: "Poco"
  },

  clerigo: {
    label: "Clérigo",
    society: ["cristiana"],
    socialClass: ["clero", "burguesia", "baja-nobleza", "alta-nobleza"],
    ethnicities: [],
    kingdoms: [],
    sex: ["male"],
    minStats: { cul: 15, luck: 50 },
    skillPoints: 120,
    allowedSkills: ["culto", "leerEscribir", "medicina", "persuasion"],
    equipment: [
      gear({ name: "Símbolo religioso", equipped: true }),
      gear({ name: "Librito de oraciones", notes: "Devocionario o salterio" }),
      ritual({
        name: "Bendición menor",
        skill: "culto",
        cost: "Oración",
        effect: "Otorga consuelo o apoyo espiritual",
        requirements: "Símbolo sagrado"
      })
    ],
    money: "Medio"
  },

  monje: {
    label: "Monje",
    society: ["cristiana"],
    socialClass: ["clero", "burguesia", "baja-nobleza", "villano", "campesinado"],
    ethnicities: [],
    kingdoms: [],
    sex: ["male"],
    minStats: { cul: 15, luck: 45 },
    skillPoints: 115,
    allowedSkills: ["culto", "leerEscribir", "medicina"],
    equipment: [
      gear({ name: "Hábito monacal", equipped: true }),
      gear({ name: "Rosario o cuentas", equipped: true }),
      gear({ name: "Manual copiado", notes: "Texto de estudio o rezos" })
    ],
    money: "Poco"
  },

  medico: {
    label: "Médico",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["burguesia", "clero", "baja-nobleza"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { cul: 15, hab: 15 },
    skillPoints: 120,
    allowedSkills: ["medicina", "leerEscribir", "descubrir", "persuasion"],
    equipment: [
      gear({ name: "Maletín de remedios", notes: "Vendas, ungüentos y útiles" }),
      gear({ name: "Instrumental médico", notes: "Sondas, cuchillas, agujas" }),
      gear({ name: "Tratado médico", notes: "Compendio de referencia" })
    ],
    money: "Medio"
  },

  barberoCirujano: {
    label: "Barbero-cirujano",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["burguesia", "villano"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { hab: 15, com: 10, cul: 10 },
    skillPoints: 115,
    allowedSkills: ["medicina", "persuasion", "cuchillos"],
    equipment: [
      gear({ name: "Navajas y cuchillas", notes: "Útiles de barbería y cirugía" }),
      gear({ name: "Vendas", quantity: 2 }),
      gear({ name: "Aceites y emplastos", notes: "Preparados básicos" })
    ],
    money: "Medio"
  },

  alquimista: {
    label: "Alquimista",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["burguesia", "clero", "baja-nobleza", "alta-nobleza", "marginado"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { cul: 20 },
    skillPoints: 120,
    allowedSkills: ["alquimia", "leerEscribir", "astrologia", "descubrir"],
    equipment: [
      gear({ name: "Bolsa de componentes", notes: "Hierbas, polvos y recipientes" }),
      gear({ name: "Instrumental de laboratorio", notes: "Mortero, frascos y brasero" }),
      spell({
        name: "Ungüento de ojos nocturnos",
        skill: "alquimia",
        cost: "1 preparación",
        effect: "Mejora la visión en la oscuridad",
        components: "Hierbas y grasa animal"
      })
    ],
    money: "Variable"
  },

  brujo: {
    label: "Brujo",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["marginado", "campesinado", "villano", "burguesia"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { cul: 15 },
    skillPoints: 120,
    allowedSkills: ["alquimia", "astrologia", "leerEscribir", "sigilo"],
    equipment: [
      gear({ name: "Bolsa de componentes", notes: "Hierbas, velas y polvo ritual" }),
      gear({ name: "Amuleto tosco", notes: "Talismán o pieza supersticiosa" }),
      spell({
        name: "Ungüento de ojos nocturnos",
        skill: "alquimia",
        cost: "1 preparación",
        effect: "Mejora la visión en la oscuridad",
        components: "Hierbas y grasa animal"
      })
    ],
    money: "Variable"
  },

  cortesano: {
    label: "Cortesano",
    society: ["cristiana", "islamica"],
    socialClass: ["baja-nobleza", "alta-nobleza", "burguesia"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { com: 15, per: 15 },
    skillPoints: 110,
    allowedSkills: ["persuasion", "leerEscribir", "culto"],
    equipment: [
      gear({ name: "Ropas de calidad", equipped: true, notes: "Vestimenta cuidada" }),
      gear({ name: "Sello personal", notes: "Insignia o distintivo" }),
      gear({ name: "Perfume o aceite aromático", notes: "Señal de refinamiento" })
    ],
    money: "Alto"
  },

  caballero: {
    label: "Caballero",
    society: ["cristiana", "islamica"],
    socialClass: ["baja-nobleza", "alta-nobleza"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: { fue: 15, agi: 15 },
    skillPoints: 130,
    allowedSkills: ["espadas", "lanzas", "escudos", "esquivar", "persuasion"],
    equipment: [
      weapon({
        name: "Espada de caballero",
        skill: "espadas",
        damage: "1d8",
        hands: 1,
        defensive: true,
        parryBonus: 10
      }),
      weapon({
        name: "Lanza de guerra",
        skill: "lanzas",
        damage: "1d8",
        hands: 2,
        defensive: false
      }),
      shield({
        name: "Escudo de caballero",
        protection: 2,
        defenseBonus: 15
      }),
      armor({
        name: "Loriga",
        protection: 3,
        location: "torso"
      }),
      gear({ name: "Capa heráldica", equipped: true })
    ],
    money: "Alto"
  },

  estudiante: {
    label: "Estudiante",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["burguesia", "clero", "baja-nobleza"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: {},
    skillPoints: 110,
    allowedSkills: ["leerEscribir", "culto", "astrologia"],
    equipment: [
      gear({ name: "Cuadernos y notas", notes: "Material de estudio" }),
      gear({ name: "Manual escolástico", notes: "Texto de referencia" }),
      gear({ name: "Tintero y pluma", equipped: true })
    ],
    money: "Poco"
  },

  mendigo: {
    label: "Mendigo",
    society: ["cristiana", "judia", "islamica"],
    socialClass: ["marginado"],
    ethnicities: [],
    kingdoms: [],
    sex: [],
    minStats: {},
    skillPoints: 95,
    allowedSkills: ["sigilo", "descubrir", "persuasion"],
    equipment: [
      gear({ name: "Manta raída", equipped: true }),
      gear({ name: "Cuenco de limosna", equipped: true }),
      gear({ name: "Hatillo miserable", notes: "Pocas pertenencias" })
    ],
    money: "Ninguno"
  }
};

export function getProfessionRaw(key) {
  return PROFESSIONS_RAW[key] ? clone(PROFESSIONS_RAW[key]) : null;
}

export function getProfessionKeys() {
  return Object.keys(PROFESSIONS_RAW);
}

export function professionOptionsRAW(validKeys = null) {
  const keys = Array.isArray(validKeys) && validKeys.length
    ? validKeys.filter(key => !!PROFESSIONS_RAW[key])
    : Object.keys(PROFESSIONS_RAW);

  return keys
    .map(key => [key, PROFESSIONS_RAW[key].label])
    .sort((a, b) => a[1].localeCompare(b[1], "es"));
}

export function professionMatchesTree(professionKey, {
  society = "",
  socialClassKey = "",
  ethnicityKey = "",
  kingdomKey = "",
  sex = ""
} = {}) {
  const prof = PROFESSIONS_RAW[professionKey];
  if (!prof) return false;

  if (prof.society?.length && society && !prof.society.includes(society)) return false;
  if (prof.socialClass?.length && socialClassKey && !prof.socialClass.includes(socialClassKey)) return false;
  if (prof.ethnicities?.length && ethnicityKey && !prof.ethnicities.includes(ethnicityKey)) return false;
  if (prof.kingdoms?.length && kingdomKey && !prof.kingdoms.includes(kingdomKey)) return false;
  if (prof.sex?.length && sex && !prof.sex.includes(sex)) return false;

  return true;
}

export function getValidProfessionKeys({
  society = "",
  socialClassKey = "",
  ethnicityKey = "",
  kingdomKey = "",
  sex = ""
} = {}) {
  return Object.keys(PROFESSIONS_RAW).filter(key =>
    professionMatchesTree(key, {
      society,
      socialClassKey,
      ethnicityKey,
      kingdomKey,
      sex
    })
  );
}
