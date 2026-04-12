import {
  rollPercent,
  rollFormula,
  getHitLocation,
  compareAttackDefense,
  postSimpleMessage,
  clampPercent,
  DIFFICULTY_MODS,
  applyCriticalDamageBonus,
} from "../combat/rolls.mjs";


import {
  PROFESSIONS_RAW,
  getValidProfessionKeys
} from "../chargen/professions-raw.mjs";


import {
  KINGDOMS,
  ETHNICITIES_RAW,
  SOCIAL_CLASSES,
  getEthnicitySociety,
  getAllowedSocialClassKeysForEthnicity
} from "../chargen/creation-tree.mjs";


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
    leerEscribir: { label: "Leer y escribir", base: "cul", baseValue: 0, invested: 0, total: 0, group: "general" },
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
    merged[key] = {
      label: skills[key]?.label ?? def.label,
      base: skills[key]?.base ?? def.base,
      baseValue: Number.isFinite(Number(skills[key]?.baseValue)) ? Number(skills[key].baseValue) : 0,
      invested: Number.isFinite(Number(skills[key]?.invested)) ? Number(skills[key].invested) : 0,
      total: Number.isFinite(Number(skills[key]?.total)) ? Number(skills[key].total) : 0,
      group: skills[key]?.group ?? def.group
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
    armorTotal: Number.isFinite(Number(combat.armorTotal)) ? Number(combat.armorTotal) : 0,
    initiative: Number.isFinite(Number(combat.initiative)) ? Number(combat.initiative) : 0,
    lastFumble: combat.lastFumble ?? "",
    lastCritical: combat.lastCritical ?? "",
    lastHitLocation: combat.lastHitLocation ?? "",
    lastArmorAbsorbed: Number.isFinite(Number(combat.lastArmorAbsorbed)) ? Number(combat.lastArmorAbsorbed) : 0,
    lastRawDamage: Number.isFinite(Number(combat.lastRawDamage)) ? Number(combat.lastRawDamage) : 0,
    lastFinalDamage: Number.isFinite(Number(combat.lastFinalDamage)) ? Number(combat.lastFinalDamage) : 0
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
  return String(value ?? fallback).trim().toLowerCase();
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class AquelarreActor extends Actor {
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

    for (const skill of Object.values(system.skills)) {
      const baseVal = Number(ch?.[skill.base]?.value ?? 0);
      skill.baseValue = baseVal;
      skill.invested = Number(skill.invested ?? 0);
      skill.total = baseVal + skill.invested;
    }

    system.secondary = mergeSecondaryDefaults(system.secondary, res, computedLuck);
    system.combat = mergeCombatDefaults(system.combat);

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

canSpendCombatAction(cost = 1) {
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
getEquippedShield() {
  return this.items.find(i => i.type === "shield" && i.system.equipped) ?? null;
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

async resetCombatActions() {
  await this.update({
    "system.combat.actions.current": 2
  });
}

  async ensureActorDefaults() {
    const currentCharacteristics = mergeCharacteristicDefaults(this.system.characteristics);
    const res = Number(currentCharacteristics.res?.value ?? 10);
    const com = Number(currentCharacteristics.com?.value ?? 10);
    const per = Number(currentCharacteristics.per?.value ?? 10);
    const cul = Number(currentCharacteristics.cul?.value ?? 10);
    const computedLuck = com + per + cul;

    const skills = mergeSkillDefaults(this.system.skills);
    for (const skill of Object.values(skills)) {
      const baseVal = Number(currentCharacteristics?.[skill.base]?.value ?? 0);
      skill.baseValue = baseVal;
      skill.invested = Number(skill.invested ?? 0);
      skill.total = baseVal + skill.invested;
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
getNormalizedSex() {
  const raw = String(this.system.bio?.sex ?? "").trim().toLowerCase();

  if (!raw) return "";
  if (["hombre", "varon", "varón", "male", "masculino"].includes(raw)) return "male";
  if (["mujer", "female", "femenino"].includes(raw)) return "female";

  return raw;
}

getEquippedArmors() {
  return this.items.filter(i => i.type === "armor" && i.system.equipped);
}

getArmorProtectionForLocation(location) {
  const armors = this.getEquippedArmors();
  if (!armors.length) return 0;

  const normalized = String(location ?? "").trim().toLowerCase();

  return armors.reduce((sum, item) => {
    const protection = Number(item.system.protection ?? 0);
    const armorLocation = String(item.system.location ?? "general").trim().toLowerCase();

    const matches =
      armorLocation === "general" ||
      armorLocation === normalized ||
      (armorLocation === "brazos" && ["brazo-izquierdo", "brazo-derecho"].includes(normalized)) ||
      (armorLocation === "piernas" && ["pierna-izquierda", "pierna-derecha"].includes(normalized));

    return sum + (matches ? protection : 0);
  }, 0);
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

async rollWeaponDamage(weapon, { critical = false } = {}) {
  if (!weapon) {
    ui.notifications.warn("No hay arma seleccionada.");
    return null;
  }

  const formula = String(weapon.system.damage || "1d3").trim() || "1d3";
  const damageRoll = await rollFormula(this, formula, `Daño: ${weapon.name}`);

  let total = Number(damageRoll.total ?? 0);
  let criticalBonus = 0;

  if (critical) {
    criticalBonus = applyCriticalDamageBonus(total);
    total += criticalBonus;
  }

  return {
    weapon,
    formula,
    roll: damageRoll.roll,
    baseDamage: Number(damageRoll.total ?? 0),
    criticalBonus,
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

  if (!this.canSpendCombatAction(1)) {
  ui.notifications.warn("No te quedan acciones de combate.");
  return null;
}

  if (!targetActor) {
    ui.notifications.warn("No hay objetivo válido.");
    return null;
  }
  const weapon = this.getWeaponById(weaponId) ?? this.getPrimaryEquippedWeapon();
  if (!weapon) {
    ui.notifications.warn("No tienes un arma equipada o seleccionada.");
    return null;
  }

  const skillKey = attackSkillKey || normalizeSkillKey(weapon.system.skill, "espadas");
  const attackSkill = this.system.skills?.[skillKey];
  if (!attackSkill) {
    ui.notifications.warn(`La competencia ${skillKey} no existe en el atacante.`);
    return null;
  }

  const difficultyKey = difficulty ?? this.system.combat?.difficulty ?? "normal";
  const diffMod = Number(DIFFICULTY_MODS[difficultyKey] ?? 0);

  const atkMod = Number(
    attackModifier ?? this.system.combat?.attackModifier ?? 0
  );

  const attackTarget = clampPercent(
    Number(attackSkill.total ?? 0) + atkMod + diffMod
  );

  const attackRoll = await rollPercent(this, attackTarget, `Ataque con ${weapon.name}`);

  let defenseRoll = null;
  const defenseDifficultyMod = Number(targetActor.getDifficultyMod?.() ?? 0);

  if (defenseSkillKey) {
    const defenderSkill = targetActor.system.skills?.[defenseSkillKey];
    if (defenderSkill) {
      const defMod = Number(
        defenseModifier ?? targetActor.system.combat?.defenseModifier ?? 0
      );

      const equipmentDefenseBonus = targetActor.getDefenseBonusFromEquipment(defenseSkillKey);
      const defenseTarget = clampPercent(
        Number(defenderSkill.total ?? 0) + defMod + equipmentDefenseBonus + defenseDifficultyMod
      );

      defenseRoll = await rollPercent(
        targetActor,
        defenseTarget,
        `Defensa: ${defenderSkill.label}`
      );
    }
  } else {
    const defenseSource = targetActor.getDefenseSourceData?.();
    if (defenseSource?.valid) {
      const sourceModifier = Number(defenseSource.modifier ?? 0);
      const defMod = Number(defenseModifier ?? sourceModifier);
      const defenseTarget = clampPercent(
        Number(defenseSource.target ?? 0) + defMod + defenseDifficultyMod
      );

      defenseRoll = await rollPercent(
        targetActor,
        defenseTarget,
        `Defensa: ${defenseSource.label}`
      );
    }
  }

  const comparison = compareAttackDefense(attackRoll, defenseRoll);
  await this.spendCombatAction(1);
  if (!comparison.hit) {
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `
        <div class="aquelarre-chat">
          <h3>Ataque fallido</h3>
          <p><strong>Atacante:</strong> ${this.name}</p>
          <p><strong>Objetivo:</strong> ${targetActor.name}</p>
          <p><strong>Arma:</strong> ${weapon.name}</p>
          <p><strong>Resultado:</strong> ${comparison.reason}</p>
          <p><strong>Tirada de ataque:</strong> ${attackRoll.result} / ${attackRoll.target}</p>
          ${defenseRoll ? `<p><strong>Tirada de defensa:</strong> ${defenseRoll.result} / ${defenseRoll.target}</p>` : ""}
        </div>
      `
    });

    return {
      hit: false,
      comparison,
      attackRoll,
      defenseRoll,
      weapon
    };
  }
  const locationRoll = await rollFormula(this, "1d100", "Localización");
const hitLocation = getHitLocation(locationRoll.total);

  const damageData = await this.rollWeaponDamage(weapon, { critical: attackRoll.critical });
  const applied = await targetActor.applyDamageToLocation(damageData.totalDamage, hitLocation);

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: this }),
    content: `
      <div class="aquelarre-chat">
        <h3>Impacto</h3>
        <p><strong>Atacante:</strong> ${this.name}</p>
        <p><strong>Objetivo:</strong> ${targetActor.name}</p>
        <p><strong>Arma:</strong> ${weapon.name}</p>
        <p><strong>Tirada de ataque:</strong> ${attackRoll.result} / ${attackRoll.target}</p>
        ${defenseRoll ? `<p><strong>Tirada de defensa:</strong> ${defenseRoll.result} / ${defenseRoll.target}</p>` : ""}
        <p><strong>Localización:</strong> ${hitLocation}</p>
        <p><strong>Daño base:</strong> ${damageData.baseDamage}</p>
        ${damageData.criticalBonus ? `<p><strong>Bono crítico:</strong> +${damageData.criticalBonus}</p>` : ""}
        <p><strong>Daño bruto:</strong> ${applied.rawDamage}</p>
        <p><strong>Armadura absorbida:</strong> ${applied.armorAbsorbed}</p>
        <p><strong>Daño final:</strong> ${applied.finalDamage}</p>
        <p><strong>PV:</strong> ${applied.pvBefore} → ${applied.pvAfter}</p>
        <p><strong>Estado:</strong> ${applied.state}</p>
      </div>
    `
  });

  return {
    hit: true,
    comparison,
    attackRoll,
    defenseRoll,
    weapon,
    hitLocation,
    damageData,
    applied
  };
}


async applyDamageToLocation(rawDamage, location, { ignoreArmor = false } = {}) {
  const damage = Math.max(0, Number(rawDamage ?? 0));
  const hitLocation = String(location ?? "torso").trim().toLowerCase();

  const armorAbsorbed = ignoreArmor ? 0 : this.getArmorProtectionForLocation(hitLocation);
  const finalDamage = Math.max(0, damage - armorAbsorbed);

  const currentPv = Number(this.system.secondary?.pv?.value ?? 0);
  const maxPv = Number(this.system.secondary?.pv?.max ?? currentPv);
  const newPv = Math.max(-999, currentPv - finalDamage);

  await this.update({
    "system.secondary.pv.value": newPv,
    "system.combat.lastHitLocation": hitLocation,
    "system.combat.lastArmorAbsorbed": armorAbsorbed,
    "system.combat.lastRawDamage": damage,
    "system.combat.lastFinalDamage": finalDamage
  });

  let state = "ileso";
  if (finalDamage > 0) state = "herido";
  if (newPv <= 0) state = "incapacitado";
  if (newPv < 0) state = "moribundo";

  return {
    rawDamage: damage,
    armorAbsorbed,
    finalDamage,
    location: hitLocation,
    pvBefore: currentPv,
    pvAfter: newPv,
    pvMax: maxPv,
    state
  };
}

meetsProfessionMinStats(professionKey) {
  const prof = PROFESSIONS_RAW[professionKey];
  if (!prof) return false;

  const minStats = prof.minStats ?? {};

  for (const [statKey, minValue] of Object.entries(minStats)) {
    let current = 0;

    if (statKey === "luck") {
      current = Number(this.system.secondary?.luck?.value ?? 0);
    } else {
      current = Number(this.system.characteristics?.[statKey]?.value ?? 0);
    }

    if (current < Number(minValue ?? 0)) return false;
  }

  return true;
}


getProfessionInvalidReasons(professionKey) {
  const prof = PROFESSIONS_RAW[professionKey];
  if (!prof) return ["Profesión inexistente"];

  const reasons = [];
  const creation = this.system.creation ?? {};
  const society = creation.society || this.getDerivedSociety();
  const socialClassKey = creation.socialClassKey ?? "";
  const ethnicityKey = creation.ethnicityKey ?? "";
  const kingdomKey = creation.kingdom ?? "";
  const sex = this.getNormalizedSex();

  if (prof.society?.length && society && !prof.society.includes(society)) {
    reasons.push("Sociedad incompatible");
  }

  if (prof.socialClass?.length && socialClassKey && !prof.socialClass.includes(socialClassKey)) {
    reasons.push("Clase social incompatible");
  }

  if (prof.ethnicities?.length && ethnicityKey && !prof.ethnicities.includes(ethnicityKey)) {
    reasons.push("Grupo étnico incompatible");
  }

  if (prof.kingdoms?.length && kingdomKey && !prof.kingdoms.includes(kingdomKey)) {
    reasons.push("Reino incompatible");
  }

  if (prof.sex?.length && sex && !prof.sex.includes(sex)) {
    reasons.push("Sexo incompatible");
  }

  if (!this.meetsProfessionMinStats(professionKey)) {
    reasons.push("No cumple mínimos de características");
  }

  return reasons;
}

async applyProfessionRAW(key) {
  const prof = PROFESSIONS_RAW[key];
  if (!prof) {
    ui.notifications?.warn(`Profesión no válida: ${key}`);
    return;
  }

  if (!this.isProfessionValid(key)) {
    const reasonText = this.getProfessionInvalidReasons(key).join(", ");
    ui.notifications?.warn(`La profesión ${prof.label} no es válida: ${reasonText}`);
    return;
  }

  await this.refreshCreationTree();
  await this.ensureActorDefaults();

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

  await this.update({
    "system.creation.skillPoints": Number(prof.skillPoints ?? 0),
    "system.creation.allowedSkills": Array.isArray(prof.allowedSkills) ? [...prof.allowedSkills] : [],
    "system.creation.professionKey": key,
    "system.bio.profession": prof.label,
    "system.skills": skills
  });

  const existingNames = new Set(this.items.map(i => i.name));
  const toCreate = (prof.equipment ?? [])
    .filter(i => !existingNames.has(i.name))
    .map(i => foundry.utils.deepClone(i));

  if (toCreate.length) {
    await this.createEmbeddedDocuments("Item", toCreate);
  }

  ui.notifications?.info(`Profesión RAW aplicada: ${prof.label}`);
}



getProfessionValidationData(professionKey) {
  const prof = PROFESSIONS_RAW[professionKey];
  if (!prof) {
    return {
      key: professionKey,
      label: professionKey,
      valid: false,
      reasons: ["Profesión inexistente"],
      reasonText: "Profesión inexistente"
    };
  }

  const reasons = this.getProfessionInvalidReasons(professionKey);
  return {
    key: professionKey,
    label: prof.label,
    valid: reasons.length === 0,
    reasons,
    reasonText: reasons.join(", ")
  };
}


 getRemainingSkillPoints() {
  const total = Number(this.system.creation?.skillPoints ?? 0);
  const spent = this.getTotalSpentSkillPoints();

  return Math.max(0, total - spent);
}

getDerivedSociety() {
  const ethnicityKey = this.system.creation?.ethnicityKey ?? "";
  return getEthnicitySociety(ethnicityKey);
}

getAllowedSocialClasses() {
  const ethnicityKey = this.system.creation?.ethnicityKey ?? "";
  return getAllowedSocialClassKeysForEthnicity(ethnicityKey);
}

getValidProfessionKeys() {
  const creation = this.system.creation ?? {};
  const society = creation.society || this.getDerivedSociety();
  const socialClassKey = creation.socialClassKey ?? "";
  const ethnicityKey = creation.ethnicityKey ?? "";
  const kingdomKey = creation.kingdom ?? "";
  const sex = this.getNormalizedSex();

  return getValidProfessionKeys({
    society,
    socialClassKey,
    ethnicityKey,
    kingdomKey,
    sex
  }).filter(key => this.meetsProfessionMinStats(key));
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
  const skill = this.system.skills?.[key];
  if (!skill) return 1;

  return this.getSkillStepCostFromTotal(Number(skill.total ?? 0));
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

getSkillPointSummary() {
  const total = Number(this.system.creation?.skillPoints ?? 0);
  const spent = this.getTotalSpentSkillPoints();
  const remaining = Math.max(0, total - spent);

  return { total, spent, remaining };
}

getSkillInvestmentBreakdown() {
  return Object.entries(this.system.skills ?? {})
    .map(([key, skill]) => {
      const invested = Number(skill?.invested ?? 0);
      if (invested <= 0) return null;

      return {
        key,
        label: skill?.label ?? key,
        invested,
        total: Number(skill?.total ?? 0),
        spent: this.getSkillSpentPoints(key)
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.spent !== a.spent) return b.spent - a.spent;
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

  if (remaining < cost) return false;
  if (Number(skill.total ?? 0) >= max) return false;

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

async consumeAction() {
  if (!this.canSpendCombatAction(1)) {
    ui.notifications?.warn("No te quedan acciones de combate.");
    return Number(this.system.combat?.actions?.current ?? 0);
  }

  return this.spendCombatAction(1);
}

async resetActions() {
  await this.resetCombatActions();
  return Number(this.system.combat?.actions?.current ?? 2);
}

async resolveAttackAgainst(targetActor, weaponId = "") {
  return this.resolveWeaponAttack({ targetActor, weaponId });
}

  async generateCharacteristics() {
    const updates = {};

    for (const key of ["fue", "agi", "hab", "res", "per", "com", "cul"]) {
      const roll = await rollFormula(this, "2d6+4", `Generación ${key.toUpperCase()}`);
      updates[`system.characteristics.${key}.value`] = roll.total;
    }

    await this.update(updates);
    await this.ensureActorDefaults();

    await postSimpleMessage(this, "Generación de características", [
      "Se han generado las características con 2d6+4."
    ]);
  }

async randomizeOrigin() {
  const kingdomKeys = Object.keys(KINGDOMS);
  if (!kingdomKeys.length) return;

  const kingdomKey = randomChoice(kingdomKeys);
  const kingdomData = KINGDOMS[kingdomKey];
  const ethnicityPool = Array.isArray(kingdomData?.ethnicities) ? kingdomData.ethnicities : [];
  if (!ethnicityPool.length) return;

  const ethnicityKey = randomChoice(ethnicityPool);
  const ethnicityData = ETHNICITIES_RAW[ethnicityKey] ?? null;

  const socialClassPool = getAllowedSocialClassKeysForEthnicity(ethnicityKey);
  if (!socialClassPool.length) return;

  const socialClassKey = randomChoice(socialClassPool);
  const society = getEthnicitySociety(ethnicityKey);

  await this.update({
    "system.creation.kingdom": kingdomKey,
    "system.creation.ethnicityKey": ethnicityKey,
    "system.creation.socialClassKey": socialClassKey,
    "system.creation.society": society,
    "system.creation.professionKey": "",
    "system.creation.validProfessionKeys": [],
    "system.bio.kingdom": kingdomData?.label ?? kingdomKey,
    "system.bio.ethnicity": ethnicityData?.label ?? ethnicityKey,
    "system.bio.socialClass": SOCIAL_CLASSES[socialClassKey] ?? socialClassKey
  });

  await this.refreshCreationTree();
}

  async generateBackstory() {
    const bio = this.system.bio ?? {};
    const profession = bio.profession || "oficio incierto";
    const ethnicity = bio.ethnicity || "origen desconocido";
    const socialClass = bio.socialClass || "condición humilde";

    const text =
      `${this.name} pertenece al grupo ${ethnicity.toLowerCase()} y procede de un entorno ${socialClass.toLowerCase()}. ` +
      `Su oficio principal es ${profession.toLowerCase()}, y su vida ha estado marcada por las tensiones del mundo medieval, la superstición y la necesidad de sobrevivir.`;

    await this.update({ "system.bio.history": text });
  }


getSelectedProfessionData() {
  const key = this.system.creation?.professionKey ?? "";
  if (!key) return null;

  const prof = PROFESSIONS_RAW[key];
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
    key,
    label: prof.label,
    valid: validation.valid,
    reasonText: validation.reasonText,
    reasons: validation.reasons,
    society: prof.society ?? [],
    socialClass: prof.socialClass ?? [],
    ethnicities: prof.ethnicities ?? [],
    kingdoms: prof.kingdoms ?? [],
    sex: prof.sex ?? [],
    minStats: minStatEntries,
    skillPoints: Number(prof.skillPoints ?? 0),
    allowedSkills: Array.isArray(prof.allowedSkills) ? [...prof.allowedSkills] : [],
    money: prof.money ?? ""
  };
}

getProfessionSummaryBadges() {
  const data = this.getSelectedProfessionData();
  if (!data) return [];

  const badges = [];

  if (data.valid) {
    badges.push({ label: "Disponible", type: "ok" });
  } else {
    badges.push({ label: "Bloqueada", type: "error" });
  }

  if (data.society.length) {
    badges.push({ label: `Sociedad: ${data.society.join(", ")}`, type: "neutral" });
  }

  if (data.sex.length) {
    const sexLabel = data.sex.map(v => v === "male" ? "Hombre" : v === "female" ? "Mujer" : v).join(", ");
    badges.push({ label: `Sexo: ${sexLabel}`, type: "neutral" });
  }

  if (data.kingdoms.length) {
    badges.push({ label: `Reinos: ${data.kingdoms.join(", ")}`, type: "neutral" });
  }

  if (data.minStats.some(stat => !stat.ok)) {
    badges.push({ label: "No cumple mínimos", type: "warning" });
  }

  return badges;
}


getProfessionOptionsForCreation() {
  const creation = this.system.creation ?? {};
  const society = creation.society || this.getDerivedSociety();
  const socialClassKey = creation.socialClassKey ?? "";
  const ethnicityKey = creation.ethnicityKey ?? "";
  const kingdomKey = creation.kingdom ?? "";

  // Base del árbol: solo por sociedad / clase / etnia / reino
  // El sexo y los mínimos se usan para marcar inválidas, no para ocultarlas.
  const treeCompatibleKeys = Object.keys(PROFESSIONS_RAW).filter(key => {
    const prof = PROFESSIONS_RAW[key];
    if (!prof) return false;

    if (prof.society?.length && society && !prof.society.includes(society)) return false;
    if (prof.socialClass?.length && socialClassKey && !prof.socialClass.includes(socialClassKey)) return false;
    if (prof.ethnicities?.length && ethnicityKey && !prof.ethnicities.includes(ethnicityKey)) return false;
    if (prof.kingdoms?.length && kingdomKey && !prof.kingdoms.includes(kingdomKey)) return false;

    return true;
  });

  return treeCompatibleKeys
    .map(key => {
      const validation = this.getProfessionValidationData(key);
      return {
        key,
        label: validation.label,
        valid: validation.valid,
        reasonText: validation.reasonText
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, "es"));
}


isProfessionValid(key) {
  return this.getProfessionInvalidReasons(key).length === 0;
}
 
getDifficultyMod() {
    return Number(DIFFICULTY_MODS[this.system.combat?.difficulty ?? "normal"] ?? 0);
  }

  getSkillTarget(skillKey) {
    const key = normalizeSkillKey(skillKey, "esquivar");
    const skill = this.system.skills?.[key];
    if (!skill) return { key, skill: null, target: 0 };

    const target = clampPercent(Number(skill.total ?? 0));
    return { key, skill, target };
  }


  getEquippedShields() {
    return this.items.filter(i => i.type === "shield" && i.system.equipped);
  }

  getDefenseSourceData() {
    const mode = String(this.system.combat?.defenseMode ?? "skill");
    const defenseModifier = Number(this.system.combat?.defenseModifier ?? 0);

    if (mode === "weapon") {
      const weaponId = this.system.combat?.defenseWeaponId || this.getEquippedWeapons()[0]?.id;
      const weapon = weaponId ? this.items.get(weaponId) : null;
      if (!weapon) return { label: "Arma", target: 0, modifier: defenseModifier, valid: false };

      if (!weapon.system.defensive) {
        return { label: `${weapon.name}`, target: 0, modifier: defenseModifier, valid: false, reason: "arma-no-defensiva" };
      }

      const skillKey = normalizeSkillKey(weapon.system.skill, "espadas");
      const data = this.getSkillTarget(skillKey);
      const parryBonus = Number(weapon.system.parryBonus ?? 0);

      return {
        label: `${weapon.name}`,
        target: clampPercent(data.target + parryBonus),
        modifier: defenseModifier,
        valid: !!data.skill
      };
    }

    if (mode === "shield") {
      const shieldId = this.system.combat?.defenseShieldId || this.getEquippedShields()[0]?.id;
      const shield = shieldId ? this.items.get(shieldId) : null;
      if (!shield) return { label: "Escudo", target: 0, modifier: defenseModifier, valid: false };

      const data = this.getSkillTarget(normalizeSkillKey(shield.system.skill, "escudos"));
      const bonus = Number(shield.system.defenseBonus ?? 0);

      return {
        label: `${shield.name}`,
        target: clampPercent(data.target + bonus),
        modifier: defenseModifier,
        valid: !!data.skill
      };
    }

    const data = this.getSkillTarget(normalizeSkillKey(this.system.combat?.defenseSkill, "esquivar"));
    return { label: data.skill?.label ?? "Defensa", target: data.target, modifier: defenseModifier, valid: !!data.skill };
  }

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

  async rollDefense() {
    const defense = this.getDefenseSourceData();
    if (!defense.valid) {
      const msg = defense.reason === "arma-no-defensiva"
        ? `${this.name} ha seleccionado un arma no defensiva para parar.`
        : `${this.name} no tiene una defensa válida configurada.`;
      ui.notifications?.warn(msg);
      return null;
    }

    const target = clampPercent(defense.target + defense.modifier + this.getDifficultyMod());
    return this.rollPercent(target, `Defensa: ${defense.label}`);
  }

  async rollWeaponAttack(itemId) {
    const weapon = this.items.get(itemId);
    if (!weapon || weapon.type !== "weapon") return null;

    const data = this.getSkillTarget(normalizeSkillKey(weapon.system.skill, "espadas"));
    if (!data.skill) {
      ui.notifications?.warn(`El arma ${weapon.name} usa una competencia no válida: ${weapon.system.skill}`);
      return null;
    }

    const target = clampPercent(data.target + Number(this.system.combat?.attackModifier ?? 0) + this.getDifficultyMod());
    return this.rollPercent(target, `Ataque: ${weapon.name} [${data.skill.label}]`);
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

  async rollInitiative() {
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

  async toggleItemEquipped(itemId) {
    const item = this.items.get(itemId);
    if (!item) return;
    await item.update({ "system.equipped": !Boolean(item.system.equipped) });
  }


}
