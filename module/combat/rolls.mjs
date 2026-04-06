export const DIFFICULTY_MODS = {
  infalible: 60,
  muyfacil: 40,
  facil: 20,
  normal: 0,
  dificil: -20,
  muydificil: -40,
  imposible: -60
};

const RESULT_LABELS = {
  "ataque-supera": "El ataque supera la defensa",
  "ataque-falla": "El ataque falla",
  "pifia-ataque": "Pifia de ataque",
  "critico-ataque": "Crítico de ataque",
  "exito-mayor": "Éxito superior",
  "empate": "Empate"
};


export function clampPercent(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export async function showRoll3D(roll) {
  try {
    if (game.modules.get("dice-so-nice")?.active && game.dice3d?.showForRoll) {
      await game.dice3d.showForRoll(roll, game.user, true);
    }
  } catch (err) {
    console.warn("Aquelarre | Dice So Nice no pudo mostrar la tirada", err);
  }
}


export async function rollHitLocation(actor, label = "Localización") {
  const roll = await (new Roll("1d100")).evaluate();
  await showRoll3D(roll);

  return {
    actor,
    roll,
    total: roll.total,
    location: getHitLocation(roll.total),
    label
  };
}


export async function rollPercent(actor, target, label) {
  const cleanTarget = clampPercent(target);
  const roll = await (new Roll("1d100")).evaluate();
  await showRoll3D(roll);

  const result = roll.total;
  const critical = result <= Math.max(1, Math.floor(cleanTarget / 10));
  const fumble = result >= 100 || (cleanTarget < 100 && result >= 96 && result > cleanTarget);
  const success = result <= cleanTarget && !fumble;

  return { actor, roll, result, target: cleanTarget, success, critical, fumble, label };
}

export async function rollFormula(actor, formula, label) {
  const safeFormula = String(formula || "1d3").trim() || "1d3";
  const roll = await (new Roll(safeFormula)).evaluate();
  await showRoll3D(roll);
  return { actor, roll, total: roll.total, formula: safeFormula, label };
}

export function getHitLocation(d100) {
  const n = Number(d100);
  if (n <= 10) return "cabeza";
  if (n <= 20) return "brazo-izquierdo";
  if (n <= 30) return "brazo-derecho";
  if (n <= 60) return "torso";
  if (n <= 80) return "pierna-izquierda";
  return "pierna-derecha";
}

export function compareAttackDefense(attackRoll, defenseRoll) {
  if (attackRoll.fumble) return { hit: false, reason: "pifia-ataque" };
  if (defenseRoll?.fumble) return { hit: true, reason: "pifia-defensa" };

  if (attackRoll.success && !defenseRoll?.success) return { hit: true, reason: "ataque-supera" };
  if (!attackRoll.success) return { hit: false, reason: "ataque-falla" };

  if (attackRoll.critical && !defenseRoll?.critical) return { hit: true, reason: "critico-supera" };
  if (defenseRoll?.critical && !attackRoll.critical) return { hit: false, reason: "defensa-critica" };

  if (attackRoll.success && defenseRoll?.success) {
    if (attackRoll.result > defenseRoll.result) return { hit: true, reason: "exito-mayor" };
    return { hit: false, reason: "defensa-empata-o-supera" };
  }

  return { hit: false, reason: "sin-impacto" };
}

export function applyCriticalDamageBonus(baseDamage) {
  const dmg = Number(baseDamage || 0);
  return Math.max(1, Math.floor(dmg / 2));
}

export function getFumbleEffect() {
  const table = [
    "Pierdes el equilibrio.",
    "Dejas la guardia abierta.",
    "El arma se te escapa de la línea de ataque.",
    "Necesitas recolocarte antes de volver a atacar."
  ];
  return table[Math.floor(Math.random() * table.length)];
}

export function getCriticalEffect() {
  const table = [
    "Golpe especialmente certero.",
    "Ataque muy bien colocado.",
    "Presionas al enemigo con ventaja.",
    "El impacto atraviesa mejor la defensa."
  ];
  return table[Math.floor(Math.random() * table.length)];
}

export async function postSimpleMessage(actor, title, lines = []) {
  const content = `
    <div class="aquelarre-roll">
      <h3>${title}</h3>
      ${lines.map(line => `<p>${line}</p>`).join("")}
    </div>
  `;
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content
  });
}

export async function postCombatMessage({
  attacker,
  defender,
  weapon,
  attackRoll,
  defenseRoll,
  hit,
  reason,
  location,
  damageRoll,
  armor,
  netDamage,
  remainingPV,
  attackBase,
  attackModifier,
  defenseBase,
  defenseModifier,
  defenseLabel,
  criticalBonus,
  criticalEffect,
  fumbleEffect
}) {
  let content = `
    <div class="aquelarre-roll">
      <h3>Combate: ${attacker.name} vs ${defender.name}</h3>
      <p><strong>Arma:</strong> ${weapon.name}</p>
      <hr/>
      <p><strong>Ataque:</strong> ${attackRoll.result}/${attackRoll.target}
      ${attackRoll.success ? "✅" : "❌"}
      ${attackRoll.critical ? `<p class="critical">🔥 CRÍTICO</p>` : ""}
      ${attackRoll.fumble ? `<p class="fumble">💀 PIFIA</p>` : ""}
      <p><strong>Ataque base:</strong> ${attackBase} | <strong>Modificador:</strong> ${attackModifier >= 0 ? "+" : ""}${attackModifier}</p>
  `;

  if (defenseRoll) {
    content += `
      <p><strong>Defensa (${defenseLabel}):</strong> ${defenseRoll.result}/${defenseRoll.target}
      ${defenseRoll.success ? "✅" : "❌"}
      ${defenseRoll.critical ? `<p class="critical">🔥 CRÍTICO</p>` : ""}
      ${defenseRoll.fumble ? `<p class="fumble">💀 PIFIA</p>` : ""}
      <p><strong>Defensa base:</strong> ${defenseBase} | <strong>Modificador:</strong> ${defenseModifier >= 0 ? "+" : ""}${defenseModifier}</p>
    `;
  }

  content += `<p><strong>Resultado:</strong> ${hit ? "IMPACTA" : "NO IMPACTA"} [${reason}]</p>`;

  if (criticalEffect) {
    content += `<p><strong>Efecto crítico:</strong> ${criticalEffect}</p>`;
  }

  if (fumbleEffect) {
    content += `<p><strong>Efecto pifia:</strong> ${fumbleEffect}</p>`;
  }

  if (hit) {
    content += `
      <p><strong>Localización:</strong> ${location}</p>
      <p><strong>Daño bruto:</strong> ${damageRoll.total}</p>
      <p><strong>Bono crítico:</strong> ${criticalBonus}</p>
      <p><strong>Armadura:</strong> ${armor}</p>
      <p><strong>Daño neto:</strong> ${netDamage}</p>
      <p><strong>PV restantes del defensor:</strong> ${remainingPV}</p>
    `;
  }

  content += `</div>`;

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: attacker }),
    content
  });
}

export async function postAttackFailureMessage({
  attacker,
  target,
  weapon,
  comparison,
  attackRoll,
  defenseRoll
}) {
  const content = `
    <div class="aquelarre-chat failure">
      <h3>Ataque fallido</h3>
      <p><strong>Atacante:</strong> ${attacker.name}</p>
      <p><strong>Objetivo:</strong> ${target.name}</p>
      <p><strong>Arma:</strong> ${weapon.name}</p>
      <p><strong>Tirada de ataque:</strong> ${attackRoll.result} / ${attackRoll.target}</p>
      ${attackRoll.critical && !comparison.hit ? `
  <p class="critical">🔥 CRÍTICO DE ATAQUE (sin efecto)</p>
` : ""}
      ${attackRoll.fumble ? `<p class="fumble">💀 PIFIA DE ATAQUE</p>` : ""}
      ${defenseRoll ? `
  <p><strong>Defensa:</strong> ${defenseRoll.result} / ${defenseRoll.target}</p>
  ${defenseRoll && defenseRoll.critical ? `<p class="critical">🛡️ CRÍTICO DE DEFENSA</p>` : ""}
  ${defenseRoll.fumble ? `<p class="fumble">🛡️💀 PIFIA DE DEFENSA</p>` : ""}
` : ""}
      <p><strong>Resultado:</strong> ${RESULT_LABELS[comparison.reason] ?? comparison.reason}</p>
    </div>
  `;

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: attacker }),
    content
  });
}
export async function postAttackHitMessage({
  attacker,
  target,
  weapon,
  attackRoll,
  defenseRoll,
  hitLocation,
  damageData,
  applied,
  criticalEffect
}) {
  const content = `
   <div class="aquelarre-chat success">
      <h3>Impacto</h3>
      <p><strong>Atacante:</strong> ${attacker.name}</p>
      <p><strong>Objetivo:</strong> ${target.name}</p>
      <p><strong>Arma:</strong> ${weapon.name}</p>
      <p><strong>Tirada de ataque:</strong> ${attackRoll.result} / ${attackRoll.target}</p>
      ${attackRoll.critical ? `<p class="critical">⚔️🔥 CRÍTICO DE ATAQUE</p>` : ""}
      ${attackRoll.fumble ? `<p class="fumble">💀 PIFIA DE ATAQUE</p>` : ""}
      ${defenseRoll ? `
  <p><strong>Defensa:</strong> ${defenseRoll.result} / ${defenseRoll.target}</p>
  ${defenseRoll && defenseRoll.critical ? `<p class="critical">🛡️ CRÍTICO DE DEFENSA</p>` : ""}
  ${defenseRoll.fumble ? `<p class="fumble">🛡️💀 PIFIA DE DEFENSA</p>` : ""}
` : ""}
      <p><strong>Localización:</strong> ${hitLocation}</p>
     ${criticalEffect ? `
  <p class="critical-effect">${criticalEffect.description}</p>
` : ""}
     <p><strong>Daño base:</strong> ${damageData.baseDamage}</p>
      ${damageData.criticalBonus ? `<p class="critical"><strong>Bono crítico:</strong> +${damageData.criticalBonus}</p>` : ""}
      <p><strong>Daño bruto:</strong> ${applied.rawDamage}</p>
      <p><strong>Armadura absorbida:</strong> ${applied.armorAbsorbed}</p>
      <p><strong>Daño final:</strong> ${applied.finalDamage}</p>
      <p><strong>PV:</strong> ${applied.pvBefore} → ${applied.pvAfter}</p>
      <p><strong>Estado:</strong> ${applied.state}</p>
    </div>
  `;

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: attacker }),
    content
  });
}

export function resolveCriticalEffect({ location, damage, pvAfter }) {
  const loc = String(location ?? "").toLowerCase();

  switch (loc) {

    // 💀 CABEZA
    case "cabeza":
      return {
        effect: "muerte-instantanea",
        description: "💀 Golpe letal en la cabeza",
        effects: []
      };

    // 🩸 TORSO → sangrado
    case "torso":
      return {
        effect: "herida-grave",
        description: "🩸 Herida grave en el torso",
        effects: [
          {
            type: "bleeding",
            value: Math.max(1, Math.floor(damage / 2)),
            duration: 3
          }
        ]
      };

    // 🦾 BRAZOS → inutilizados
    case "brazo-derecho":
    case "brazo-izquierdo":
      return {
        effect: "brazo-inutilizado",
        description: "🦾 Brazo inutilizado",
        effects: [
          {
            type: "disabled-limb",
            limb: loc,
            duration: 999 // permanente hasta curación
          }
        ]
      };

    // 🦿 PIERNAS → caída + stun
    case "pierna-derecha":
    case "pierna-izquierda":
      return {
        effect: "pierna-inutilizada",
        description: "🦿 Pierna inutilizada",
        effects: [
          {
            type: "prone",
            duration: 2
          },
          {
            type: "stunned",
            duration: 1
          }
        ]
      };

    // ⚔️ GENÉRICO → pequeño sangrado
    default:
      return {
        effect: "impacto-critico",
        description: "⚔️ Impacto crítico",
        effects: [
          {
            type: "bleeding",
            value: 1,
            duration: 2
          }
        ]
      };
  }
}

