Hooks.on("updateCombat", async (combat, changed, options, userId) => {
  // Solo cuando cambia el turno
  if (!("turn" in changed)) return;

  const combatant = combat.combatant;
  if (!combatant) return;

  const actor = combatant.actor;
  if (!actor) return;

  console.log("🔥 TURNO NUEVO:", actor.name);

  // 👉 aplicar efectos
  await applyStartOfTurnEffects(actor);
});

async function applyStartOfTurnEffects(actor) {
  const effects = actor.system.combat?.statusEffects ?? [];

  await applyNegativePvDrain(actor);

  if (!effects.length) return;

  console.log("Aplicando efectos a", actor.name, effects);

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
