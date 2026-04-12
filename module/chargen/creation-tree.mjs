// systems/aquelarre/module/chargen/creation-tree.mjs

/* ============================================= */
/*  CREATION TREE - AQUELARRE                    */
/*  Reino -> Etnia -> Sociedad -> Clase social   */
/* ============================================= */

/* --------------------------------------------- */
/*  Kingdoms                                    */
/* --------------------------------------------- */

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

/* --------------------------------------------- */
/*  Ethnicities                                 */
/* --------------------------------------------- */

export const ETHNICITIES_RAW = {
  castellano: {
    label: "Castellano",
    society: "cristiana",
    allowedSocialClasses: [
      "alta-nobleza",
      "baja-nobleza",
      "burguesia",
      "villano",
      "campesinado",
      "clero",
      "marginado"
    ]
  },

  gallego: {
    label: "Gallego",
    society: "cristiana",
    allowedSocialClasses: [
      "alta-nobleza",
      "baja-nobleza",
      "burguesia",
      "villano",
      "campesinado",
      "clero",
      "marginado"
    ]
  },

  vasco: {
    label: "Vasco",
    society: "cristiana",
    allowedSocialClasses: [
      "villano",
      "campesinado",
      "baja-nobleza",
      "clero"
    ]
  },

  aragones: {
    label: "Aragonés",
    society: "cristiana",
    allowedSocialClasses: [
      "alta-nobleza",
      "baja-nobleza",
      "burguesia",
      "villano",
      "campesinado",
      "clero",
      "marginado"
    ]
  },

  catalan: {
    label: "Catalán",
    society: "cristiana",
    allowedSocialClasses: [
      "alta-nobleza",
      "baja-nobleza",
      "burguesia",
      "villano",
      "campesinado",
      "clero",
      "marginado"
    ]
  },

  navarro: {
    label: "Navarro",
    society: "cristiana",
    allowedSocialClasses: [
      "alta-nobleza",
      "baja-nobleza",
      "burguesia",
      "villano",
      "campesinado",
      "clero",
      "marginado"
    ]
  },

  portugues: {
    label: "Portugués",
    society: "cristiana",
    allowedSocialClasses: [
      "alta-nobleza",
      "baja-nobleza",
      "burguesia",
      "villano",
      "campesinado",
      "clero",
      "marginado"
    ]
  },

  andalusi: {
    label: "Andalusí",
    society: "islamica",
    allowedSocialClasses: [
      "alta-nobleza",
      "baja-nobleza",
      "burguesia",
      "villano",
      "campesinado",
      "clero",
      "marginado"
    ]
  },

  judio: {
    label: "Judío",
    society: "judia",
    allowedSocialClasses: [
      "alta-nobleza",
      "burguesia",
      "villano",
      "campesinado",
      "clero",
      "marginado"
    ]
  },

  mudejar: {
    label: "Mudéjar",
    society: "islamica",
    allowedSocialClasses: [
      "alta-nobleza",
      "baja-nobleza",
      "burguesia",
      "villano",
      "campesinado",
      "clero",
      "marginado"
    ]
  }
};

/* --------------------------------------------- */
/*  Social classes                              */
/* --------------------------------------------- */

export const SOCIAL_CLASSES = {
  "alta-nobleza": "Alta nobleza",
  "baja-nobleza": "Baja nobleza",
  burguesia: "Burguesía",
  villano: "Villano",
  campesinado: "Campesinado",
  clero: "Clero",
  marginado: "Marginado"
};

/* --------------------------------------------- */
/*  Society labels                              */
/* --------------------------------------------- */

export const SOCIETY_LABELS = {
  cristiana: "Cristiana",
  judia: "Judía",
  islamica: "Islámica"
};

/* --------------------------------------------- */
/*  Generic helpers                             */
/* --------------------------------------------- */

function clone(value) {
  return foundry.utils.deepClone(value);
}

function safeString(value) {
  return String(value ?? "").trim().toLowerCase();
}

function bySpanishLabel(a, b) {
  return String(a[1]).localeCompare(String(b[1]), "es");
}

/* --------------------------------------------- */
/*  UI option helpers                           */
/* --------------------------------------------- */

export function kingdomOptions() {
  return Object.entries(KINGDOMS)
    .map(([key, data]) => [key, data.label])
    .sort(bySpanishLabel);
}

export function ethnicityOptionsForKingdom(kingdomKey) {
  const key = safeString(kingdomKey);
  if (!key || !KINGDOMS[key]) return [];

  return KINGDOMS[key].ethnicities
    .filter(ethnicityKey => ETHNICITIES_RAW[ethnicityKey])
    .map(ethnicityKey => [ethnicityKey, ETHNICITIES_RAW[ethnicityKey].label])
    .sort(bySpanishLabel);
}

export function socialClassOptionsForEthnicity(ethnicityKey) {
  const key = safeString(ethnicityKey);
  if (!key || !ETHNICITIES_RAW[key]) return [];

  return ETHNICITIES_RAW[key].allowedSocialClasses
    .filter(classKey => !!SOCIAL_CLASSES[classKey])
    .map(classKey => [classKey, SOCIAL_CLASSES[classKey]]);
}

export function getSocietyLabel(key) {
  return SOCIETY_LABELS[safeString(key)] ?? "";
}

export function getKingdomLabel(key) {
  return KINGDOMS[safeString(key)]?.label ?? "";
}

export function getEthnicityLabel(key) {
  return ETHNICITIES_RAW[safeString(key)]?.label ?? "";
}

export function getSocialClassLabel(key) {
  return SOCIAL_CLASSES[safeString(key)] ?? "";
}

/* --------------------------------------------- */
/*  Logic helpers                               */
/* --------------------------------------------- */

export function getEthnicitySociety(ethnicityKey) {
  const key = safeString(ethnicityKey);
  return ETHNICITIES_RAW[key]?.society ?? "";
}

export function getAllowedSocialClassKeysForEthnicity(ethnicityKey) {
  const key = safeString(ethnicityKey);
  if (!key || !ETHNICITIES_RAW[key]) return [];
  return [...ETHNICITIES_RAW[key].allowedSocialClasses];
}

export function isEthnicityAllowedForKingdom(kingdomKey, ethnicityKey) {
  const k = safeString(kingdomKey);
  const e = safeString(ethnicityKey);

  if (!k || !e || !KINGDOMS[k]) return false;
  return KINGDOMS[k].ethnicities.includes(e);
}

export function isSocialClassAllowedForEthnicity(ethnicityKey, socialClassKey) {
  const e = safeString(ethnicityKey);
  const s = safeString(socialClassKey);

  if (!e || !s || !ETHNICITIES_RAW[e]) return false;
  return ETHNICITIES_RAW[e].allowedSocialClasses.includes(s);
}

/* --------------------------------------------- */
/*  Full tree validation                        */
/* --------------------------------------------- */

export function validateCreationTree({
  kingdom = "",
  ethnicityKey = "",
  socialClassKey = ""
} = {}) {
  const kingdomKey = safeString(kingdom);
  const ethnicity = safeString(ethnicityKey);
  const socialClass = safeString(socialClassKey);

  const reasons = [];

  if (kingdomKey && !KINGDOMS[kingdomKey]) {
    reasons.push("Reino inválido");
  }

  if (ethnicity && !ETHNICITIES_RAW[ethnicity]) {
    reasons.push("Grupo étnico inválido");
  }

  if (socialClass && !SOCIAL_CLASSES[socialClass]) {
    reasons.push("Clase social inválida");
  }

  if (kingdomKey && ethnicity && !isEthnicityAllowedForKingdom(kingdomKey, ethnicity)) {
    reasons.push("El grupo étnico no pertenece al reino seleccionado");
  }

  if (ethnicity && socialClass && !isSocialClassAllowedForEthnicity(ethnicity, socialClass)) {
    reasons.push("La clase social no está permitida para el grupo étnico");
  }

  return {
    valid: reasons.length === 0,
    reasons,
    reasonText: reasons.join(", "),
    society: ethnicity ? getEthnicitySociety(ethnicity) : ""
  };
}

/* --------------------------------------------- */
/*  Enriched info helpers                       */
/* --------------------------------------------- */

export function getKingdomData(key) {
  const kingdomKey = safeString(key);
  const data = KINGDOMS[kingdomKey];
  if (!data) return null;

  return {
    key: kingdomKey,
    label: data.label,
    ethnicities: [...data.ethnicities]
  };
}

export function getEthnicityData(key) {
  const ethnicityKey = safeString(key);
  const data = ETHNICITIES_RAW[ethnicityKey];
  if (!data) return null;

  return {
    key: ethnicityKey,
    label: data.label,
    society: data.society,
    societyLabel: getSocietyLabel(data.society),
    allowedSocialClasses: [...data.allowedSocialClasses],
    allowedSocialClassLabels: data.allowedSocialClasses.map(classKey => ({
      key: classKey,
      label: SOCIAL_CLASSES[classKey] ?? classKey
    }))
  };
}

export function getSocialClassData(key) {
  const socialClassKey = safeString(key);
  const label = SOCIAL_CLASSES[socialClassKey];
  if (!label) return null;

  return {
    key: socialClassKey,
    label
  };
}

/* --------------------------------------------- */
/*  Sanitizers                                  */
/* --------------------------------------------- */

export function normalizeCreationSelection({
  kingdom = "",
  ethnicityKey = "",
  socialClassKey = ""
} = {}) {
  let normalizedKingdom = safeString(kingdom);
  let normalizedEthnicity = safeString(ethnicityKey);
  let normalizedSocialClass = safeString(socialClassKey);

  if (normalizedKingdom && !KINGDOMS[normalizedKingdom]) {
    normalizedKingdom = "";
  }

  if (normalizedEthnicity && !ETHNICITIES_RAW[normalizedEthnicity]) {
    normalizedEthnicity = "";
  }

  if (normalizedSocialClass && !SOCIAL_CLASSES[normalizedSocialClass]) {
    normalizedSocialClass = "";
  }

  if (
    normalizedKingdom &&
    normalizedEthnicity &&
    !isEthnicityAllowedForKingdom(normalizedKingdom, normalizedEthnicity)
  ) {
    normalizedEthnicity = "";
    normalizedSocialClass = "";
  }

  if (
    normalizedEthnicity &&
    normalizedSocialClass &&
    !isSocialClassAllowedForEthnicity(normalizedEthnicity, normalizedSocialClass)
  ) {
    normalizedSocialClass = "";
  }

  return {
    kingdom: normalizedKingdom,
    ethnicityKey: normalizedEthnicity,
    socialClassKey: normalizedSocialClass,
    society: normalizedEthnicity ? getEthnicitySociety(normalizedEthnicity) : ""
  };
}

/* --------------------------------------------- */
/*  Export snapshots                            */
/* --------------------------------------------- */

export function getCreationTreeSnapshot() {
  return {
    kingdoms: clone(KINGDOMS),
    ethnicities: clone(ETHNICITIES_RAW),
    socialClasses: clone(SOCIAL_CLASSES),
    societies: clone(SOCIETY_LABELS)
  };
}
