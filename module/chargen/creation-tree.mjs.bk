// module/chargen/creation-tree.mjs

// =======================
// KINGDOMS
// =======================

export const KINGDOMS = {
  castilla: {
    label: "Corona de Castilla",
    ethnicities: ["castellano", "gallego", "vasco", "judio", "mudejar"]
  },
  aragon: {
    label: "Corona de Aragón",
    ethnicities: ["aragones", "catalan", "judio", "mudejar"]
  },
  navarra: {
    label: "Reino de Navarra",
    ethnicities: ["navarro", "vasco", "judio", "mudejar"]
  },
  portugal: {
    label: "Reino de Portugal",
    ethnicities: ["portugues", "judio", "mudejar"]
  },
  granada: {
    label: "Reino de Granada",
    ethnicities: ["andalusi", "judio", "mudejar"]
  }
};

// =======================
// ETHNICITIES
// =======================

export const ETHNICITIES_RAW = {
  castellano: {
    label: "Castellano",
    society: "cristiana",
    allowedSocialClasses: ["alta-nobleza", "baja-nobleza", "burguesia", "villano", "campesinado", "clero", "marginado"]
  },
  judio: {
    label: "Judío",
    society: "judia",
    allowedSocialClasses: ["alta-nobleza", "burguesia", "villano", "campesinado", "clero", "marginado"]
  },
  mudejar: {
    label: "Mudéjar",
    society: "islamica",
    allowedSocialClasses: ["alta-nobleza", "baja-nobleza", "burguesia", "villano", "campesinado", "clero", "marginado"]
  },
  vasco: {
    label: "Vasco",
    society: "cristiana",
    allowedSocialClasses: ["villano", "campesinado"]
  }
};

// =======================
// SOCIAL CLASSES
// =======================

export const SOCIAL_CLASSES = {
  "alta-nobleza": "Alta nobleza",
  "baja-nobleza": "Baja nobleza",
  "burguesia": "Burguesía",
  "villano": "Villano",
  "campesinado": "Campesinado",
  "clero": "Clero",
  "marginado": "Marginado"
};

// =======================
// SOCIETY LABELS
// =======================

export const SOCIETY_LABELS = {
  cristiana: "Cristiana",
  judia: "Judía",
  islamica: "Islámica"
};

// =======================
// HELPERS (UI)
// =======================

export function kingdomOptions() {
  return Object.entries(KINGDOMS)
    .map(([key, data]) => [key, data.label])
    .sort((a, b) => a[1].localeCompare(b[1], "es"));
}

export function ethnicityOptionsForKingdom(kingdomKey) {
  if (!kingdomKey || !KINGDOMS[kingdomKey]) return [];

  return KINGDOMS[kingdomKey].ethnicities
    .filter(key => ETHNICITIES_RAW[key])
    .map(key => [key, ETHNICITIES_RAW[key].label])
    .sort((a, b) => a[1].localeCompare(b[1], "es"));
}

export function socialClassOptionsForEthnicity(ethnicityKey) {
  if (!ethnicityKey || !ETHNICITIES_RAW[ethnicityKey]) return [];

  const allowed = ETHNICITIES_RAW[ethnicityKey].allowedSocialClasses;

  return allowed
    .filter(key => SOCIAL_CLASSES[key])
    .map(key => [key, SOCIAL_CLASSES[key]]);
}

export function getSocietyLabel(key) {
  return SOCIETY_LABELS[key] ?? "";
}

// =======================
// LOGIC HELPERS (ACTOR)
// =======================

export function getEthnicitySociety(ethnicityKey) {
  return ETHNICITIES_RAW[ethnicityKey]?.society ?? "";
}

export function getAllowedSocialClassKeysForEthnicity(ethnicityKey) {
  return ETHNICITIES_RAW[ethnicityKey]?.allowedSocialClasses ?? [];
}
