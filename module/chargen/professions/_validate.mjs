const VALID_SKILLS = new Set([
  "alquimia",
  "astrologia",
  "descubrir",
  "esquivar",
  "leer_y_escribir",
  "medicina",
  "persuasion",
  "sigilo",
  "culto",
  "arcos",
  "ballestas",
  "cuchillos",
  "escudos",
  "espadas",
  "espadones",
  "hachas",
  "hondas",
  "lanzas",
  "mazas",
  "palos",
  "pelea"
]);

const VALID_STATS = new Set([
  "fue",
  "agi",
  "hab",
  "res",
  "per",
  "com",
  "cul",
  "luck"
]);

export function validateProfessionDataset(professions) {
  const errors = [];

  for (const [key, prof] of Object.entries(professions)) {
    if (!prof.label) {
      errors.push(`[${key}] falta label`);
    }

    if (!Number.isFinite(Number(prof.skillPoints))) {
      errors.push(`[${key}] skillPoints inválido`);
    }

    for (const skill of prof.allowedSkills ?? []) {
      if (!VALID_SKILLS.has(skill)) {
        errors.push(`[${key}] skill no reconocida: ${skill}`);
      }
    }

    for (const statKey of Object.keys(prof.minStats ?? {})) {
      if (!VALID_STATS.has(statKey)) {
        errors.push(`[${key}] stat mínima no reconocida: ${statKey}`);
      }
    }

    for (const item of prof.equipment ?? []) {
      if (!item?.type) {
        errors.push(`[${key}] item de equipo sin type`);
      }
      if (!item?.name) {
        errors.push(`[${key}] item de equipo sin name`);
      }
    }
  }

  return errors;
}
