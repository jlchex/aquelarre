import { PROFESSIONS_RAW } from "../professions-raw.mjs";

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

const VALID_ITEM_TYPES = new Set([
  "weapon",
  "shield",
  "armor",
  "gear",
  "spell",
  "ritual"
]);

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function pushIssue(report, type, professionKey, message, extra = {}) {
  report.issues.push({
    type,
    professionKey,
    message,
    ...extra
  });
}

function summarizeIssues(report) {
  const counts = {};
  for (const issue of report.issues) {
    counts[issue.type] = (counts[issue.type] ?? 0) + 1;
  }
  report.counts = counts;
  return report;
}

export function validateProfessionsRawDataset(professions = PROFESSIONS_RAW) {
  const report = {
    total: 0,
    issues: [],
    counts: {}
  };

  const labelMap = new Map();

  for (const [key, prof] of Object.entries(professions)) {
    report.total += 1;

    if (!isNonEmptyString(prof.label)) {
      pushIssue(report, "missing-label", key, "La profesión no tiene label válido.");
    } else {
      const labelKey = prof.label.trim().toLowerCase();
      if (!labelMap.has(labelKey)) labelMap.set(labelKey, []);
      labelMap.get(labelKey).push(key);
    }

    if (!Number.isFinite(Number(prof.skillPoints))) {
      pushIssue(report, "invalid-skillPoints", key, "skillPoints no es numérico.");
    }

    const allowedSkills = asArray(prof.allowedSkills);
    if (!allowedSkills.length) {
      pushIssue(report, "missing-allowedSkills", key, "No tiene allowedSkills.");
    }

    for (const skill of allowedSkills) {
      if (!VALID_SKILLS.has(skill)) {
        pushIssue(report, "unknown-skill", key, `Skill no reconocida: ${skill}`, { skill });
      }
    }

    const minStats = prof.minStats ?? {};
    for (const [statKey, statValue] of Object.entries(minStats)) {
      if (!VALID_STATS.has(statKey)) {
        pushIssue(report, "unknown-stat", key, `Stat mínima no reconocida: ${statKey}`, { statKey });
      }
      if (!Number.isFinite(Number(statValue))) {
        pushIssue(report, "invalid-minStat", key, `Valor mínimo inválido para ${statKey}: ${statValue}`, {
          statKey,
          statValue
        });
      }
    }

    const equipment = asArray(prof.equipment);
    if (!equipment.length) {
      pushIssue(report, "missing-equipment", key, "No tiene equipo inicial.");
    }

    equipment.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        pushIssue(report, "invalid-item", key, `Item #${index} no es un objeto válido.`, { index });
        return;
      }

      if (!isNonEmptyString(item.name)) {
        pushIssue(report, "item-missing-name", key, `Item #${index} no tiene name.`, { index });
      }

      if (!VALID_ITEM_TYPES.has(item.type)) {
        pushIssue(report, "item-invalid-type", key, `Item #${index} tiene type inválido: ${item.type}`, {
          index,
          itemType: item.type
        });
      }

      if (!item.system || typeof item.system !== "object") {
        pushIssue(report, "item-missing-system", key, `Item #${index} no tiene system válido.`, { index });
      }

      if (item.type === "weapon") {
        if (!VALID_SKILLS.has(item.system?.skill)) {
          pushIssue(report, "weapon-invalid-skill", key, `Arma #${index} usa skill inválida: ${item.system?.skill}`, {
            index,
            skill: item.system?.skill
          });
        }
        if (!isNonEmptyString(item.system?.damage)) {
          pushIssue(report, "weapon-missing-damage", key, `Arma #${index} no tiene damage válido.`, { index });
        }
      }

      if (item.type === "shield") {
        if (item.system?.skill !== "escudos") {
          pushIssue(report, "shield-invalid-skill", key, `Escudo #${index} debería usar skill "escudos".`, {
            index,
            skill: item.system?.skill
          });
        }
      }

      if (item.type === "spell" || item.type === "ritual") {
        if (!VALID_SKILLS.has(item.system?.skill)) {
          pushIssue(report, "magic-invalid-skill", key, `Item mágico #${index} usa skill inválida: ${item.system?.skill}`, {
            index,
            skill: item.system?.skill
          });
        }
      }
    });

    const hasAnyRestriction =
      asArray(prof.society).length ||
      asArray(prof.socialClass).length ||
      asArray(prof.ethnicities).length ||
      asArray(prof.kingdoms).length ||
      asArray(prof.sex).length ||
      Object.keys(prof.minStats ?? {}).length;

    if (!hasAnyRestriction) {
      pushIssue(report, "no-restrictions", key, "No tiene restricciones de creación.");
    }
  }

  for (const [label, keys] of labelMap.entries()) {
    if (keys.length > 1) {
      for (const key of keys) {
        pushIssue(report, "duplicate-label", key, `Label duplicado compartido con: ${keys.join(", ")}`, {
          label,
          duplicates: [...keys]
        });
      }
    }
  }

  return summarizeIssues(report);
}

export function printProfessionsRawDatasetReport(professions = PROFESSIONS_RAW) {
  const report = validateProfessionsRawDataset(professions);

  console.groupCollapsed(
    `Aquelarre | Reporte RAW de profesiones: ${report.total} profesiones, ${report.issues.length} incidencias`
  );

  console.log("Resumen por tipo:", report.counts);

  if (!report.issues.length) {
    console.log("Sin incidencias detectadas.");
  } else {
    for (const issue of report.issues) {
      console.warn(`[${issue.type}] [${issue.professionKey}] ${issue.message}`, issue);
    }
  }

  console.groupEnd();

  return report;
}

export function getProfessionCoverageSummary(professions = PROFESSIONS_RAW) {
  const summary = {
    total: 0,
    bySociety: {},
    bySocialClass: {},
    byKingdom: {},
    bySexRestriction: {
      any: 0,
      maleOnly: 0,
      femaleOnly: 0,
      mixed: 0
    }
  };

  for (const [, prof] of Object.entries(professions)) {
    summary.total += 1;

    for (const society of asArray(prof.society)) {
      summary.bySociety[society] = (summary.bySociety[society] ?? 0) + 1;
    }

    for (const socialClass of asArray(prof.socialClass)) {
      summary.bySocialClass[socialClass] = (summary.bySocialClass[socialClass] ?? 0) + 1;
    }

    for (const kingdom of asArray(prof.kingdoms)) {
      summary.byKingdom[kingdom] = (summary.byKingdom[kingdom] ?? 0) + 1;
    }

    const sex = asArray(prof.sex);
    if (!sex.length) summary.bySexRestriction.any += 1;
    else if (sex.length === 1 && sex[0] === "male") summary.bySexRestriction.maleOnly += 1;
    else if (sex.length === 1 && sex[0] === "female") summary.bySexRestriction.femaleOnly += 1;
    else summary.bySexRestriction.mixed += 1;
  }

  return summary;
}

export function printProfessionCoverageSummary(professions = PROFESSIONS_RAW) {
  const summary = getProfessionCoverageSummary(professions);

  console.groupCollapsed("Aquelarre | Cobertura RAW de profesiones");
  console.log("Total:", summary.total);
  console.log("Por sociedad:", summary.bySociety);
  console.log("Por clase social:", summary.bySocialClass);
  console.log("Por reino:", summary.byKingdom);
  console.log("Restricción por sexo:", summary.bySexRestriction);
  console.groupEnd();

  return summary;
}
