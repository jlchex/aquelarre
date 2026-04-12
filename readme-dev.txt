Notas de desarrollo

Reglas rápidas

- Mantener `system.*` en camelCase.
- Mantener keys de localización y datasets en snake_case.
- No introducir nuevos tipos de item sin necesidad real.
- No usar `bio.*` como fuente de verdad para lógica de creación.
- Tratar los compendios `.db` como contenido versionado.
- Ignorar las carpetas internas que Foundry genera dentro de `packs/`.

Tipos de item activos

- weapon
- shield
- armor
- spell
- ritual
- gear

Compendios de magia activos

- `packs/aquelarre-magic-basic.db`
- `packs/aquelarre-magic-advanced.db`
- `packs/aquelarre-magic-items.db`

Compendio de tablas roleables

- `packs/aquelarre-rolltables.db`
- Incluye tablas RAW de creación (reino, etnia, clase social, profesión paterna).
- Incluye tabla de localización de impacto y variantes por reino.

Compendios retirados por redundancia

- `packs/aquelarre-spells.db`
- `packs/aquelarre-rituals.db`
- `packs/aquelarre-magic-compendium.db`

Campos de combate relevantes

- system.combat.activeWeaponId
- system.combat.defenseMode
- system.combat.defenseSkill
- system.combat.defenseWeaponId
- system.combat.defenseShieldId
- system.combat.actions.current
- system.combat.attackModifier
- system.combat.defenseModifier
- system.combat.difficulty
- system.combat.meleeMode
- system.combat.aimLocation
- system.combat.aimModifier

Economía e items

- Todos los items soportados deben usar `system.price` y `system.currency`.
- Escudos usan `system.resistance` y `system.maxResistance`.
- Las entradas importadas de fuentes externas deben normalizarse al schema real del sistema.

Compendios mantenidos en Git

- `packs/*.db` sí se versiona.
- `packs/*/` no se versiona.

Notas de UI recientes

- La ficha de personaje usa decoración superior con `assets/ui/cenefa.png`.
- El footer visual de la ficha usa `assets/ui/manchastinta.png` con transparencia real.
- Journals usan `assets/ui/background.png` como fondo principal.

Antes de tocar lógica o contenido

- Revisar `docs/naming-conventions.md`.
- Revisar `docs/data-model.md`.
- Revisar `docs/tech-debt.md`.
- Revisar `ROADMAP.md`.

Deuda técnica activa

- `actor.mjs` sigue concentrando demasiada lógica.
- Falta migración formal de esquema para contenido y actores antiguos.
- Los compendios importados desde PDFs siguen necesitando una pasada de validación semántica completa.
- Parte del contenido adicional se ha normalizado como `gear` para compatibilidad y todavía puede refinarse.

Creación de personaje (estado actual)

- `system.creation.fatherProfessionKey` se usa para aplicar bonificadores automáticos a competencias.
- El texto de `system.bio.fatherProfession` se mantiene como presentación y se sincroniza desde la selección canónica.
