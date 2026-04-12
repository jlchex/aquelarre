import { RURAL_PROFESSIONS } from "./professions/rural.mjs";
import { URBAN_PROFESSIONS } from "./professions/urban.mjs";
import { MILITARY_PROFESSIONS } from "./professions/military.mjs";
import { RELIGIOUS_PROFESSIONS } from "./professions/religious.mjs";
import { OCCULT_PROFESSIONS } from "./professions/occult.mjs";
import { MARITIME_PROFESSIONS } from "./professions/maritime.mjs";
import { CIVIC_PROFESSIONS } from "./professions/civic.mjs";
import { CRIMINAL_PROFESSIONS } from "./professions/criminal.mjs";
import { validateProfessionDataset } from "./professions/_validate.mjs";
import { NOBILITY_PROFESSIONS } from "./professions/nobility.mjs";
import { FRONTIER_PROFESSIONS } from "./professions/frontier.mjs";
import { REGIONAL_PROFESSIONS } from "./professions/regional.mjs";

function clone(data) {
  return foundry.utils.deepClone(data);
}

export const PROFESSIONS_RAW = {
  ...RURAL_PROFESSIONS,
  ...URBAN_PROFESSIONS,
  ...MILITARY_PROFESSIONS,
  ...RELIGIOUS_PROFESSIONS,
  ...OCCULT_PROFESSIONS,
  ...MARITIME_PROFESSIONS,
  ...CIVIC_PROFESSIONS,
  ...CRIMINAL_PROFESSIONS,
  ...NOBILITY_PROFESSIONS,
  ...FRONTIER_PROFESSIONS,
  ...REGIONAL_PROFESSIONS
};

const DATASET_ERRORS = validateProfessionDataset(PROFESSIONS_RAW);
if (DATASET_ERRORS.length) {
  console.error("Aquelarre | Errores en PROFESSIONS_RAW");
  for (const err of DATASET_ERRORS) console.error(err);
}

function normalizeProfessionData(key, data = {}) {
  return {
    key,
    label: data.label ?? key,
    society: Array.isArray(data.society) ? [...data.society] : [],
    socialClass: Array.isArray(data.socialClass) ? [...data.socialClass] : [],
    ethnicities: Array.isArray(data.ethnicities) ? [...data.ethnicities] : [],
    kingdoms: Array.isArray(data.kingdoms) ? [...data.kingdoms] : [],
    sex: Array.isArray(data.sex) ? [...data.sex] : [],
    minStats: clone(data.minStats ?? {}),
    skillPoints: Number(data.skillPoints ?? 0),
    allowedSkills: Array.isArray(data.allowedSkills) ? [...data.allowedSkills] : [],
    equipment: clone(data.equipment ?? []),
    money: data.money ?? "",
    source: clone(data.source ?? {
      book: "raw_local",
      note: "Profesión RAW para sistema Foundry"
    })
  };
}

export function getProfessionRaw(key) {
  const data = PROFESSIONS_RAW[key];
  return data ? normalizeProfessionData(key, data) : null;
}

export function getProfessionKeys() {
  return Object.keys(PROFESSIONS_RAW);
}

export function getProfessionEntries() {
  return getProfessionKeys()
    .map(key => getProfessionRaw(key))
    .filter(Boolean);
}

export function getProfessionLabel(key) {
  return PROFESSIONS_RAW[key]?.label ?? key;
}

export function professionMatchesTree(professionKey, {
  society = "",
  socialClassKey = "",
  ethnicityKey = "",
  kingdomKey = "",
  sex = ""
} = {}) {
  const prof = getProfessionRaw(professionKey);
  if (!prof) return false;

  if (prof.society.length && society && !prof.society.includes(society)) return false;
  if (prof.socialClass.length && socialClassKey && !prof.socialClass.includes(socialClassKey)) return false;
  if (prof.ethnicities.length && ethnicityKey && !prof.ethnicities.includes(ethnicityKey)) return false;
  if (prof.kingdoms.length && kingdomKey && !prof.kingdoms.includes(kingdomKey)) return false;
  if (prof.sex.length && sex && !prof.sex.includes(sex)) return false;

  return true;
}

export function getValidProfessionKeys({
  society = "",
  socialClassKey = "",
  ethnicityKey = "",
  kingdomKey = "",
  sex = ""
} = {}) {
  return getProfessionKeys().filter(key =>
    professionMatchesTree(key, {
      society,
      socialClassKey,
      ethnicityKey,
      kingdomKey,
      sex
    })
  );
}

export function validateProfessionForActorData(professionKey, {
  society = "",
  socialClassKey = "",
  ethnicityKey = "",
  kingdomKey = "",
  sex = "",
  stats = {},
  luck = 0
} = {}) {
  const prof = getProfessionRaw(professionKey);

  if (!prof) {
    return {
      key: professionKey,
      label: professionKey,
      valid: false,
      reasons: ["Profesión inexistente"],
      reasonText: "Profesión inexistente",
      profession: null
    };
  }

  const reasons = [];

  if (prof.society.length && society && !prof.society.includes(society)) {
    reasons.push("Sociedad incompatible");
  }

  if (prof.socialClass.length && socialClassKey && !prof.socialClass.includes(socialClassKey)) {
    reasons.push("Clase social incompatible");
  }

  if (prof.ethnicities.length && ethnicityKey && !prof.ethnicities.includes(ethnicityKey)) {
    reasons.push("Grupo étnico incompatible");
  }

  if (prof.kingdoms.length && kingdomKey && !prof.kingdoms.includes(kingdomKey)) {
    reasons.push("Reino incompatible");
  }

  if (prof.sex.length && sex && !prof.sex.includes(sex)) {
    reasons.push("Sexo incompatible");
  }

  for (const [statKey, minValue] of Object.entries(prof.minStats)) {
    const currentValue = statKey === "luck"
      ? Number(luck ?? 0)
      : Number(stats?.[statKey] ?? 0);

    if (currentValue < Number(minValue ?? 0)) {
      reasons.push("No cumple mínimos de características");
      break;
    }
  }

  return {
    key: prof.key,
    label: prof.label,
    valid: reasons.length === 0,
    reasons,
    reasonText: reasons.join(", "),
    profession: prof
  };
}

export function buildProfessionItemsForCreation(professionKey, {
  markGranted = true
} = {}) {
  const prof = getProfessionRaw(professionKey);
  if (!prof) return [];

  return prof.equipment.map(item => {
    const cloned = clone(item);

    if (markGranted) {
      cloned.flags ??= {};
      cloned.flags.aquelarre ??= {};
      cloned.flags.aquelarre.grantedByProfession = professionKey;
      cloned.flags.aquelarre.creationGranted = true;
    }

    return cloned;
  });
}
