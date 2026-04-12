export const DIFFICULTY_MODS = {
  muy_facil: 40,
  facil: 20,
  normal: 0,
  dificil: -20,
  muy_dificil: -40
};

export function clampPercent(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(200, Math.trunc(n)));
}

function getSpeakerData(actor = null) {
  return actor ? ChatMessage.getSpeaker({ actor }) : {};
}

export async function postSimpleMessage(actor, title, lines = []) {
  const safeLines = Array.isArray(lines) ? lines : [String(lines ?? "")];

  const content = `
    <div class="aquelarre-chat">
      <h3>${title}</h3>
      ${safeLines.map(line => `<p>${line}</p>`).join("")}
    </div>
  `;

  return ChatMessage.create({
    speaker: getSpeakerData(actor),
    content
  });
}

export async function rollFormula(actor, formula = "1d100", label = "Tirada") {
  const roll = await (new Roll(formula)).evaluate({ async: true });

  await roll.toMessage({
    speaker: getSpeakerData(actor),
    flavor: label
  });

  return {
    roll,
    total: Number(roll.total ?? 0),
    formula
  };
}

export async function rollPercent(actor, target = 0, label = "Tirada porcentual") {
  const clampedTarget = clampPercent(target);
  const roll = await (new Roll("1d100")).evaluate({ async: true });
  const result = Number(roll.total ?? 0);

  const critical = result <= 5 && result <= clampedTarget;
  const fumble = result >= 96 && result > clampedTarget;
  const success = result <= clampedTarget;

  await roll.toMessage({
    speaker: getSpeakerData(actor),
    flavor: `${label} (${clampedTarget}%)`
  });

  return {
    roll,
    target: clampedTarget,
    result,
    success,
    critical,
    fumble,
    margin: clampedTarget - result
  };
}

export function getHitLocation(d100) {
  const n = Number(d100 ?? 0);

  if (n <= 0) return "torso";
  if (n <= 10) return "cabeza";
  if (n <= 20) return "brazo_izquierdo";
  if (n <= 30) return "brazo_derecho";
  if (n <= 50) return "torso";
  if (n <= 70) return "abdomen";
  if (n <= 80) return "pierna_izquierda";
  return "pierna_derecha";
}

function getOutcomeRank(rollData) {
  if (!rollData) return 0;
  if (rollData.fumble) return -2;
  if (!rollData.success) return -1;
  if (rollData.critical) return 2;
  return 1;
}

export function compareAttackDefense(attackRoll, defenseRoll = null) {
  if (!attackRoll) {
    return {
      hit: false,
      reason: "No hay tirada de ataque"
    };
  }

  if (attackRoll.fumble) {
    return {
      hit: false,
      reason: "Pifia del atacante"
    };
  }

  if (!attackRoll.success) {
    return {
      hit: false,
      reason: "El ataque falla"
    };
  }

  if (!defenseRoll) {
    return {
      hit: true,
      reason: attackRoll.critical ? "Impacto crítico sin defensa" : "Impacto sin defensa"
    };
  }

  if (defenseRoll.fumble) {
    return {
      hit: true,
      reason: attackRoll.critical ? "Impacto crítico por pifia en defensa" : "La defensa pifia"
    };
  }

  if (!defenseRoll.success) {
    return {
      hit: true,
      reason: attackRoll.critical ? "Impacto crítico; la defensa falla" : "La defensa falla"
    };
  }

  const attackRank = getOutcomeRank(attackRoll);
  const defenseRank = getOutcomeRank(defenseRoll);

  if (attackRank > defenseRank) {
    return {
      hit: true,
      reason: attackRoll.critical ? "El crítico supera la defensa" : "El ataque supera la defensa"
    };
  }

  if (defenseRank > attackRank) {
    return {
      hit: false,
      reason: defenseRoll.critical ? "La defensa crítica anula el ataque" : "La defensa supera el ataque"
    };
  }

  const attackMargin = Number(attackRoll.margin ?? -9999);
  const defenseMargin = Number(defenseRoll.margin ?? -9999);

  if (attackMargin > defenseMargin) {
    return {
      hit: true,
      reason: "El ataque gana por mejor margen"
    };
  }

  return {
    hit: false,
    reason: "La defensa gana por empate o mejor margen"
  };
}

export function applyCriticalDamageBonus(baseDamage) {
  const dmg = Math.max(0, Number(baseDamage ?? 0));
  return Math.max(1, Math.ceil(dmg / 2));
}

export function resolveCriticalEffect(location, finalDamage) {
  const hitLocation = String(location ?? "").trim().toLowerCase().replaceAll("-", "_");
  const damage = Math.max(0, Number(finalDamage ?? 0));

  if (damage <= 0) {
    return {
      location: hitLocation,
      severity: "sin_efecto",
      label: "Sin efecto crítico adicional",
      description: "El impacto crítico no causa daño suficiente para un efecto adicional."
    };
  }

  switch (hitLocation) {
    case "cabeza":
      return {
        location: hitLocation,
        severity: damage >= 8 ? "grave" : "moderado",
        label: damage >= 8 ? "Trauma severo en la cabeza" : "Golpe aturdidor en la cabeza",
        description: damage >= 8
          ? "El objetivo queda incapacitado o en estado extremadamente comprometido."
          : "El objetivo queda desorientado o aturdido brevemente."
      };

    case "brazo_derecho":
    case "brazo_izquierdo":
      return {
        location: hitLocation,
        severity: damage >= 6 ? "grave" : "leve",
        label: damage >= 6 ? "Brazo inutilizado" : "Brazo dolorido",
        description: damage >= 6
          ? "El brazo queda temporalmente inutilizado para acciones exigentes."
          : "El brazo sufre una penalización narrativa o menor."
      };

    case "pierna_derecha":
    case "pierna_izquierda":
      return {
        location: hitLocation,
        severity: damage >= 6 ? "grave" : "leve",
        label: damage >= 6 ? "Pierna inutilizada" : "Pierna resentida",
        description: damage >= 6
          ? "La movilidad del objetivo queda muy reducida."
          : "El objetivo cojea o pierde estabilidad."
      };

    case "abdomen":
      return {
        location: hitLocation,
        severity: damage >= 7 ? "grave" : "moderado",
        label: damage >= 7 ? "Herida profunda en abdomen" : "Golpe doloroso en abdomen",
        description: damage >= 7
          ? "La herida compromete seriamente el combate y la resistencia."
          : "El objetivo queda dolorido y pierde fuelle."
      };

    case "torso":
    default:
      return {
        location: hitLocation,
        severity: damage >= 7 ? "grave" : "moderado",
        label: damage >= 7 ? "Impacto severo en torso" : "Impacto sólido en torso",
        description: damage >= 7
          ? "El golpe compromete seriamente la capacidad de seguir luchando."
          : "El objetivo queda muy tocado, aunque aún operativo."
      };
  }
}
