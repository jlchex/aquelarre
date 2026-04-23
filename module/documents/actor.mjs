import {
  rollPercent,
  rollFormula,
  getHitLocation,
  compareAttackDefense,
  postSimpleMessage,
  clampPercent,
  DIFFICULTY_MODS,
  getMaximumFormulaDamage
} from "../combat/rolls.mjs";

import {
  PROFESSIONS_RAW,
  getProfessionRaw,
  getValidProfessionKeys,
  validateProfessionForActorData,
  buildProfessionItemsForCreation
} from "../chargen/professions-raw.mjs";

import {
  KINGDOMS,
  ETHNICITIES_RAW,
  SOCIAL_CLASSES,
  getEthnicitySociety,
  getAllowedSocialClassKeysForEthnicity
} from "../chargen/creation-tree.mjs";

/* -------------------------------------------- */
/*  Defaults / Pure Helpers                     */
/* -------------------------------------------- */

function getDefaultCharacteristics() {
  return {
    fue: { label: "FUE", value: 10 },
    agi: { label: "AGI", value: 10 },
    hab: { label: "HAB", value: 10 },
    res: { label: "RES", value: 10 },
    per: { label: "PER", value: 10 },
    com: { label: "COM", value: 10 },
    cul: { label: "CUL", value: 10 }
  };
}

function getDefaultSkills() {
  return {
    alquimia: { label: "Alquimia", base: "cul", baseValue: 0, invested: 0, total: 0, group: "general" },
    astrologia: { label: "Astrología", base: "cul", baseValue: 0, invested: 0, total: 0, group: "general" },
    descubrir: { label: "Descubrir", base: "per", baseValue: 0, invested: 0, total: 0, group: "general" },
    esquivar: { label: "Esquivar", base: "agi", baseValue: 0, invested: 0, total: 0, group: "general" },
    leer_y_escribir: { label: "Leer y escribir", base: "cul", baseValue: 0, invested: 0, total: 0, group: "general" },
    medicina: { label: "Medicina", base: "cul", baseValue: 0, invested: 0, total: 0, group: "general" },
    persuasion: { label: "Persuasión", base: "com", baseValue: 0, invested: 0, total: 0, group: "general" },
    sigilo: { label: "Sigilo", base: "agi", baseValue: 0, invested: 0, total: 0, group: "general" },
    culto: { label: "Culto", base: "cul", baseValue: 0, invested: 0, total: 0, group: "general" },

    arcos: { label: "Arcos", base: "per", baseValue: 0, invested: 0, total: 0, group: "armas" },
    ballestas: { label: "Ballestas", base: "per", baseValue: 0, invested: 0, total: 0, group: "armas" },
    cuchillos: { label: "Cuchillos", base: "hab", baseValue: 0, invested: 0, total: 0, group: "armas" },
    escudos: { label: "Escudos", base: "hab", baseValue: 0, invested: 0, total: 0, group: "armas" },
    espadas: { label: "Espadas", base: "hab", baseValue: 0, invested: 0, total: 0, group: "armas" },
    espadones: { label: "Espadones", base: "fue", baseValue: 0, invested: 0, total: 0, group: "armas" },
    hachas: { label: "Hachas", base: "fue", baseValue: 0, invested: 0, total: 0, group: "armas" },
    hondas: { label: "Hondas", base: "per", baseValue: 0, invested: 0, total: 0, group: "armas" },
    lanzas: { label: "Lanzas", base: "agi", baseValue: 0, invested: 0, total: 0, group: "armas" },
    mazas: { label: "Mazas", base: "fue", baseValue: 0, invested: 0, total: 0, group: "armas" },
    palos: { label: "Palos", base: "agi", baseValue: 0, invested: 0, total: 0, group: "armas" },
    pelea: { label: "Pelea", base: "agi", baseValue: 0, invested: 0, total: 0, group: "armas" }
  };
}

function mergeCharacteristicDefaults(characteristics = {}) {
  const defaults = getDefaultCharacteristics();
  const merged = {};

  for (const [key, def] of Object.entries(defaults)) {
    merged[key] = {
      label: characteristics[key]?.label ?? def.label,
      value: Number.isFinite(Number(characteristics[key]?.value))
        ? Number(characteristics[key].value)
        : def.value
    };
  }

  return merged;
}

function mergeSkillDefaults(skills = {}) {
  const defaults = getDefaultSkills();
  const merged = {};

  for (const [key, def] of Object.entries(defaults)) {
    const legacyKey =
      key === "leer_y_escribir" && skills.leerEscribir
        ? "leerEscribir"
        : key;

    merged[key] = {
      label: skills[legacyKey]?.label ?? def.label,
      base: skills[legacyKey]?.base ?? def.base,
      baseValue: Number.isFinite(Number(skills[legacyKey]?.baseValue)) ? Number(skills[legacyKey].baseValue) : 0,
      invested: Number.isFinite(Number(skills[legacyKey]?.invested)) ? Number(skills[legacyKey].invested) : 0,
      total: Number.isFinite(Number(skills[legacyKey]?.total)) ? Number(skills[legacyKey].total) : 0,
      group: skills[legacyKey]?.group ?? def.group
    };
  }

  return merged;
}

function getDefaultSecondary(res = 10, luck = 30) {
  return {
    luck: { label: "Suerte", value: luck },
    luckCurrent: { label: "Suerte actual", value: luck },
    temperance: { label: "Templanza", value: 0 },
    rr: { label: "RR", value: 50 },
    irr: { label: "IRR", value: 50 },
    pf: { label: "PF", value: 0 },
    pc: { label: "PC", value: 0 },
    pv: { label: "PV", value: res, max: res },
    aspect: { label: "Aspecto", value: 0, text: "" }
  };
}

function mergeSecondaryDefaults(secondary = {}, res = 10, luck = 30) {
  const defaults = getDefaultSecondary(res, luck);

  return {
    luck: {
      label: secondary.luck?.label ?? defaults.luck.label,
      value: Number.isFinite(Number(secondary.luck?.value))
        ? Number(secondary.luck.value)
        : defaults.luck.value
    },
    luckCurrent: {
      label: secondary.luckCurrent?.label ?? defaults.luckCurrent.label,
      value: Number.isFinite(Number(secondary.luckCurrent?.value))
        ? Number(secondary.luckCurrent.value)
        : defaults.luckCurrent.value
    },
    temperance: {
      label: secondary.temperance?.label ?? defaults.temperance.label,
      value: Number.isFinite(Number(secondary.temperance?.value))
        ? Number(secondary.temperance.value)
        : defaults.temperance.value
    },
    rr: {
      label: secondary.rr?.label ?? defaults.rr.label,
      value: Number.isFinite(Number(secondary.rr?.value))
        ? Number(secondary.rr.value)
        : defaults.rr.value
    },
    irr: {
      label: secondary.irr?.label ?? defaults.irr.label,
      value: Number.isFinite(Number(secondary.irr?.value))
        ? Number(secondary.irr.value)
        : defaults.irr.value
    },
    pf: {
      label: secondary.pf?.label ?? defaults.pf.label,
      value: Number.isFinite(Number(secondary.pf?.value))
        ? Number(secondary.pf.value)
        : defaults.pf.value
    },
    pc: {
      label: secondary.pc?.label ?? defaults.pc.label,
      value: Number.isFinite(Number(secondary.pc?.value))
        ? Number(secondary.pc.value)
        : defaults.pc.value
    },
    pv: {
      label: secondary.pv?.label ?? defaults.pv.label,
      value: Number.isFinite(Number(secondary.pv?.value))
        ? Number(secondary.pv.value)
        : defaults.pv.value,
      max: Number.isFinite(Number(secondary.pv?.max))
        ? Number(secondary.pv.max)
        : defaults.pv.max
    },
    aspect: {
      label: secondary.aspect?.label ?? defaults.aspect.label,
      value: Number.isFinite(Number(secondary.aspect?.value))
        ? Number(secondary.aspect.value)
        : defaults.aspect.value,
      text: secondary.aspect?.text ?? defaults.aspect.text
    }
  };
}

function mergeCombatDefaults(combat = {}) {
  return {
    actions: {
      current: Number.isFinite(Number(combat.actions?.current)) ? Number(combat.actions.current) : 2,
      max: 2
    },
    attackModifier: Number.isFinite(Number(combat.attackModifier)) ? Number(combat.attackModifier) : 0,
    defenseModifier: Number.isFinite(Number(combat.defenseModifier)) ? Number(combat.defenseModifier) : 0,
    difficulty: combat.difficulty ?? "normal",
    activeWeaponId: combat.activeWeaponId ?? "",
    defenseMode: combat.defenseMode ?? "skill",
    defenseSkill: combat.defenseSkill ?? "esquivar",
    defenseWeaponId: combat.defenseWeaponId ?? "",
    defenseShieldId: combat.defenseShieldId ?? "",
    meleeMode: Boolean(combat.meleeMode),
    aimLocation: combat.aimLocation ?? "",
    aimModifier: Number.isFinite(Number(combat.aimModifier)) ? Number(combat.aimModifier) : -25,
    armorTotal: Number.isFinite(Number(combat.armorTotal)) ? Number(combat.armorTotal) : 0,
    initiative: Number.isFinite(Number(combat.initiative)) ? Number(combat.initiative) : 0,
    lastFumble: combat.lastFumble ?? "",
    lastCritical: combat.lastCritical ?? "",
    lastHitLocation: combat.lastHitLocation ?? "",
    lastArmorAbsorbed: Number.isFinite(Number(combat.lastArmorAbsorbed)) ? Number(combat.lastArmorAbsorbed) : 0,
    lastRawDamage: Number.isFinite(Number(combat.lastRawDamage)) ? Number(combat.lastRawDamage) : 0,
    lastFinalDamage: Number.isFinite(Number(combat.lastFinalDamage)) ? Number(combat.lastFinalDamage) : 0,
    statusEffects: Array.isArray(combat.statusEffects) ? combat.statusEffects : []
  };
}

function mergeCreationDefaults(creation = {}) {
  return {
    skillPoints: Number.isFinite(Number(creation.skillPoints)) ? Number(creation.skillPoints) : 0,
    allowedSkills: Array.isArray(creation.allowedSkills) ? creation.allowedSkills : [],
    professionKey: creation.professionKey ?? "",
    kingdom: creation.kingdom ?? "",
    society: creation.society ?? "",
    ethnicityKey: creation.ethnicityKey ?? "",
    socialClassKey: creation.socialClassKey ?? "",
    fatherProfessionKey: creation.fatherProfessionKey ?? "",
    validProfessionKeys: Array.isArray(creation.validProfessionKeys) ? creation.validProfessionKeys : []
  };
}

function normalizeSkillKey(value, fallback = "espadas") {
  const normalized = String(value ?? fallback).trim().toLowerCase();

  if (normalized === "leerescribir") return "leer_y_escribir";
  if (normalized === "leer_escribir") return "leer_y_escribir";

  return normalized;
}

function normalizeLocationKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("-", "_");
}

const HEALTH_STATE_EFFECT_TYPES = [
  "herido",
  "malherido",
  "inconsciente",
  "muerto",
  "incapacitado",
  "moribundo"
];

function getRawHealthStateData(currentPv, maxPv) {
  const pv = Number(currentPv ?? 0);
  const max = Math.max(0, Number(maxPv ?? 0));

  if (max <= 0) {
    return {
      state: "sano",
      label: "Sano",
      lostPv: 0,
      movementDivisor: 1,
      damageBonusFactor: 1,
      unableToAct: false
    };
  }

  const lostPv = Math.max(0, max - pv);

  if (pv <= -max) {
    return {
      state: "muerto",
      label: "Muerto",
      lostPv,
      movementDivisor: null,
      damageBonusFactor: 0,
      unableToAct: true
    };
  }

  if (pv <= 0) {
    return {
      state: "inconsciente",
      label: "Inconsciente",
      lostPv,
      movementDivisor: null,
      damageBonusFactor: 0,
      unableToAct: true
    };
  }

  if (lostPv >= Math.ceil((max * 3) / 4)) {
    return {
      state: "malherido",
      label: "Malherido",
      lostPv,
      movementDivisor: 4,
      damageBonusFactor: 0,
      unableToAct: false
    };
  }

  if (lostPv >= Math.ceil(max / 2)) {
    return {
      state: "herido",
      label: "Herido",
      lostPv,
      movementDivisor: 2,
      damageBonusFactor: 0.5,
      unableToAct: false
    };
  }

  return {
    state: "sano",
    label: "Sano",
    lostPv,
    movementDivisor: 1,
    damageBonusFactor: 1,
    unableToAct: false
  };
}

function isMeleeEligibleWeapon(weapon) {
  if (!weapon || weapon.type !== "weapon") return false;

  const skillKey = normalizeSkillKey(weapon.system?.skill ?? "", "");
  const isUnarmed = skillKey === "pelea";

  // En melé solo se permiten armas de tamaño ligero (cuchillos, dagas, etc.).
  // Regla RAW Aquelarre (Arcana Demoni FAQ): "armas de tamaño ligero, básicamente
  // casi todos los cuchillos y la tripa".
  const size = String(weapon.system?.size ?? "media").trim().toLowerCase();
  const isLightWeapon = size === "ligera";

  return isUnarmed || isLightWeapon;
}

function getLocalizedInjuryFromHit(locationKey, finalDamage) {
  const location = normalizeLocationKey(locationKey);
  const damage = Number(finalDamage ?? 0);

  if (location === "cabeza" && damage >= 6) {
    return { type: "aturdido", label: "Aturdido", location };
  }

  if (["brazo_izquierdo", "brazo_derecho"].includes(location) && damage >= 5) {
    return { type: "brazo_inutilizado", label: "Brazo inutilizado", location };
  }

  if (["pierna_izquierda", "pierna_derecha"].includes(location) && damage >= 5) {
    return { type: "pierna_inutilizada", label: "Pierna inutilizada", location };
  }

  return null;
}

async function evaluateFormulaTotal(formula = "1d10") {
  const roll = await (new Roll(formula)).evaluate({ async: true });
  return Number(roll.total ?? 0);
}

async function getSequelaFromHit(actor, locationKey, rawDamage, maxPv) {
  const damage = Math.max(0, Number(rawDamage ?? 0));
  const pvMax = Math.max(0, Number(maxPv ?? 0));
  const threshold = Math.ceil(pvMax / 2);

  if (!pvMax || damage < threshold) return null;

  const location = normalizeLocationKey(locationKey);
  const res = Math.max(1, Number(actor.system.characteristics?.res?.value ?? 10));
  const roll = await evaluateFormulaTotal("1d10");

  const result = {
    triggered: true,
    threshold,
    roll,
    location,
    label: "Secuela",
    description: "",
    statusEffects: [],
    setPvValue: null,
    updates: {},
    appliedChanges: []
  };

  const currentHab = Math.max(1, Number(actor.system.characteristics?.hab?.value ?? 10));
  const currentAgi = Math.max(1, Number(actor.system.characteristics?.agi?.value ?? 10));
  const currentFue = Math.max(1, Number(actor.system.characteristics?.fue?.value ?? 10));
  const currentCul = Math.max(1, Number(actor.system.characteristics?.cul?.value ?? 10));
  const currentCom = Math.max(1, Number(actor.system.characteristics?.com?.value ?? 10));
  const currentAspect = Number(actor.system.secondary?.aspect?.value ?? 0);

  const setCharacteristic = (key, currentValue, nextValue, label) => {
    const finalValue = Math.max(1, Math.trunc(nextValue));
    result.updates[`system.characteristics.${key}.value`] = finalValue;
    result.appliedChanges.push(`${label}: ${currentValue} → ${finalValue}`);
  };

  const setAspect = (nextValue, label = "Aspecto") => {
    const finalValue = Math.trunc(nextValue);
    result.updates["system.secondary.aspect.value"] = finalValue;
    result.appliedChanges.push(`${label}: ${currentAspect} → ${finalValue}`);
  };

  switch (location) {
    case "brazo_derecho":
    case "brazo_izquierdo":
      if (roll <= 4) {
        result.label = "Cicatriz";
        result.description = "El golpe deja una cicatriz permanente en el brazo.";
      } else if (roll <= 6) {
        result.label = "Brazo malherido";
        result.description = `El brazo queda inutilizado durante ${Math.max(1, 25 - res)} días.`;
        result.statusEffects.push({ type: "brazo_inutilizado", label: "Brazo malherido", location });
      } else if (roll <= 8) {
        result.label = "Tendones rotos";
        result.description = "Secuela permanente: -1 HAB.";
        setCharacteristic("hab", currentHab, currentHab - 1, "HAB");
      } else if (roll === 9) {
        result.label = "Mano cortada";
        result.description = "El personaje queda manco en esa mano.";
      } else {
        result.label = "Brazo cortado";
        result.description = "El brazo queda amputado permanentemente. HAB se reduce a la mitad.";
        result.statusEffects.push({ type: "brazo_inutilizado", label: "Brazo cortado", location });
        setCharacteristic("hab", currentHab, Math.floor(currentHab / 2), "HAB");
      }
      break;

    case "pierna_derecha":
    case "pierna_izquierda":
      if (roll <= 4) {
        result.label = "Cicatriz";
        result.description = "El golpe deja una cicatriz permanente en la pierna.";
      } else if (roll <= 6) {
        result.label = "Pierna malherida";
        result.description = `La pierna queda inutilizada durante ${Math.max(1, 25 - res)} días.`;
        result.statusEffects.push({ type: "pierna_inutilizada", label: "Pierna malherida", location });
      } else if (roll <= 8) {
        result.label = "Tendones rotos";
        result.description = "Secuela permanente: el personaje queda cojo.";
      } else if (roll === 9) {
        result.label = "Pie cortado";
        result.description = "Secuela permanente: -3 AGI y movimiento a la mitad.";
        setCharacteristic("agi", currentAgi, currentAgi - 3, "AGI");
      } else {
        result.label = "Pierna cortada";
        result.description = "La pierna queda amputada permanentemente. AGI se reduce a la mitad.";
        result.statusEffects.push({ type: "pierna_inutilizada", label: "Pierna cortada", location });
        setCharacteristic("agi", currentAgi, Math.floor(currentAgi / 2), "AGI");
      }
      break;

    case "cabeza": {
      if (roll <= 2) {
        const rounds = await evaluateFormulaTotal("2d6");
        result.label = "Conmoción";
        result.description = `El objetivo queda aturdido durante ${rounds} asaltos y pierde la iniciativa automáticamente.`;
        result.statusEffects.push({ type: "aturdido", label: "Conmoción", location, remainingTurns: rounds, notes: "Pierde la iniciativa automáticamente." });
      } else if (roll <= 4) {
        const aspectLoss = await evaluateFormulaTotal("1d6");
        result.label = "Cicatriz";
        result.description = `Secuela permanente: cicatriz facial (-${aspectLoss} Aspecto).`;
        setAspect(currentAspect - aspectLoss);
      } else if (roll === 5) {
        result.label = "Nariz rota";
        result.description = "Secuela permanente: -2 Aspecto y -25% Degustar.";
        setAspect(currentAspect - 2);
      } else if (roll === 6) {
        result.label = "Lengua cortada";
        result.description = "El personaje no puede hablar con normalidad.";
      } else if (roll === 7) {
        result.label = "Pierde una oreja";
        result.description = "Secuela permanente: sordera parcial.";
      } else if (roll === 8) {
        result.label = "Pierde un ojo";
        result.description = "Secuela permanente: tuerto o ceguera.";
      } else if (roll === 9) {
        const rounds = Math.max(1, 25 - res);
        result.label = "Conmoción cerebral grave";
        result.description = `El objetivo queda inconsciente durante ${rounds} asaltos; además sufre secuelas permanentes en Cultura y Comunicación.`;
        result.statusEffects.push({ type: "inconsciente_temporal", label: "Conmoción cerebral grave", location, remainingTurns: rounds, notes: "No puede actuar mientras dure." });
        setCharacteristic("cul", currentCul, Math.floor(currentCul / 2), "CUL");
        setCharacteristic("com", currentCom, Math.floor(currentCom / 2), "COM");
      } else {
        result.label = "Muerte instantánea";
        result.description = "El golpe en la cabeza mata al objetivo en el acto.";
        result.setPvValue = -pvMax;
      }
      break;
    }

    case "torso":
      if (roll <= 3) {
        result.label = "Cicatriz";
        result.description = "El golpe deja una cicatriz permanente en el pecho.";
      } else if (roll <= 6) {
        result.label = "Costillas rotas";
        result.description = "Hasta sanar: movimiento y esfuerzos al 50%.";
      } else if (roll === 7) {
        result.label = "Daños internos";
        result.description = "Secuela permanente: -1 RES.";
        setCharacteristic("res", res, res - 1, "RES");
      } else if (roll === 8) {
        result.label = "Pulmones dañados";
        result.description = "Secuela permanente: -2 RES y -2 FUE.";
        setCharacteristic("res", res, res - 2, "RES");
        setCharacteristic("fue", currentFue, currentFue - 2, "FUE");
      } else if (roll === 9) {
        result.label = "Corazón dañado";
        result.description = "Si no recibe Sanar, morirá en 3 asaltos.";
        result.statusEffects.push({ type: "corazon_danado", label: "Corazón dañado", location, remainingTurns: 3, notes: "Morirá al expirar si no recibe Sanar." });
      } else {
        result.label = "Lesión de columna";
        result.description = "Herida catastrófica: puede provocar muerte instantánea o parálisis según el arma.";
      }
      break;

    case "abdomen":
      if (roll <= 4) {
        result.label = "Cicatriz";
        result.description = "El golpe deja una cicatriz permanente en el abdomen.";
      } else if (roll <= 6) {
        const rounds = Math.max(1, 25 - res);
        result.label = "Desgarro";
        result.description = `El objetivo queda incapacitado durante ${rounds} asaltos.`;
        result.statusEffects.push({ type: "incapacitado_temporal", label: "Desgarro", location, remainingTurns: rounds, notes: "No puede actuar mientras dure." });
      } else if (roll === 7) {
        result.label = "Genitales destrozados";
        result.description = "Secuela grave y permanente.";
      } else if (roll === 8) {
        result.label = "Daños internos";
        result.description = "Secuela permanente: -1 RES.";
        setCharacteristic("res", res, res - 1, "RES");
      } else if (roll === 9) {
        result.label = "Pelvis fracturada";
        result.description = "Secuela permanente: -2 FUE, -2 AGI y el personaje queda cojo.";
        setCharacteristic("fue", currentFue, currentFue - 2, "FUE");
        setCharacteristic("agi", currentAgi, currentAgi - 2, "AGI");
      } else {
        result.label = "Columna afectada";
        result.description = "Herida catastrófica: puede provocar muerte instantánea o parálisis según el arma.";
      }
      break;

    default:
      return null;
  }

  return result;
}

function getLocationLabel(locationKey) {
  const key = normalizeLocationKey(locationKey);

  const labels = {
    cabeza: "Cabeza",
    torso: "Torso",
    abdomen: "Abdomen",
    brazo_izquierdo: "Brazo izquierdo",
    brazo_derecho: "Brazo derecho",
    pierna_izquierda: "Pierna izquierda",
    pierna_derecha: "Pierna derecha",
    general: "General"
  };

  return labels[key] ?? key;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const FATHER_PROFESSIONS_RAW = {
  campesino: {
    label: "Campesino",
    bonuses: { descubrir: 5, palos: 5 }
  },
  artesano: {
    label: "Artesano",
    bonuses: { alquimia: 5, leer_y_escribir: 5 }
  },
  mercader: {
    label: "Mercader",
    bonuses: { persuasion: 10 }
  },
  soldado: {
    label: "Soldado",
    bonuses: { espadas: 10 }
  },
  cazador: {
    label: "Cazador",
    bonuses: { arcos: 10 }
  },
  marinero: {
    label: "Marinero",
    bonuses: { descubrir: 5, hondas: 5 }
  },
  clerigo: {
    label: "Clérigo",
    bonuses: { culto: 10 }
  },
  curandero: {
    label: "Curandero",
    bonuses: { medicina: 10 }
  },
  ladron: {
    label: "Ladrón",
    bonuses: { sigilo: 10 }
  },
  erudito: {
    label: "Erudito",
    bonuses: { leer_y_escribir: 10 }
  },
  herrero: {
    label: "Herrero",
    bonuses: { mazas: 5, espadones: 5 }
  },
  noble: {
    label: "Noble",
    bonuses: { persuasion: 5, espadas: 5 }
  }
};

export class AquelarreActor extends Actor {
  /* -------------------------------------------- */
  /*  Lifecycle / Derived Data                    */
  /* -------------------------------------------- */

  prepareDerivedData() {
    super.prepareDerivedData();

    const system = this.system;
    if (!system) return;

    if (!system.bio) system.bio = {};
    if (!system.economy) system.economy = { money: "", monthlyIncome: "", weeklyExpense: "" };
    if (!system.inventory) system.inventory = { possessions: "", carriedEquipment: "" };
    if (!system.magic) system.magic = { spellsNotes: "", ritualsNotes: "" };

    system.creation = mergeCreationDefaults(system.creation);
    system.characteristics = mergeCharacteristicDefaults(system.characteristics);
    system.skills = mergeSkillDefaults(system.skills);

    const ch = system.characteristics;
    const res = Number(ch.res?.value ?? 10);
    const com = Number(ch.com?.value ?? 10);
    const per = Number(ch.per?.value ?? 10);
    const cul = Number(ch.cul?.value ?? 10);
    const computedLuck = com + per + cul;

    system.secondary = mergeSecondaryDefaults(system.secondary, res, computedLuck);
    system.combat = mergeCombatDefaults(system.combat);

    const fatherBonusMap = this.getFatherProfessionBonusMap();
    for (const [skillKey, skill] of Object.entries(system.skills)) {
      const baseVal = Number(ch?.[skill.base]?.value ?? 0);
      const fatherBonus = Number(fatherBonusMap[normalizeSkillKey(skillKey, skillKey)] ?? 0);
      skill.baseValue = baseVal;
      skill.invested = Number(skill.invested ?? 0);
      skill.fatherBonus = Number.isFinite(fatherBonus) ? fatherBonus : 0;
      skill.total = baseVal + skill.invested + skill.fatherBonus;
    }

    const sec = system.secondary;
    const combat = system.combat;

    sec.luck.value = computedLuck;
    if (!Number.isFinite(Number(sec.luckCurrent.value))) sec.luckCurrent.value = computedLuck;

    sec.pv.max = res;
    if (!Number.isFinite(Number(sec.pv.value)) || Number(sec.pv.value) > res) sec.pv.value = res;

    const rr = Number(sec.rr?.value ?? 50);
    if ((rr + Number(sec.irr?.value ?? 50)) !== 100) sec.irr.value = Math.max(0, 100 - rr);

    const current = Number(combat.actions.current);
    combat.actions.current = Number.isFinite(current) ? Math.max(0, Math.min(current, 2)) : 2;
    combat.actions.max = 2;

    const equippedArmor = this.items.filter(i => i.type === "armor" && i.system.equipped);
    combat.armorTotal = equippedArmor.reduce((sum, item) => sum + Number(item.system.protection || 0), 0);
  }

  async ensureActorDefaults() {
    const currentCharacteristics = mergeCharacteristicDefaults(this.system.characteristics);
    const res = Number(currentCharacteristics.res?.value ?? 10);
    const com = Number(currentCharacteristics.com?.value ?? 10);
    const per = Number(currentCharacteristics.per?.value ?? 10);
    const cul = Number(currentCharacteristics.cul?.value ?? 10);
    const computedLuck = com + per + cul;

    const skills = mergeSkillDefaults(this.system.skills);
    const fatherBonusMap = this.getFatherProfessionBonusMap();
    for (const [skillKey, skill] of Object.entries(skills)) {
      const baseVal = Number(currentCharacteristics?.[skill.base]?.value ?? 0);
      const fatherBonus = Number(fatherBonusMap[normalizeSkillKey(skillKey, skillKey)] ?? 0);
      skill.baseValue = baseVal;
      skill.invested = Number(skill.invested ?? 0);
      skill.fatherBonus = Number.isFinite(fatherBonus) ? fatherBonus : 0;
      skill.total = baseVal + skill.invested + skill.fatherBonus;
    }

    await this.update({
      "system.creation": mergeCreationDefaults(this.system.creation),
      "system.characteristics": currentCharacteristics,
      "system.skills": skills,
      "system.secondary": mergeSecondaryDefaults(this.system.secondary, res, computedLuck),
      "system.combat": mergeCombatDefaults(this.system.combat),
      "system.economy": this.system.economy ?? { money: "", monthlyIncome: "", weeklyExpense: "" },
      "system.inventory": this.system.inventory ?? { possessions: "", carriedEquipment: "" },
      "system.magic": this.system.magic ?? { spellsNotes: "", ritualsNotes: "" }
    });
  }

  /* -------------------------------------------- */
  /*  Combat                                      */
  /* -------------------------------------------- */

  canSpendCombatAction(cost = 1) {
    if (this.isUnableToActInCombat()) return false;
    const current = Number(this.system.combat?.actions?.current ?? 0);
    return current >= cost;
  }

  async spendCombatAction(cost = 1) {
    const current = Number(this.system.combat?.actions?.current ?? 0);
    const next = Math.max(0, current - cost);

    await this.update({
      "system.combat.actions.current": next
    });

    return next;
  }

  async clearCombatStatusEffects() {
    await this.update({
      "system.combat.statusEffects": [],
      "system.combat.lastFumble": "",
      "system.combat.lastCritical": "",
      "system.combat.lastHitLocation": "",
      "system.combat.lastArmorAbsorbed": 0,
      "system.combat.lastRawDamage": 0,
      "system.combat.lastFinalDamage": 0
    });
  }

  async resetCombatActions() {
    const maxActions = Number(this.system.combat?.actions?.max ?? 2);
    const nextActions = this.isUnableToActInCombat() ? 0 : Math.max(0, maxActions);

    await this.update({
      "system.combat.actions.current": nextActions
    });
  }

  async resetCombatState() {
    const maxActions = Number(this.system.combat?.actions?.max ?? 2);
    const nextActions = this.isUnableToActInCombat() ? 0 : Math.max(0, maxActions);

    await this.update({
      "system.combat.actions.current": nextActions,
      "system.combat.initiative": 0,
      "system.combat.statusEffects": [],
      "system.combat.lastFumble": "",
      "system.combat.lastCritical": "",
      "system.combat.lastHitLocation": "",
      "system.combat.lastArmorAbsorbed": 0,
      "system.combat.lastRawDamage": 0,
      "system.combat.lastFinalDamage": 0
    });
  }

  getWeaponById(weaponId) {
    if (!weaponId) return null;
    return this.items.get(weaponId) ?? null;
  }

  getEquippedWeapons() {
    return this.items.filter(i => i.type === "weapon" && i.system.equipped);
  }

  getPrimaryEquippedWeapon() {
    return this.getEquippedWeapons()[0] ?? null;
  }

  async setActiveWeapon(weaponId) {
    const weapon = this.items.get(weaponId);
    if (!weapon || weapon.type !== "weapon") return;

    // Asegurar que esté equipada
    if (!weapon.system.equipped) {
      await weapon.update({ "system.equipped": true });
    }

    await this.update({ "system.combat.activeWeaponId": weaponId });
  }

  async clearActiveWeapon() {
    await this.update({ "system.combat.activeWeaponId": "" });
  }

  getEquippedShields() {
    return this.items.filter(i => i.type === "shield" && i.system.equipped);
  }

  getEquippedShield() {
    return this.getEquippedShields()[0] ?? null;
  }

  getEquippedArmors() {
    return this.items.filter(i => i.type === "armor" && i.system.equipped);
  }

  getEquippedArmorsForLocation(location) {
    const normalized = normalizeLocationKey(location);

    return this.getEquippedArmors().filter(item => {
      const armorLocation = normalizeLocationKey(item.system.location ?? "general");

      return armorLocation === "general"
        || armorLocation === normalized
        || (armorLocation === "brazos" && ["brazo_izquierdo", "brazo_derecho"].includes(normalized))
        || (armorLocation === "piernas" && ["pierna_izquierda", "pierna_derecha"].includes(normalized));
    });
  }

  getPrimaryArmorForLocation(location) {
    const matchingArmors = this.getEquippedArmorsForLocation(location);
    if (!matchingArmors.length) return null;

    return [...matchingArmors].sort((left, right) => {
      const protectionDiff = Number(right.system.protection ?? 0) - Number(left.system.protection ?? 0);
      if (protectionDiff !== 0) return protectionDiff;

      return Number(right.system.resistance ?? 0) - Number(left.system.resistance ?? 0);
    })[0];
  }

  getArmorProtectionForLocation(location) {
    const armors = this.getEquippedArmorsForLocation(location);
    if (!armors.length) return 0;

    return armors.reduce((sum, item) => {
      const protection = Number(item.system.protection ?? 0);
      return sum + protection;
    }, 0);
  }

  async applyArmorWearForLocation(location, amount = 0) {
    const armor = this.getPrimaryArmorForLocation(location);
    if (!armor) return null;

    const wear = Math.max(0, Number(amount ?? 0));
    if (wear <= 0) {
      return {
        armor,
        lost: 0,
        broken: false,
        resistanceAfter: Math.max(0, Number(armor.system.resistance ?? 0))
      };
    }

    const currentResistance = Math.max(0, Number(armor.system.resistance ?? 0));
    const resistanceAfter = Math.max(0, currentResistance - wear);
    const broken = resistanceAfter <= 0;

    await armor.update({
      "system.resistance": resistanceAfter,
      ...(broken && armor.system.equipped ? { "system.equipped": false } : {})
    });

    return {
      armor,
      lost: currentResistance - resistanceAfter,
      broken,
      resistanceAfter
    };
  }

  getDefenseBonusFromEquipment(defenseSkillKey = "") {
    const skillKey = String(defenseSkillKey ?? "").trim();
    let bonus = 0;

    if (skillKey === "escudos") {
      const shield = this.getEquippedShield();
      if (shield) bonus += Number(shield.system.defenseBonus ?? 0);
    }

    if (skillKey !== "escudos") {
      const weapon = this.getWeaponById(this.system.combat?.defenseWeaponId) ?? this.getPrimaryEquippedWeapon();
      if (weapon?.system?.defensive) {
        bonus += Number(weapon.system.parryBonus ?? 0);
      }
    }

    return bonus;
  }

  getDifficultyMod() {
    return Number(DIFFICULTY_MODS[this.system.combat?.difficulty ?? "normal"] ?? 0);
  }

  getDefenseSourceData() {
    const mode = String(this.system.combat?.defenseMode ?? "skill");
    const defenseModifier = Number(this.system.combat?.defenseModifier ?? 0);
    const statusMods = this.getCombatStatusModifiers();

    if (mode === "weapon") {
      if (this.hasStatusEffect("brazo_inutilizado")) {
        return {
          label: "Arma",
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "brazo-inutilizado"
        };
      }

      const weaponId = this.system.combat?.defenseWeaponId ?? "";
      if (!weaponId) {
        return {
          label: "Arma",
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "sin-arma-defensa"
        };
      }

      const weapon = this.items.get(weaponId);
      if (!weapon || weapon.type !== "weapon") {
        return {
          label: "Arma",
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "arma-invalida"
        };
      }

      if (!weapon.system.equipped) {
        return {
          label: weapon.name,
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "arma-no-equipada"
        };
      }

      if (!weapon.system.defensive) {
        return {
          label: weapon.name,
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "arma-no-defensiva"
        };
      }

      const skillKey = normalizeSkillKey(weapon.system.skill, "");
      const data = this.getSkillTarget(skillKey);

      if (!data.skill) {
        return {
          label: weapon.name,
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "skill-arma-invalida"
        };
      }

      const parryBonus = Number(weapon.system.parryBonus ?? 0);

      return {
        label: `${weapon.name}`,
        target: clampPercent(data.target + parryBonus + statusMods.defenseMod),
        modifier: defenseModifier,
        valid: true,
        mode,
        itemId: weapon.id
      };
    }

    if (mode === "shield") {
      const shieldId = this.system.combat?.defenseShieldId ?? "";
      if (!shieldId) {
        return {
          label: "Escudo",
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "sin-escudo-defensa"
        };
      }

      const shield = this.items.get(shieldId);
      if (!shield || shield.type !== "shield") {
        return {
          label: "Escudo",
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "escudo-invalido"
        };
      }

      if (!shield.system.equipped) {
        return {
          label: shield.name,
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "escudo-no-equipado"
        };
      }

      const resistance = Math.max(0, Number(shield.system.resistance ?? 0));
      if (resistance <= 0) {
        return {
          label: shield.name,
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "escudo-roto"
        };
      }

      const skillKey = normalizeSkillKey(shield.system.skill, "");
      const data = this.getSkillTarget(skillKey);

      if (!data.skill) {
        return {
          label: shield.name,
          target: 0,
          modifier: defenseModifier,
          valid: false,
          reason: "skill-escudo-invalida"
        };
      }

      const bonus = Number(shield.system.defenseBonus ?? 0);

      return {
        label: `${shield.name}`,
        target: clampPercent(data.target + bonus + statusMods.defenseMod),
        modifier: defenseModifier,
        valid: true,
        mode,
        itemId: shield.id
      };
    }

    const defenseSkillKey = String(this.system.combat?.defenseSkill ?? "").trim();
    if (!defenseSkillKey) {
      return {
        label: "Defensa",
        target: 0,
        modifier: defenseModifier,
        valid: false,
        reason: "sin-skill-defensa"
      };
    }

    const data = this.getSkillTarget(defenseSkillKey);
    if (!data.skill) {
      return {
        label: defenseSkillKey,
        target: 0,
        modifier: defenseModifier,
        valid: false,
        reason: "skill-defensa-invalida"
      };
    }

    let target = data.target + statusMods.defenseMod;

    if (data.key === "esquivar") {
      target += statusMods.dodgeMod;
    }

    return {
      label: data.skill.label ?? "Defensa",
      target: clampPercent(target),
      modifier: defenseModifier,
      valid: true,
      mode,
      itemId: ""
    };
  }

  async applyShieldWear(shieldId, amount = 1) {
    if (!shieldId) return null;

    const shield = this.items.get(shieldId);
    if (!shield || shield.type !== "shield") return null;

    const wear = Math.max(0, Number(amount ?? 0));
    if (wear <= 0) {
      return {
        shield,
        lost: 0,
        broken: false,
        resistanceAfter: Math.max(0, Number(shield.system.resistance ?? 0))
      };
    }

    const currentResistance = Math.max(0, Number(shield.system.resistance ?? 0));
    const resistanceAfter = Math.max(0, currentResistance - wear);
    const updates = {
      "system.resistance": resistanceAfter
    };
    const broken = resistanceAfter <= 0;

    if (broken && shield.system.equipped) {
      updates["system.equipped"] = false;
    }

    await shield.update(updates);

    if (broken && this.system.combat?.defenseShieldId === shield.id) {
      await this.update({ "system.combat.defenseShieldId": "" });
    }

    return {
      shield,
      lost: currentResistance - resistanceAfter,
      broken,
      resistanceAfter
    };
  }

  async rollInitiative() {
    if (this.isUnableToActInCombat()) {
      ui.notifications?.warn(`${this.name} no puede actuar en combate en su estado actual.`);
      return null;
    }

    const base = Number(this.system.characteristics?.agi?.value ?? 10);
    const roll = await rollFormula(this, "1d10", "Iniciativa");
    const total = base + roll.total;

    await this.update({ "system.combat.initiative": total });

    await postSimpleMessage(this, "Iniciativa", [
      `<strong>AGI base:</strong> ${base}`,
      `<strong>1d10:</strong> ${roll.total}`,
      `<strong>Total:</strong> ${total}`
    ]);

    return total;
  }

  async rollDefense() {
    if (this.isUnableToActInCombat()) {
      ui.notifications?.warn(`${this.name} no puede defenderse en su estado actual.`);
      return null;
    }

    const defense = this.getDefenseSourceData();

    if (!defense.valid) {
      let msg = `${this.name} no tiene una defensa válida configurada.`;

      if (defense.reason === "arma-no-defensiva") {
        msg = `${this.name} ha seleccionado un arma no defensiva para parar.`;
      } else if (defense.reason === "brazo-inutilizado") {
        msg = `${this.name} no puede parar con arma: tiene un brazo inutilizado.`;
      } else if (defense.reason === "sin-arma-defensa") {
        msg = `${this.name} no tiene arma de parada seleccionada.`;
      } else if (defense.reason === "sin-escudo-defensa") {
        msg = `${this.name} no tiene escudo seleccionado.`;
      } else if (defense.reason === "escudo-no-equipado") {
        msg = `${this.name} tiene un escudo seleccionado, pero no está equipado.`;
      } else if (defense.reason === "escudo-roto") {
        msg = `${this.name} tiene el escudo roto (RES 0). Debe repararlo o cambiar de defensa.`;
      } else if (defense.reason === "arma-no-equipada") {
        msg = `${this.name} tiene un arma de parada seleccionada, pero no está equipada.`;
      }

      ui.notifications?.warn(msg);
      return null;
    }

    const target = clampPercent(defense.target + defense.modifier + this.getDifficultyMod());
    const result = await this.rollPercent(target, `Defensa: ${defense.label}`);

    await this.update({
      "system.combat.lastFumble": result.fumble ? `Pifia de defensa: ${defense.label}` : "",
      "system.combat.lastCritical": result.critical ? `Defensa crítica: ${defense.label}` : ""
    });

    return result;
  }

  async rollWeaponAttack(itemId) {
    if (this.isUnableToActInCombat()) {
      ui.notifications?.warn(`${this.name} no puede atacar en su estado actual.`);
      return null;
    }

    const weapon = this.items.get(itemId);
    if (!weapon || weapon.type !== "weapon") return null;

    if (!weapon.system.equipped) {
      ui.notifications?.warn(`El arma ${weapon.name} no está equipada.`);
      return null;
    }

    const skillKey = String(weapon.system.skill ?? "").trim();
    const data = this.getSkillTarget(skillKey);

    if (!data.skill) {
      ui.notifications?.warn(`El arma ${weapon.name} usa una competencia no válida: ${weapon.system.skill}`);
      return null;
    }

    const target = clampPercent(
      data.target + Number(this.system.combat?.attackModifier ?? 0) + this.getDifficultyMod()
    );

    const result = await this.rollPercent(target, `Ataque: ${weapon.name} [${data.skill.label}]`);

    await this.update({
      "system.combat.lastFumble": result.fumble ? `Pifia de ataque: ${weapon.name}` : "",
      "system.combat.lastCritical": result.critical ? `Crítico de ataque: ${weapon.name}` : ""
    });

    return result;
  }

  async rollWeaponDamage(weapon, { critical = false } = {}) {
    if (!weapon) {
      ui.notifications?.warn("No hay arma seleccionada.");
      return null;
    }

    const formula = String(weapon.system.damage || "1d3").trim() || "1d3";
    let damageRoll = null;
    let total = 0;
    let criticalBonus = 0;
    let criticalMaxDamage = null;

    if (critical) {
      criticalMaxDamage = getMaximumFormulaDamage(formula);
      total = criticalMaxDamage;

      await postSimpleMessage(this, `Daño crítico: ${weapon.name}`, [
        `<strong>Fórmula:</strong> ${formula}`,
        `<strong>Resultado:</strong> daño máximo (${criticalMaxDamage})`,
        "La armadura no protege frente al impacto crítico."
      ]);
    } else {
      damageRoll = await rollFormula(this, formula, `Daño: ${weapon.name}`);
      total = Number(damageRoll.total ?? 0);
    }

    return {
      weapon,
      formula,
      roll: damageRoll?.roll ?? null,
      baseDamage: critical ? total : Number(damageRoll?.total ?? 0),
      criticalBonus,
      criticalMaxDamage,
      totalDamage: total
    };
  }

  async resolveWeaponAttack({
    targetActor,
    weaponId = "",
    attackSkillKey = "",
    attackModifier = null,
    defenseSkillKey = "",
    defenseModifier = null,
    difficulty = null
  } = {}) {
    if (this.isUnableToActInCombat()) {
      ui.notifications?.warn(`${this.name} no puede atacar en su estado actual.`);
      return null;
    }

    if (!this.canSpendCombatAction(1)) {
      ui.notifications?.warn("No te quedan acciones de combate.");
      return null;
    }

    if (!targetActor) {
      ui.notifications?.warn("No hay objetivo válido.");
      return null;
    }

    const meleeMode = Boolean(this.system.combat?.meleeMode);
    const selectedWeaponId = weaponId || this.system.combat?.activeWeaponId || "";
    const weapon = selectedWeaponId
      ? this.getWeaponById(selectedWeaponId)
      : this.getPrimaryEquippedWeapon();

    // En melé sin arma equipada, se pelea con los puños usando la competencia Pelea.
    const unarmedMelee = meleeMode && (!weapon || weapon.type !== "weapon");

    if (!unarmedMelee) {
      if (!weapon || weapon.type !== "weapon") {
        ui.notifications?.warn("No tienes un arma válida equipada o seleccionada.");
        return null;
      }

      if (!weapon.system.equipped) {
        ui.notifications?.warn(`El arma ${weapon.name} no está equipada.`);
        return null;
      }

      if (!isMeleeEligibleWeapon(weapon) && meleeMode) {
        ui.notifications?.warn("En melé solo puedes usar pelea o armas ligeras de una mano.");
        return null;
      }
    }

    // Nombre y skill efectivos (arma real o puños)
    const effectiveWeaponName = unarmedMelee ? "Pelea (sin arma)" : weapon.name;
    const skillKey = attackSkillKey
      || (unarmedMelee ? "pelea" : normalizeSkillKey(weapon.system.skill, "espadas"));
    const attackSkill = this.system.skills?.[skillKey];
    if (!attackSkill) {
      ui.notifications?.warn(`La competencia ${skillKey} no existe en el atacante.`);
      return null;
    }

    const difficultyKey = difficulty ?? this.system.combat?.difficulty ?? "normal";
    const diffMod = Number(DIFFICULTY_MODS[difficultyKey] ?? 0);
    const atkMod = Number(attackModifier ?? this.system.combat?.attackModifier ?? 0);
    const statusMods = this.getCombatStatusModifiers();
    const aimedLocation = normalizeLocationKey(this.system.combat?.aimLocation ?? "");
    const aimedAttackMod = aimedLocation
      ? Number(this.system.combat?.aimModifier ?? -25)
      : 0;

    const meleeBonus = meleeMode ? 50 : 0;

    const attackTarget = clampPercent(
      Number(attackSkill.total ?? 0) + atkMod + diffMod + statusMods.attackMod + meleeBonus + aimedAttackMod
    );
    const attackRoll = await rollPercent(this, attackTarget, `Ataque: ${effectiveWeaponName}`);

    let defenseRoll = null;
    let defenseLabel = "Sin defensa";
    let defenseStateText = "Sin defensa";

    const defenseData = targetActor.getDefenseSourceData();

    if (defenseData?.valid) {
      defenseLabel = defenseData.label ?? "Defensa";
      const canDefend = (targetActor.canSpendCombatAction?.(1) ?? false)
        && !(targetActor.isUnableToActInCombat?.() ?? false);

      if (!canDefend) {
        defenseStateText = targetActor.isUnableToActInCombat?.()
          ? `No se defiende (${targetActor.getCurrentHealthStateData?.().label?.toLowerCase() ?? "fuera de combate"})`
          : "No se defiende (sin acciones)";
      } else {
        const wantsToDefend = await Dialog.confirm({
          title: "Defensa del objetivo",
          content: `<p><strong>${targetActor.name}</strong> recibe un ataque de <strong>${this.name}</strong>.</p><p>¿Quieres gastar 1 acción para defenderte con <strong>${defenseLabel}</strong>?</p>`,
          yes: () => true,
          no: () => false,
          defaultYes: true
        });

        if (wantsToDefend) {
          const defMod = Number(
            defenseModifier ?? targetActor.system.combat?.defenseModifier ?? 0
          );

          const defenseTarget = clampPercent(
            Number(defenseData.target ?? 0) + defMod
          );

          defenseRoll = await rollPercent(
            targetActor,
            defenseTarget,
            `Defensa: ${defenseLabel}`
          );

          await targetActor.spendCombatAction(1);
        } else {
          defenseStateText = "No se defiende";
        }
      }
    }

    const comparison = compareAttackDefense(attackRoll, defenseRoll);
    let finalComparison = comparison;

    if (
      attackRoll?.critical
      && defenseRoll?.success
      && !defenseRoll.critical
      && defenseData?.mode === "weapon"
    ) {
      finalComparison = {
        hit: true,
        reason: "Crítico no parado: la parada con arma no crítica no detiene el ataque"
      };

      const droppedWeapon = targetActor.items.get(defenseData.itemId ?? "");
      if (droppedWeapon?.type === "weapon" && droppedWeapon.system.equipped) {
        await droppedWeapon.update({ "system.equipped": false });

        const targetUpdates = {};
        if (targetActor.system.combat?.activeWeaponId === droppedWeapon.id) {
          targetUpdates["system.combat.activeWeaponId"] = "";
        }
        if (targetActor.system.combat?.defenseWeaponId === droppedWeapon.id) {
          targetUpdates["system.combat.defenseWeaponId"] = "";
        }
        if (Object.keys(targetUpdates).length) {
          await targetActor.update(targetUpdates);
        }
      }
    }

    let shieldWear = null;
    if (defenseData?.mode === "shield" && defenseRoll?.success && defenseData?.itemId) {
      const wearAmount = attackRoll?.critical ? 2 : 1;
      shieldWear = await targetActor.applyShieldWear(defenseData.itemId, wearAmount);
    }

    await this.spendCombatAction(1);

    const attackStateUpdates = {
      "system.combat.lastFumble": attackRoll.fumble ? `Pifia de ataque: ${effectiveWeaponName}` : "",
      "system.combat.lastCritical": attackRoll.critical ? `Crítico de ataque: ${effectiveWeaponName}` : ""
    };

    await this.update(attackStateUpdates);

    if (defenseRoll) {
      await targetActor.update({
        "system.combat.lastFumble": defenseRoll.fumble ? `Pifia de defensa: ${defenseLabel}` : "",
        "system.combat.lastCritical": defenseRoll.critical ? `Defensa crítica: ${defenseLabel}` : ""
      });
    } else {
      await targetActor.update({
        "system.combat.lastFumble": "",
        "system.combat.lastCritical": ""
      });
    }

    const attackOutcomeText =
      `${attackRoll.success ? "Éxito" : "Fallo"}`
      + `${attackRoll.critical ? " (Crítico)" : ""}`
      + `${attackRoll.fumble ? " (Pifia)" : ""}`;

    const defenseOutcomeText = defenseRoll
      ? `${defenseRoll.success ? "Éxito" : "Fallo"}`
        + `${defenseRoll.critical ? " (Crítico)" : ""}`
        + `${defenseRoll.fumble ? " (Pifia)" : ""}`
      : defenseStateText;

    if (!finalComparison.hit) {
      const targetPv = Number(targetActor.system.secondary?.pv?.value ?? 0);
      const targetMaxPv = Number(targetActor.system.secondary?.pv?.max ?? targetPv);
      const targetStatuses = targetActor.getStatusEffects?.() ?? [];
      const statusList = targetStatuses
        .map(effect => `<li>${effect.label ?? effect.type}${effect.location ? ` (${getLocationLabel(effect.location)})` : ""}</li>`)
        .join("");

      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div class="aquelarre-chat failure">
            <h3>❌ Resolución de combate</h3>
            <div class="roll-section">
              <p class="roll-label">Atacante</p>
              <p><strong>${this.name}</strong></p>
              <p><strong>Objetivo:</strong> ${targetActor.name}</p>
              <p><strong>Arma:</strong> ${effectiveWeaponName}</p>
              <p><strong>Dificultad:</strong> ${difficultyKey}</p>
            </div>
            <div class="roll-section">
              <p class="roll-label">Ataque</p>
              <p class="roll-total">${attackRoll.result} / ${attackRoll.target}</p>
              <p class="roll-detail">${attackOutcomeText}</p>
            </div>
            <div class="roll-section">
              <p class="roll-label">Defensa</p>
              ${
                defenseRoll
                  ? `
                  <p class="roll-total">${defenseRoll.result} / ${defenseRoll.target}</p>
                  <p class="roll-detail">${defenseOutcomeText}</p>
                  `
                  : `<p class="roll-detail">No disponible</p>`
              }
            </div>
            <hr/>
            <table class="combat-details">
              <tbody>
                <tr><th>🔎 Resolución</th><td>${finalComparison.reason}</td></tr>
                <tr><th>💥 Impacto</th><td>No</td></tr>
                <tr><th>❤️ PV objetivo</th><td>${targetPv} / ${targetMaxPv}</td></tr>
                ${shieldWear ? `<tr><th>🛡️ RES escudo</th><td>-${shieldWear.lost} (restante: ${shieldWear.resistanceAfter})${shieldWear.broken ? " - roto" : ""}</td></tr>` : ""}
              </tbody>
            </table>
            ${statusList ? `<div class="status-summary"><p><strong>Estados actuales</strong></p><ul>${statusList}</ul></div>` : ""}
          </div>
        `
      });

      return {
        hit: false,
        comparison: finalComparison,
        attackRoll,
        defenseRoll,
        defenseLabel,
        weapon,
        shieldWear
      };
    }

    let hitLocation = "";
    let locationRoll = null;

    if (aimedLocation) {
      hitLocation = aimedLocation;
    } else {
      locationRoll = await rollFormula(this, "1d100", "Localización");
      hitLocation = getHitLocation(locationRoll.total);
    }

    // Para ataque sin arma (melé con Pelea), usar fórmula de puñetazo: 1d3 + bonus FUE.
    const unarmedDamageFormula = (() => {
      const fue = Number(this.system.characteristics?.fue?.value ?? 10);
      const bonus = fue >= 15 ? `+${Math.floor((fue - 10) / 5)}d4` : "";
      return `1d3${bonus}`;
    })();

    const damageData = unarmedMelee
      ? await (async () => {
          const fakeWeapon = { name: "Pelea (sin arma)", system: { damage: unarmedDamageFormula } };
          return this.rollWeaponDamage(fakeWeapon, { critical: attackRoll.critical });
        })()
      : await this.rollWeaponDamage(weapon, { critical: attackRoll.critical });
    const applied = await targetActor.applyDamageToLocation(
      damageData.totalDamage,
      hitLocation,
      { ignoreArmor: Boolean(attackRoll.critical) }
    );

    const appliedStatusList = Array.isArray(applied.statusEffects)
      ? applied.statusEffects
          .map(effect => `<li>${effect.label ?? effect.type}${effect.location ? ` (${getLocationLabel(effect.location)})` : ""}</li>`)
          .join("")
      : "";

    const sequelaChangesList = Array.isArray(applied.sequela?.appliedChanges) && applied.sequela.appliedChanges.length
      ? applied.sequela.appliedChanges.map(change => `<li>${change}</li>`).join("")
      : "";

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `
        <div class="aquelarre-chat success">
          <h3>✅ Impacto</h3>
          <div class="roll-section">
            <p class="roll-label">Atacante</p>
            <p><strong>${this.name}</strong></p>
            <p><strong>Objetivo:</strong> ${targetActor.name}</p>
            <p><strong>Arma:</strong> ${effectiveWeaponName}</p>
          </div>
          <div class="roll-section">
            <p class="roll-label">Ataque</p>
            <p class="roll-total">${attackRoll.result} / ${attackRoll.target}</p>
            <p class="roll-detail">${attackOutcomeText}</p>
          </div>
          <div class="roll-section">
            <p class="roll-label">Defensa</p>
            ${
              defenseRoll
                ? `
                <p class="roll-total">${defenseRoll.result} / ${defenseRoll.target}</p>
                <p class="roll-detail">${defenseOutcomeText}</p>
              `
                : `<p class="roll-detail">Sin defensa</p>`
            }
          </div>
          <hr/>
          <table class="combat-details">
            <tbody>
              <tr><th>🔎 Resolución</th><td>${finalComparison.reason}</td></tr>
              <tr><th>🎯 Ataque apuntado</th><td>${aimedLocation ? `${getLocationLabel(aimedLocation)} (${aimedAttackMod})` : "No"}</td></tr>
              <tr><th>📍 Localización</th><td>${getLocationLabel(hitLocation)}</td></tr>
              <tr><th>⚔️ Daño bruto</th><td>${damageData.totalDamage}</td></tr>
              <tr><th>🛡️ Armadura absorbida</th><td>${attackRoll.critical ? "Ignorada por crítico" : applied.armorAbsorbed}</td></tr>
              <tr><th>🔥 Daño final</th><td>${applied.finalDamage}</td></tr>
              <tr><th>❤️ PV</th><td>${applied.pvBefore} → ${applied.pvAfter}</td></tr>
              ${applied.sequela ? `<tr><th>🩹 Secuela</th><td>${applied.sequela.label} (1d10: ${applied.sequela.roll})</td></tr>` : ""}
              ${applied.armorWear ? `<tr><th>⛓️ RES armadura</th><td>${applied.armorWear.armor.name}: -${applied.armorWear.lost} (restante: ${applied.armorWear.resistanceAfter})${applied.armorWear.broken ? " - rota" : ""}</td></tr>` : ""}
              ${shieldWear ? `<tr><th>🛡️ RES escudo</th><td>-${shieldWear.lost} (restante: ${shieldWear.resistanceAfter})${shieldWear.broken ? " - roto" : ""}</td></tr>` : ""}
              <tr><th>⚠️ Estado</th><td>${applied.state}</td></tr>
            </tbody>
          </table>
          ${applied.sequela?.description ? `<p><strong>Detalle de secuela:</strong> ${applied.sequela.description}</p>` : ""}
          ${sequelaChangesList ? `<div class="status-summary"><p><strong>Cambios permanentes aplicados</strong></p><ul>${sequelaChangesList}</ul></div>` : ""}
          ${appliedStatusList ? `<div class="status-summary"><p><strong>Estados aplicados</strong></p><ul>${appliedStatusList}</ul></div>` : ""}
        </div>
      `
    });

    return {
      hit: true,
      comparison: finalComparison,
      attackRoll,
      defenseRoll,
      defenseLabel,
      weapon,
      hitLocation,
      damageData,
      applied,
      armorWear: applied.armorWear,
      shieldWear
    };
  }

  hasStatusEffect(type) {
    return this.getStatusEffects().some(effect => effect.type === type);
  }

  getStatusEffect(type) {
    return this.getStatusEffects().find(effect => effect.type === type) ?? null;
  }

  getCurrentHealthStateData() {
    const currentPv = Number(this.system.secondary?.pv?.value ?? 0);
    const maxPv = Number(this.system.secondary?.pv?.max ?? currentPv);

    return getRawHealthStateData(currentPv, maxPv);
  }

  isUnableToActInCombat() {
    const healthState = this.getCurrentHealthStateData();

    if (healthState.unableToAct) {
      return true;
    }

    if (this.hasStatusEffect("inconsciente_temporal") || this.hasStatusEffect("incapacitado_temporal")) {
      return true;
    }

    if (this.hasStatusEffect("incapacitado") || this.hasStatusEffect("moribundo")) {
      return true;
    }

    return false;
  }

  getCombatPenaltySummary() {
    const summaries = [];
    const healthState = this.getCurrentHealthStateData();

    if (healthState.state === "herido") {
      summaries.push({
        key: "herido",
        label: "Herido",
        effects: [
          "Movimiento a la mitad",
          "Bonificador de daño a la mitad"
        ]
      });
    }

    if (healthState.state === "malherido") {
      summaries.push({
        key: "malherido",
        label: "Malherido",
        effects: [
          "Movimiento a una cuarta parte",
          "Sin bonificador de daño",
          "Cada golpe: RES x4 o desmayo"
        ]
      });
    }

    if (healthState.state === "inconsciente") {
      summaries.push({
        key: "inconsciente",
        label: "Inconsciente",
        effects: [
          "No puede actuar",
          "Pierde 1 PV por asalto"
        ]
      });
    }

    if (healthState.state === "muerto") {
      summaries.push({
        key: "muerto",
        label: "Muerto",
        effects: [
          "No puede actuar"
        ]
      });
    }

    const temporaryUnconscious = this.getStatusEffect("inconsciente_temporal");
    if (temporaryUnconscious) {
      summaries.push({
        key: "inconsciente_temporal",
        label: temporaryUnconscious.label ?? "Inconsciente",
        effects: [
          "No puede actuar",
          Number.isFinite(Number(temporaryUnconscious.remainingTurns)) ? `Quedan ${temporaryUnconscious.remainingTurns} asaltos` : "Duración variable"
        ]
      });
    }

    const temporaryIncapacitated = this.getStatusEffect("incapacitado_temporal");
    if (temporaryIncapacitated) {
      summaries.push({
        key: "incapacitado_temporal",
        label: temporaryIncapacitated.label ?? "Incapacitado",
        effects: [
          "No puede actuar",
          Number.isFinite(Number(temporaryIncapacitated.remainingTurns)) ? `Quedan ${temporaryIncapacitated.remainingTurns} asaltos` : "Duración variable"
        ]
      });
    }

    const heartDamage = this.getStatusEffect("corazon_danado");
    if (heartDamage) {
      summaries.push({
        key: "corazon_danado",
        label: heartDamage.label ?? "Corazón dañado",
        effects: [
          Number.isFinite(Number(heartDamage.remainingTurns)) ? `Morirá en ${heartDamage.remainingTurns} asaltos si no recibe Sanar` : "Mortal sin tratamiento"
        ]
      });
    }

    if (this.hasStatusEffect("aturdido")) {
      summaries.push({
        key: "aturdido",
        label: "Aturdido",
        effects: [
          "-50 al ataque",
          "-50 a la defensa",
          "-50 a esquivar"
        ]
      });
    }

    if (this.hasStatusEffect("pierna_inutilizada")) {
      summaries.push({
        key: "pierna_inutilizada",
        label: "Pierna inutilizada",
        effects: [
          "-40 a esquivar"
        ]
      });
    }

    if (this.hasStatusEffect("brazo_inutilizado")) {
      summaries.push({
        key: "brazo_inutilizado",
        label: "Brazo inutilizado",
        effects: [
          "No puede parar con arma"
        ]
      });
    }

    return summaries;
  }

  getCombatStatusModifiers() {
    let attackMod = 0;
    let defenseMod = 0;
    let dodgeMod = 0;

    if (this.hasStatusEffect("aturdido")) {
      attackMod -= 50;
      defenseMod -= 50;
      dodgeMod -= 50;
    }

    if (this.hasStatusEffect("pierna_inutilizada")) {
      dodgeMod -= 40;
    }

    return {
      attackMod,
      defenseMod,
      dodgeMod
    };
  }

  getStatusEffects() {
    return Array.isArray(this.system.combat?.statusEffects)
      ? [...this.system.combat.statusEffects]
      : [];
  }

  buildStatusEffect(type, location = "general", label = "", options = {}) {
    return {
      type,
      location,
      label: label || type,
      remainingTurns: Number.isFinite(Number(options.remainingTurns)) ? Number(options.remainingTurns) : null,
      notes: options.notes ?? ""
    };
  }

  addOrReplaceStatusEffect(type, location = "general", label = "", options = {}) {
    const effects = this.getStatusEffects().filter(effect => effect.type !== type);

    effects.push(this.buildStatusEffect(type, location, label, options));

    return effects;
  }

  addOrReplaceLocalizedStatusEffect(type, location = "general", label = "", options = {}) {
    const effects = this.getStatusEffects().filter(effect => effect.type !== type);

    effects.push(this.buildStatusEffect(type, location, label, options));
    return effects;
  }

  removeStatusEffect(type) {
    return this.getStatusEffects().filter(effect => effect.type !== type);
  }

  async tickTimedCombatEffects() {
    const effects = this.getStatusEffects();
    if (!effects.length) {
      return { expired: [], lethalExpired: [] };
    }

    const remainingEffects = [];
    const expired = [];
    let changed = false;

    for (const effect of effects) {
      const turns = Number(effect.remainingTurns);

      if (Number.isFinite(turns) && turns > 0) {
        const nextTurns = turns - 1;
        changed = true;

        if (nextTurns > 0) {
          remainingEffects.push({ ...effect, remainingTurns: nextTurns });
        } else {
          expired.push(effect);
        }

        continue;
      }

      remainingEffects.push(effect);
    }

    if (changed) {
      await this.update({ "system.combat.statusEffects": remainingEffects });
    }

    const lethalExpired = expired.filter(effect => effect.type === "corazon_danado");
    if (lethalExpired.length) {
      const maxPv = Number(this.system.secondary?.pv?.max ?? 0);
      await this.update({ "system.secondary.pv.value": -Math.max(1, maxPv) });
    }

    return {
      expired,
      lethalExpired
    };
  }

  async applyDamageToLocation(rawDamage, location, { ignoreArmor = false } = {}) {
    const damage = Math.max(0, Number(rawDamage ?? 0));
    const hitLocation = normalizeLocationKey(location || "torso");

    const armorAbsorbed = ignoreArmor ? 0 : this.getArmorProtectionForLocation(hitLocation);
    const finalDamage = Math.max(0, damage - armorAbsorbed);
    const armorWearAmount = ignoreArmor ? damage : armorAbsorbed;
    const armorWear = await this.applyArmorWearForLocation(hitLocation, armorWearAmount);

    const currentPv = Number(this.system.secondary?.pv?.value ?? 0);
    const maxPv = Number(this.system.secondary?.pv?.max ?? currentPv);
    let newPv = Math.max(-999, currentPv - finalDamage);

    const sequela = await getSequelaFromHit(this, hitLocation, damage, maxPv);
    if (Number.isFinite(Number(sequela?.setPvValue))) {
      newPv = Math.min(newPv, Number(sequela.setPvValue));
    }

    const healthState = getRawHealthStateData(newPv, maxPv);
    const state = healthState.state;

    let statusEffects = this.getStatusEffects().filter(effect => !HEALTH_STATE_EFFECT_TYPES.includes(effect.type));

    if (state !== "sano") {
      statusEffects.push(this.buildStatusEffect(state, "general", healthState.label));
    }

    const localizedInjury = getLocalizedInjuryFromHit(hitLocation, finalDamage);
    if (localizedInjury) {
      statusEffects = this.addOrReplaceLocalizedStatusEffect(
        localizedInjury.type,
        localizedInjury.location,
        localizedInjury.label
      );
    }

    if (sequela?.statusEffects?.length) {
      for (const effect of sequela.statusEffects) {
        statusEffects = this.addOrReplaceLocalizedStatusEffect(
          effect.type,
          effect.location ?? hitLocation,
          effect.label ?? effect.type,
          {
            remainingTurns: effect.remainingTurns,
            notes: effect.notes
          }
        );
      }
    }

    await this.update({
      "system.secondary.pv.value": newPv,
      "system.combat.lastHitLocation": hitLocation,
      "system.combat.lastArmorAbsorbed": armorAbsorbed,
      "system.combat.lastRawDamage": damage,
      "system.combat.lastFinalDamage": finalDamage,
      "system.combat.statusEffects": statusEffects,
      ...Object.fromEntries(Object.entries(sequela?.updates ?? {}))
    });

    return {
      rawDamage: damage,
      armorAbsorbed,
      finalDamage,
      location: hitLocation,
      pvBefore: currentPv,
      pvAfter: newPv,
      pvMax: maxPv,
      state,
      healthState,
      armorWear,
      sequela,
      statusEffects,
      localizedInjury
    };
  }

  async toggleItemEquipped(itemId) {
    const item = this.items.get(itemId);
    if (!item) return;

    const newEquipped = !Boolean(item.system.equipped);

    // Validaciones específicas por tipo
    if (newEquipped) {
      if (item.type === "weapon") {
        // Si equipamos una nueva arma, desequipamos otras si es necesario
        // Por simplicidad, permitir múltiples armas equipadas, pero activeWeaponId se maneja por separado
      } else if (item.type === "shield") {
        const resistance = Math.max(0, Number(item.system.resistance ?? 0));
        if (resistance <= 0) {
          ui.notifications?.warn(`No puedes equipar ${item.name}: el escudo está roto (RES 0).`);
          return;
        }

        // Solo un escudo equipado
        const currentShield = this.getEquippedShield();
        if (currentShield && currentShield.id !== itemId) {
          await currentShield.update({ "system.equipped": false });
        }
      } else if (item.type === "armor") {
        const resistance = Math.max(0, Number(item.system.resistance ?? 0));
        if (resistance <= 0) {
          ui.notifications?.warn(`No puedes equipar ${item.name}: la armadura está rota (RES 0).`);
          return;
        }
      }
    }

    await item.update({ "system.equipped": newEquipped });

    // Si equipamos una arma, actualizar activeWeaponId si no hay una activa
    if (newEquipped && item.type === "weapon" && !this.system.combat?.activeWeaponId) {
      await this.update({ "system.combat.activeWeaponId": itemId });
    }
  }

  /* -------------------------------------------- */
  /*  Character Creation / Professions            */
  /* -------------------------------------------- */

  getNormalizedSex() {
    const raw = String(this.system.bio?.sex ?? "").trim().toLowerCase();

    if (!raw) return "";
    if (["hombre", "varon", "varón", "male", "masculino"].includes(raw)) return "male";
    if (["mujer", "female", "femenino"].includes(raw)) return "female";

    return raw;
  }

  getDerivedSociety() {
    const ethnicityKey = this.system.creation?.ethnicityKey ?? "";
    return getEthnicitySociety(ethnicityKey);
  }

  getAllowedSocialClasses() {
    const ethnicityKey = this.system.creation?.ethnicityKey ?? "";
    return getAllowedSocialClassKeysForEthnicity(ethnicityKey);
  }

  getProfessionFilterData() {
    const creation = this.system.creation ?? {};

    return {
      society: creation.society || this.getDerivedSociety(),
      socialClassKey: creation.socialClassKey ?? "",
      ethnicityKey: creation.ethnicityKey ?? "",
      kingdomKey: creation.kingdom ?? "",
      sex: this.getNormalizedSex(),
      stats: {
        fue: Number(this.system.characteristics?.fue?.value ?? 0),
        agi: Number(this.system.characteristics?.agi?.value ?? 0),
        hab: Number(this.system.characteristics?.hab?.value ?? 0),
        res: Number(this.system.characteristics?.res?.value ?? 0),
        per: Number(this.system.characteristics?.per?.value ?? 0),
        com: Number(this.system.characteristics?.com?.value ?? 0),
        cul: Number(this.system.characteristics?.cul?.value ?? 0)
      },
      luck: Number(this.system.secondary?.luck?.value ?? 0)
    };
  }

  getValidProfessionKeys() {
    const filters = this.getProfessionFilterData();

    return getValidProfessionKeys(filters).filter(key => {
      const validation = validateProfessionForActorData(key, filters);
      return validation.valid;
    });
  }

  async refreshCreationTree() {
    const society = this.getDerivedSociety();
    const allowedSocialClasses = this.getAllowedSocialClasses();

    let socialClassKey = this.system.creation?.socialClassKey ?? "";
    if (socialClassKey && !allowedSocialClasses.includes(socialClassKey)) {
      socialClassKey = "";
    }

    const validProfessionKeys = this.getValidProfessionKeys();

    let professionKey = this.system.creation?.professionKey ?? "";
    if (professionKey && !validProfessionKeys.includes(professionKey)) {
      professionKey = "";
    }

    await this.update({
      "system.creation.society": society,
      "system.creation.socialClassKey": socialClassKey,
      "system.creation.professionKey": professionKey,
      "system.creation.validProfessionKeys": validProfessionKeys
    });
  }

  meetsProfessionMinStats(professionKey) {
    const filters = this.getProfessionFilterData();
    return validateProfessionForActorData(professionKey, filters).reasons
      .every(reason => reason !== "No cumple mínimos de características");
  }

  getProfessionInvalidReasons(professionKey) {
    const filters = this.getProfessionFilterData();
    return validateProfessionForActorData(professionKey, filters).reasons;
  }

  getProfessionValidationData(professionKey) {
    const filters = this.getProfessionFilterData();
    return validateProfessionForActorData(professionKey, filters);
  }

  isProfessionValid(key) {
    return this.getProfessionInvalidReasons(key).length === 0;
  }

  getSelectedProfessionData() {
    const key = this.system.creation?.professionKey ?? "";
    if (!key) return null;

    const prof = getProfessionRaw(key);
    if (!prof) return null;

    const validation = this.getProfessionValidationData(key);
    const minStats = prof.minStats ?? {};

    const minStatEntries = Object.entries(minStats).map(([statKey, minValue]) => {
      let current = 0;
      let label = statKey.toUpperCase();

      if (statKey === "luck") {
        current = Number(this.system.secondary?.luck?.value ?? 0);
        label = "Suerte";
      } else {
        current = Number(this.system.characteristics?.[statKey]?.value ?? 0);
        label = this.system.characteristics?.[statKey]?.label ?? statKey.toUpperCase();
      }

      return {
        key: statKey,
        label,
        required: Number(minValue ?? 0),
        current,
        ok: current >= Number(minValue ?? 0)
      };
    });

    return {
      key: prof.key,
      label: prof.label,
      valid: validation.valid,
      reasonText: validation.reasonText,
      reasons: validation.reasons,
      society: prof.society,
      socialClass: prof.socialClass,
      ethnicities: prof.ethnicities,
      kingdoms: prof.kingdoms,
      sex: prof.sex,
      minStats: minStatEntries,
      skillPoints: prof.skillPoints,
      allowedSkills: [...prof.allowedSkills],
      money: prof.money,
      source: prof.source
    };
  }

  getProfessionSummaryBadges() {
    const data = this.getSelectedProfessionData();
    if (!data) return [];

    const badges = [];

    badges.push({
      label: data.valid ? "Disponible" : "Bloqueada",
      type: data.valid ? "ok" : "error",
      tooltip: data.valid
        ? "La profesión cumple los requisitos actuales."
        : data.reasonText
    });

    if (data.society.length) {
      badges.push({
        label: `Sociedad: ${data.society.join(", ")}`,
        type: "neutral",
        tooltip: `Sociedades permitidas: ${data.society.join(", ")}`
      });
    }

    if (data.socialClass.length) {
      badges.push({
        label: `Clase: ${data.socialClass.join(", ")}`,
        type: "neutral",
        tooltip: `Clases sociales permitidas: ${data.socialClass.join(", ")}`
      });
    }

    if (data.sex.length) {
      const sexLabel = data.sex
        .map(v => v === "male" ? "Hombre" : v === "female" ? "Mujer" : v)
        .join(", ");

      badges.push({
        label: `Sexo: ${sexLabel}`,
        type: "neutral",
        tooltip: `Sexo permitido: ${sexLabel}`
      });
    }

    if (data.kingdoms.length) {
      badges.push({
        label: `Reinos: ${data.kingdoms.join(", ")}`,
        type: "neutral",
        tooltip: `Reinos permitidos: ${data.kingdoms.join(", ")}`
      });
    }

    if (data.minStats.some(stat => !stat.ok)) {
      const failed = data.minStats
        .filter(stat => !stat.ok)
        .map(stat => `${stat.label} ${stat.current}/${stat.required}`)
        .join(" · ");

      badges.push({
        label: "No cumple mínimos",
        type: "warning",
        tooltip: failed
      });
    }

    if (data.source?.book) {
      badges.push({
        label: `Fuente: ${data.source.book}`,
        type: "neutral",
        tooltip: data.source.note || data.source.book
      });
    }

    return badges;
  }

  getProfessionOptionsForCreation() {
    return Object.keys(PROFESSIONS_RAW)
      .map(key => this.getProfessionValidationData(key))
      .map(validation => ({
        key: validation.key,
        label: validation.label,
        valid: validation.valid,
        reasons: validation.reasons,
        reasonText: validation.reasonText
      }))
      .sort((a, b) => {
        if (a.valid !== b.valid) return a.valid ? -1 : 1;
        return String(a.label).localeCompare(String(b.label), "es");
      });
  }

  async removeProfessionGrantedItems() {
    const itemIds = this.items
      .filter(item => item.getFlag("aquelarre", "creationGranted"))
      .map(item => item.id)
      .filter(Boolean);

    if (itemIds.length) {
      await this.deleteEmbeddedDocuments("Item", itemIds);
    }
  }

  async applyProfessionRAW(key) {
    const validation = this.getProfessionValidationData(key);
    const prof = validation.profession ?? getProfessionRaw(key);

    if (!prof) {
      ui.notifications?.warn(`Profesión no válida: ${key}`);
      return;
    }

    await this.refreshCreationTree();
    await this.ensureActorDefaults();

    if (!validation.valid) {
      ui.notifications?.warn(`La profesión ${prof.label} no es válida: ${validation.reasonText}`);
      return;
    }

    const validProfessionKeys = this.system.creation?.validProfessionKeys ?? [];
    if (validProfessionKeys.length && !validProfessionKeys.includes(key)) {
      ui.notifications?.warn(`La profesión ${prof.label} no es válida para el árbol actual de creación.`);
      return;
    }

    const skills = foundry.utils.deepClone(this.system.skills ?? {});
    for (const skill of Object.values(skills)) {
      skill.invested = 0;
      skill.total = Number(skill.baseValue ?? 0);
    }

    await this.removeProfessionGrantedItems();

    const existingNonGrantedNames = new Set(
      this.items
        .filter(item => !item.getFlag("aquelarre", "creationGranted"))
        .map(item => item.name)
    );

    const toCreate = buildProfessionItemsForCreation(key, { markGranted: true })
      .filter(itemData => !existingNonGrantedNames.has(itemData.name));

    await this.update({
      "system.creation.skillPoints": Number(prof.skillPoints ?? 0),
      "system.creation.allowedSkills": Array.isArray(prof.allowedSkills) ? [...prof.allowedSkills] : [],
      "system.creation.professionKey": key,
      "system.bio.profession": prof.label,
      "system.economy.money": prof.money ?? "",
      "system.skills": skills
    });

    if (toCreate.length) {
      await this.createEmbeddedDocuments("Item", toCreate);
    }

    ui.notifications?.info(`Profesión RAW aplicada: ${prof.label}`);
  }

  async randomizeOrigin() {
    const kingdomKeys = Object.keys(KINGDOMS);
    if (!kingdomKeys.length) return;

    const kingdomKey = randomChoice(kingdomKeys);
    const kingdomData = KINGDOMS[kingdomKey];
    const ethnicityPool = Array.isArray(kingdomData?.ethnicities) ? kingdomData.ethnicities : [];
    if (!ethnicityPool.length) return;

    const ethnicityKey = randomChoice(ethnicityPool);
    const socialClassPool = getAllowedSocialClassKeysForEthnicity(ethnicityKey);
    if (!socialClassPool.length) return;

    const socialClassKey = randomChoice(socialClassPool);
    const society = getEthnicitySociety(ethnicityKey);

    await this.update({
      "system.creation.kingdom": kingdomKey,
      "system.creation.ethnicityKey": ethnicityKey,
      "system.creation.socialClassKey": socialClassKey,
      "system.creation.society": society,
      "system.creation.professionKey": ""
    });

    await this.refreshCreationTree();
  }

  async generateCharacteristics() {
    const updates = {};

    for (const key of ["fue", "agi", "hab", "res", "per", "com", "cul"]) {
      const roll = await rollFormula(this, "4d6kh3", `Generación ${key.toUpperCase()}`);
      updates[`system.characteristics.${key}.value`] = roll.total;
    }

    await this.update(updates);
    await this.ensureActorDefaults();

    await postSimpleMessage(this, "Generación de características", [
      "Se han generado las características tirando 4d6 y quedándose con los 3 mejores resultados."
    ]);
  }

  async generateCharacteristicsOneByOne() {
    const KEYS = ["fue", "agi", "hab", "res", "per", "com", "cul"];
    const LABELS = { fue: "FUE", agi: "AGI", hab: "HAB", res: "RES", per: "PER", com: "COM", cul: "CUL" };
    const results = {};

    for (const key of KEYS) {
      let accepted = false;
      while (!accepted) {
        const roll = await rollFormula(this, "4d6kh3", `Generación ${LABELS[key]}`);
        const total = roll.total;

        accepted = await new Promise(resolve => {
          new Dialog({
            title: `Características — ${LABELS[key]}`,
            content: `<p>Resultado de <strong>${LABELS[key]}</strong>: <strong style="font-size:1.4em">${total}</strong></p><p>¿Aceptas este valor o vuelves a tirar?</p>`,
            buttons: {
              accept: { label: "Aceptar", callback: () => resolve(true) },
              reroll: { label: "Volver a tirar", callback: () => resolve(false) }
            },
            default: "accept",
            close: () => resolve(true)
          }).render(true);
        });

        if (accepted) results[key] = total;
      }
    }

    const updates = {};
    for (const [k, v] of Object.entries(results)) {
      updates[`system.characteristics.${k}.value`] = v;
    }
    await this.update(updates);
    await this.ensureActorDefaults();

    await postSimpleMessage(this, "Generación de características (una a una)", [
      ...Object.entries(results).map(([k, v]) => `<strong>${LABELS[k]}:</strong> ${v}`)
    ]);
  }

  async generateBackstory() {
    const bio = this.system.bio ?? {};
    const creation = this.system.creation ?? {};

    const profession = bio.profession || "oficio incierto";
    const ethnicityKey = creation.ethnicityKey || "";
    const socialClassKey = creation.socialClassKey || "";

    const ethnicity =
      ETHNICITIES_RAW?.[ethnicityKey]?.label ??
      "origen desconocido";

    const socialClass =
      SOCIAL_CLASSES?.[socialClassKey] ??
      "condición humilde";

    const text =
      `${this.name} pertenece al grupo ${String(ethnicity).toLowerCase()} y procede de un entorno ${String(socialClass).toLowerCase()}. ` +
      `Su oficio principal es ${String(profession).toLowerCase()}, y su vida ha estado marcada por las tensiones del mundo medieval, la superstición y la necesidad de sobrevivir.`;

    await this.update({ "system.bio.history": text });
  }

  getFatherProfessionOptions() {
    return Object.entries(FATHER_PROFESSIONS_RAW)
      .map(([key, data]) => ({ key, label: data.label }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label), "es"));
  }

  getFatherProfessionData() {
    const key = String(this.system.creation?.fatherProfessionKey ?? "").trim();
    if (!key) return null;
    return FATHER_PROFESSIONS_RAW[key] ?? null;
  }

  getFatherProfessionLabel() {
    const data = this.getFatherProfessionData();
    if (data?.label) return data.label;
    return String(this.system.bio?.fatherProfession ?? "").trim();
  }

  getFatherProfessionBonusMap() {
    const data = this.getFatherProfessionData();
    if (!data?.bonuses) return {};

    const map = {};
    for (const [skillKey, rawBonus] of Object.entries(data.bonuses)) {
      const key = normalizeSkillKey(skillKey, skillKey);
      const bonus = Number(rawBonus ?? 0);
      if (!key || !Number.isFinite(bonus) || bonus === 0) continue;
      map[key] = bonus;
    }

    return map;
  }

  getFatherProfessionBonusSummaryText() {
    const bonuses = this.getFatherProfessionBonusMap();
    const rows = Object.entries(bonuses)
      .map(([skillKey, bonus]) => {
        const label = this.system.skills?.[skillKey]?.label ?? skillKey;
        const sign = bonus >= 0 ? "+" : "";
        return `${label} ${sign}${bonus}`;
      })
      .sort((a, b) => String(a).localeCompare(String(b), "es"));

    return rows.join(", ");
  }

  /* -------------------------------------------- */
  /*  Skills / Advancement                        */
  /* -------------------------------------------- */

  getSkillTrainingTotal(skillKey) {
    const key = normalizeSkillKey(skillKey, skillKey);
    const skill = this.system.skills?.[key];
    if (!skill) return 0;

    return Number(skill.baseValue ?? 0) + Number(skill.invested ?? 0);
  }

  getSkillTarget(skillKey) {
    const rawKey = String(skillKey ?? "").trim();
    if (!rawKey) return { key: "", skill: null, target: 0 };

    const key = normalizeSkillKey(rawKey, rawKey);
    const skill = this.system.skills?.[key];
    if (!skill) return { key, skill: null, target: 0 };

    const target = clampPercent(Number(skill.total ?? 0));
    return { key, skill, target };
  }

  getSkillMax(skillKey) {
    const key = normalizeSkillKey(skillKey, skillKey);
    const skill = this.system.skills?.[key];
    if (!skill) return 100;

    return Number(skill.baseValue ?? 0) + 50;
  }

  getSkillStepCostFromTotal(total) {
    const n = Number(total ?? 0);

    if (n < 50) return 1;
    if (n < 75) return 2;
    return 3;
  }

  getSkillCost(skillKey) {
    const key = normalizeSkillKey(skillKey, skillKey);
    if (!this.system.skills?.[key]) return 1;

    return this.getSkillStepCostFromTotal(this.getSkillTrainingTotal(key));
  }

  getSkillSpentPoints(skillKey) {
    const key = normalizeSkillKey(skillKey, skillKey);
    const skill = this.system.skills?.[key];
    if (!skill) return 0;

    const baseValue = Number(skill.baseValue ?? 0);
    const invested = Number(skill.invested ?? 0);

    let spent = 0;

    for (let i = 0; i < invested; i += 1) {
      const totalBeforeIncrease = baseValue + i;
      spent += this.getSkillStepCostFromTotal(totalBeforeIncrease);
    }

    return spent;
  }

  getTotalSpentSkillPoints() {
    return Object.keys(this.system.skills ?? {}).reduce((sum, skillKey) => {
      return sum + this.getSkillSpentPoints(skillKey);
    }, 0);
  }

  getRemainingSkillPoints() {
    const total = Number(this.system.creation?.skillPoints ?? 0);
    const spent = this.getTotalSpentSkillPoints();

    return Math.max(0, total - spent);
  }

  getSkillPointSummary() {
    const total = Number(this.system.creation?.skillPoints ?? 0);
    const spent = this.getTotalSpentSkillPoints();
    const remaining = Math.max(0, total - spent);

    return {
      total,
      spent,
      remaining
    };
  }

  getSkillInvestmentBreakdown() {
    const skills = this.system.skills ?? {};
    const rows = [];

    for (const [key, skill] of Object.entries(skills)) {
      const invested = Number(skill.invested ?? 0);
      const spent = this.getSkillSpentPoints(key);

      if (invested <= 0 && spent <= 0) continue;

      rows.push({
        key,
        label: skill.label ?? key,
        invested,
        spent,
        total: Number(skill.total ?? 0),
        baseValue: Number(skill.baseValue ?? 0)
      });
    }

    return rows.sort((a, b) => {
      if (b.spent !== a.spent) return b.spent - a.spent;
      if (b.invested !== a.invested) return b.invested - a.invested;
      return String(a.label).localeCompare(String(b.label), "es");
    });
  }

  canIncreaseSkill(skillKey) {
    const key = normalizeSkillKey(skillKey, skillKey);
    const skill = this.system.skills?.[key];
    if (!skill) return false;

    const allowed = this.system.creation?.allowedSkills ?? [];
    if (allowed.length && !allowed.includes(key)) return false;

    const remaining = this.getRemainingSkillPoints();
    const cost = this.getSkillCost(key);
    const max = this.getSkillMax(key);
    const trainingTotal = this.getSkillTrainingTotal(key);

    if (remaining < cost) return false;
    if (trainingTotal >= max) return false;

    return true;
  }

  canDecreaseSkill(skillKey) {
    const key = normalizeSkillKey(skillKey, skillKey);
    const skill = this.system.skills?.[key];
    if (!skill) return false;

    return Number(skill.invested ?? 0) > 0;
  }

  async increaseSkill(skillKey) {
    await this.ensureActorDefaults();

    const key = normalizeSkillKey(skillKey, skillKey);
    const skill = this.system.skills?.[key];
    if (!skill) return;

    const allowed = this.system.creation?.allowedSkills ?? [];
    if (allowed.length && !allowed.includes(key)) {
      ui.notifications?.warn(`La profesión actual no permite invertir puntos en ${skill.label ?? key}.`);
      return;
    }

    const max = this.getSkillMax(key);
    if (Number(skill.total ?? 0) >= max) {
      ui.notifications?.warn(`Has alcanzado el máximo de ${skill.label ?? key}.`);
      return;
    }

    const cost = this.getSkillCost(key);
    const remaining = this.getRemainingSkillPoints();
    if (remaining < cost) {
      ui.notifications?.warn(
        `No quedan puntos suficientes para subir ${skill.label ?? key}. Coste actual: ${cost}.`
      );
      return;
    }

    const skills = foundry.utils.deepClone(this.system.skills ?? {});
    skills[key].invested = Number(skills[key].invested ?? 0) + 1;
    skills[key].total = Number(skills[key].baseValue ?? 0) + Number(skills[key].invested ?? 0);

    await this.update({ "system.skills": skills });
  }

  async decreaseSkill(skillKey) {
    await this.ensureActorDefaults();

    const key = normalizeSkillKey(skillKey, skillKey);
    if (!this.canDecreaseSkill(key)) return;

    const skills = foundry.utils.deepClone(this.system.skills ?? {});
    const skill = skills[key];

    skill.invested = Math.max(0, Number(skill.invested ?? 0) - 1);
    skill.total = Number(skill.baseValue ?? 0) + Number(skill.invested ?? 0);

    await this.update({ "system.skills": skills });
  }

  /* -------------------------------------------- */
  /*  Generic Rolls / Magic                       */
  /* -------------------------------------------- */

  async rollPercent(value, label = "Tirada") {
    const result = await rollPercent(this, value, label);

    await postSimpleMessage(this, label, [
      `<strong>Objetivo:</strong> ${result.target}%`,
      `<strong>Resultado:</strong> ${result.result}`,
      `<strong>${result.success ? "ÉXITO" : "FALLO"}</strong>${result.critical ? " (Crítico)" : ""}${result.fumble ? " (Pifia)" : ""}`
    ]);

    return result;
  }

  async rollCharacteristic(key) {
    const characteristic = this.system.characteristics?.[key];
    if (!characteristic) return null;
    return this.rollPercent(characteristic.value, `Característica: ${characteristic.label}`);
  }

  async rollSkill(key) {
    const data = this.getSkillTarget(key);
    if (!data.skill) return null;
    return this.rollPercent(data.target, `Competencia: ${data.skill.label}`);
  }

  async castSpell(itemId) {
    const spell = this.items.get(itemId);
    if (!spell || spell.type !== "spell") return null;

    const data = this.getSkillTarget(normalizeSkillKey(spell.system.skill, "alquimia"));
    if (!data.skill) {
      ui.notifications?.warn(`El hechizo ${spell.name} usa una competencia no válida: ${spell.system.skill}`);
      return null;
    }

    const target = clampPercent(data.target + Number(spell.system.difficultyMod ?? 0) + this.getDifficultyMod());
    const result = await rollPercent(this, target, `Hechizo: ${spell.name}`);

    await postSimpleMessage(this, `Lanzamiento de hechizo: ${spell.name}`, [
      `<strong>Competencia:</strong> ${data.skill.label}`,
      `<strong>Objetivo:</strong> ${result.target}%`,
      `<strong>Resultado:</strong> ${result.result}`,
      `<strong>${result.success ? "ÉXITO" : "FALLO"}</strong>${result.critical ? " (Crítico)" : ""}${result.fumble ? " (Pifia)" : ""}`,
      `<strong>Coste:</strong> ${spell.system.cost || "-"}`,
      `<strong>Componentes:</strong> ${spell.system.components || "-"}`,
      `<strong>Efecto:</strong> ${spell.system.effect || "-"}`
    ]);

    return result;
  }

  async invokeRitual(itemId) {
    const ritual = this.items.get(itemId);
    if (!ritual || ritual.type !== "ritual") return null;

    const data = this.getSkillTarget(normalizeSkillKey(ritual.system.skill, "culto"));
    if (!data.skill) {
      ui.notifications?.warn(`El ritual ${ritual.name} usa una competencia no válida: ${ritual.system.skill}`);
      return null;
    }

    const target = clampPercent(data.target + Number(ritual.system.difficultyMod ?? 0) + this.getDifficultyMod());
    const result = await rollPercent(this, target, `Ritual: ${ritual.name}`);

    await postSimpleMessage(this, `Invocación de ritual: ${ritual.name}`, [
      `<strong>Competencia:</strong> ${data.skill.label}`,
      `<strong>Objetivo:</strong> ${result.target}%`,
      `<strong>Resultado:</strong> ${result.result}`,
      `<strong>${result.success ? "ÉXITO" : "FALLO"}</strong>${result.critical ? " (Crítico)" : ""}${result.fumble ? " (Pifia)" : ""}`,
      `<strong>Coste:</strong> ${ritual.system.cost || "-"}`,
      `<strong>Requisitos:</strong> ${ritual.system.requirements || "-"}`,
      `<strong>Efecto:</strong> ${ritual.system.effect || "-"}`
    ]);

    return result;
  }
}
