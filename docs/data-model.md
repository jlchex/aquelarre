# Data Model — Persistente vs Derivado

Este documento describe el modelo vigente tras la ampliación de combate, economía y compendios.

## Persistente

Se guarda en actor o item y forma parte del estado real.

- `system.creation.*`
- `system.creation.fatherProfessionKey`
- `system.bio.*`
- `system.characteristics.*.value`
- `system.skills.*.invested`
- `system.secondary.luckCurrent.value`
- `system.secondary.temperance.value`
- `system.secondary.rr.value`
- `system.secondary.irr.value`
- `system.secondary.pf.value`
- `system.secondary.pc.value`
- `system.secondary.pv.value`
- `system.economy.*`
- `system.inventory.*`
- `system.magic.*`
- `system.combat.activeWeaponId`
- `system.combat.defenseMode`
- `system.combat.defenseSkill`
- `system.combat.defenseWeaponId`
- `system.combat.defenseShieldId`
- `system.combat.actions.current`
- `system.combat.attackModifier`
- `system.combat.defenseModifier`
- `system.combat.difficulty`
- `system.combat.meleeMode`
- `system.combat.aimLocation`
- `system.combat.aimModifier`
- `system.combat.statusEffects`

Campos persistentes de item:

- `item.system.price`
- `item.system.currency`
- `item.system.equipped`
- `weapon.system.skill`
- `weapon.system.damage`
- `weapon.system.range`
- `weapon.system.hands`
- `weapon.system.kind`
- `weapon.system.size`
- `weapon.system.defensive`
- `weapon.system.parryBonus`
- `weapon.system.notes`
- `shield.system.skill`
- `shield.system.protection`
- `shield.system.resistance`
- `shield.system.maxResistance`
- `shield.system.defenseBonus`
- `shield.system.notes`
- `armor.system.protection`
- `armor.system.location`
- `armor.system.resistance`
- `armor.system.maxResistance`
- `armor.system.notes`
- `spell.system.skill`
- `spell.system.cost`
- `spell.system.difficultyMod`
- `spell.system.effect`
- `spell.system.components`
- `spell.system.school`
- `spell.system.tradition`
- `spell.system.tags`
- `spell.system.notes`
- `ritual.system.skill`
- `ritual.system.cost`
- `ritual.system.difficultyMod`
- `ritual.system.effect`
- `ritual.system.components`
- `ritual.system.requirements`
- `ritual.system.school`
- `ritual.system.tradition`
- `ritual.system.tags`
- `ritual.system.notes`
- `gear.system.quantity`
- `gear.system.notes`

## Derivado

Se recalcula en `prepareDerivedData()` y no debe tratarse como fuente de verdad.

- `system.skills.*.baseValue`
- `system.skills.*.fatherBonus`
- `system.skills.*.total`
- `system.secondary.luck.value`
- `system.secondary.pv.max`
- `system.combat.actions.max`
- `system.combat.armorTotal`
- estado RAW de salud derivado desde PV actuales y máximos
- `weapon.system.isRanged`
- `weapon.system.isMelee`

## Temporal persistido

Se guarda, pero representa resultado reciente o estado auxiliar.

- `system.combat.initiative`
- `system.combat.lastFumble`
- `system.combat.lastCritical`
- `system.combat.lastHitLocation`
- `system.combat.lastArmorAbsorbed`
- `system.combat.lastRawDamage`
- `system.combat.lastFinalDamage`

## Status effects de combate

`system.combat.statusEffects` se persiste como array de objetos simples.

Campos usados actualmente:

- `type`
- `location`
- `label`
- `remainingTurns`
- `notes`

Tipos activos relevantes:

- `herido`
- `malherido`
- `inconsciente`
- `muerto`
- `aturdido`
- `brazo_inutilizado`
- `pierna_inutilizada`
- `incapacitado_temporal`
- `inconsciente_temporal`
- `corazon_danado`

Los estados RAW de salud no se guardan en un campo independiente: se recalculan desde PV, pero se reflejan también en `statusEffects` para UI y trazabilidad del combate.

## Regla

Si un valor puede reconstruirse a partir de characteristics, skills o items equipados, debe considerarse derivado.

## Item schema canónico

Todos los compendios y documentos nuevos deben ajustarse a este modelo:

- Tipo real en raíz: `type`
- Datos de sistema en `system`
- Identificador en `_id`

Ejemplo resumido de arma:

```json
{
  "_id": "alfanje",
  "name": "Alfanje",
  "type": "weapon",
  "system": {
    "skill": "espadas",
    "damage": "1d10",
    "price": 138,
    "currency": "mr",
    "hands": 1,
    "kind": "melee",
    "size": "media"
  }
}
```

Ejemplo resumido de armadura:

```json
{
  "_id": "loriga",
  "name": "Loriga",
  "type": "armor",
  "system": {
    "protection": 4,
    "location": "torso",
    "resistance": 12,
    "maxResistance": 12,
    "price": 250,
    "currency": "mr"
  }
}
```

## Notas sobre compendios

- Los archivos versionados del sistema son `packs/*.db`.
- Las carpetas `packs/<nombre>/` son bases locales generadas por Foundry y no forman parte del contenido versionado.
- El contenido importado desde PDFs debe normalizarse a este schema antes de darse por válido.

Estado actual de compendios de magia:

- `packs/aquelarre-magic-basic.db`
- `packs/aquelarre-magic-advanced.db`
- `packs/aquelarre-magic-items.db`

Compendios retirados por redundancia:

- `packs/aquelarre-spells.db`
- `packs/aquelarre-rituals.db`
- `packs/aquelarre-magic-compendium.db`
