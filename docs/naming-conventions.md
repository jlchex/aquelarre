# Naming Conventions — Sistema Aquelarre

Este documento fija los nombres canónicos del sistema y evita introducir variantes nuevas.

## Reglas globales

| Categoría | Convención |
| --- | --- |
| Campos JS y `system.*` | `camelCase` |
| Keys RAW de datasets | `snake_case` |
| Tipos de item | inglés, minúscula, singular |
| Labels visibles | español |

## No hacer

- No mezclar `camelCase`, `snake_case` y labels visibles para la misma key.
- No usar espacios en keys internas.
- No usar etiquetas visibles como identificadores.
- No introducir variantes nuevas de localizaciones, skills o profesiones.

## Actor data

Usar siempre `camelCase` en `system.*`.

Ejemplos canónicos:

- `system.combat.activeWeaponId`
- `system.combat.defenseShieldId`
- `system.combat.aimLocation`
- `system.combat.aimModifier`
- `system.creation.professionKey`
- `system.secondary.luckCurrent`

## Skills

Las skills del sistema se mantienen en español y en `snake_case` cuando llevan varias palabras.

Ejemplos canónicos:

- `espadas`
- `escudos`
- `esquivar`
- `leer_y_escribir`
- `alquimia`
- `culto`

## Localizaciones de impacto

Canon actual:

- `cabeza`
- `torso`
- `abdomen`
- `brazo_izquierdo`
- `brazo_derecho`
- `pierna_izquierda`
- `pierna_derecha`
- `general`
- `brazos`
- `piernas`

No reintroducir variantes antiguas con guion como `brazo-izquierdo`.

## Tipos de item

Tipos activos y soportados por el sistema:

- `weapon`
- `shield`
- `armor`
- `spell`
- `ritual`
- `gear`

Aunque algunos compendios importados representen ropa, comida o servicios, para el sistema siguen entrando como `gear` salvo que exista una razón funcional para crear otro tipo.

## Creación de personaje

Campos canónicos:

- `system.creation.kingdom`
- `system.creation.ethnicityKey`
- `system.creation.socialClassKey`
- `system.creation.professionKey`
- `system.creation.fatherProfessionKey`
- `system.creation.allowedSkills`
- `system.creation.skillPoints`

## Profesiones y datasets RAW

Mantener keys estables en `snake_case`.

Ejemplos:

- `barbero_cirujano`
- `maestro_de_armas`
- `alta_nobleza`

Separación obligatoria:

- datos RAW
- lógica de sistema
- presentación en templates

## Fuente canónica frente a presentación

- `system.creation.*` es la fuente canónica para lógica de creación.
- `system.bio.*` es presentación, resumen o narrativa.

La lógica no debe depender de `system.bio.*` si existe el equivalente en `system.creation.*`.
