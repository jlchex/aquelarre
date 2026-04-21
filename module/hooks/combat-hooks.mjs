const processedTurnByCombat = new Map();

Hooks.on("updateCombat", async (combat, changed) => {
  if (!game.user?.isGM) return;

  // Dependiendo de la vía de cambio (siguiente turno, cambio manual o ronda),
  // Foundry puede actualizar turn, round o combatant.
  const turnChanged = Object.prototype.hasOwnProperty.call(changed, "turn");
  const roundChanged = Object.prototype.hasOwnProperty.call(changed, "round");
  const combatantChanged = Object.prototype.hasOwnProperty.call(changed, "combatant");

  if (!turnChanged && !roundChanged && !combatantChanged) return;
  await handleCombatTurnStart(combat);
});

Hooks.on("combatTurn", async (combat) => {
  if (!game.user?.isGM) return;
  await handleCombatTurnStart(combat);
});

Hooks.on("deleteCombat", async (combat) => {
  processedTurnByCombat.delete(combat.id);
});

async function handleCombatTurnStart(combat) {
  if (!combat) return;

  const combatant = combat.combatant;
  if (!combatant) return;

  const actor = combatant.actor;
  if (!actor) return;

  const turnKey = `${combat.round}:${combat.turn}:${combatant.id}`;
  if (processedTurnByCombat.get(combat.id) === turnKey) return;
  processedTurnByCombat.set(combat.id, turnKey);

  // Aplicar efectos de inicio de turno (sangrado, PV negativos, etc.)
  await applyStartOfTurnEffects(actor);

  // Reiniciar acciones del turno según estado del actor.
  // Si está incapacitado/moribundo, el propio actor las dejará a 0.
  if (typeof actor.resetCombatActions === "function") {
    await actor.resetCombatActions();
  }
}

async function applyStartOfTurnEffects(actor) {
  const effects = actor.system.combat?.statusEffects ?? [];

  await applyNegativePvDrain(actor);

  if (!effects.length) return;

  for (const effect of effects) {

    switch (effect.type) {

      case "sangrado":
        await applyBleeding(actor, effect);
        break;

      // 🔥 aquí podrás añadir más
      // case "veneno":
      // case "fuego":

    }
  }
}

async function applyNegativePvDrain(actor) {
  const currentPv = Number(actor.system.secondary?.pv?.value ?? 0);
  if (currentPv >= 0) return;

  const newPv = currentPv - 1;

  await actor.update({
    "system.secondary.pv.value": newPv
  });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <div class="aquelarre-chat bleed">
        <h3>⚠️ Estado crítico</h3>
        <p>${actor.name} está en PV negativos y pierde 1 PV adicional.</p>
        <p>PV: ${currentPv} → ${newPv}</p>
      </div>
    `
  });
}

async function applyBleeding(actor, effect) {
  const damage = 1; // 🔴 luego lo haremos dinámico

  const currentPv = Number(actor.system.secondary?.pv?.value ?? 0);
  const newPv = currentPv - damage;

  await actor.update({
    "system.secondary.pv.value": newPv
  });

  // Mensaje en chat
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <div class="aquelarre-chat bleed">
        <h3>🩸 Sangrado</h3>
        <p>${actor.name} pierde ${damage} PV</p>
        <p>PV: ${currentPv} → ${newPv}</p>
      </div>
    `
  });
}
