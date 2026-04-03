claves internas JS / JSON

Usa camelCase cuando ya lo tienes así:

leerEscribir
activeWeaponId
lastRawDamage
claves de skills “simples”

Mantén una sola forma y no mezcles:

espadas
escudos
esquivar
leerEscribir
localizaciones de impacto

Déjalas cerradas y estables:

cabeza
brazo-izquierdo
brazo-derecho
torso
pierna-izquierda
pierna-derecha
general
brazos
piernas
tipos de item

No renombres los actuales salvo necesidad fuerte:

weapon
shield
armor
spell
ritual
gear

Tu sistema ya usa estos tipos oficialmente.
#############deuda técnica actual recomendada######################
ensureActorDefaults() llamado desde getData() del sheet
prepareDerivedData() muy grande
defaults duplicados entre template.json y helpers de actor
chat de combate aún mejorable
capitulares con fondo incorrecto
item logic todavía muy básica
falta migración formal de cambios de esquema
professions/content aún mezclados con lógica del sistema
