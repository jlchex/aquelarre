# Aquelarre Foundry Roadmap
Objetivo general

Construir un sistema que pase por estas capas, en este orden:

Base técnica estable
Combate jugable completo
Creación de personaje sólida
Items, profesiones y contenido base
Economía y compendios ampliados
Estilo visual Aquelarre
Journals, aventuras y handouts
Magia, contenido avanzado y expansiones
Pulido, migraciones y distribución

## Actualización reciente (2026-04-12)
- [x] Crear pestaña de `Creación` y mover ahí el bloque `Creación RAW`.
- [x] Reordenar `Resumen` en dos columnas: `Características` y `Secundarias`.
- [x] Ajustar Inventario: botones de cabecera al contenido y quitar botón `Ataque` en Armas.
- [x] Implementar selección de profesión paterna en creación.
- [x] Aplicar bonificadores automáticos por profesión paterna a competencias.
- [x] Añadir metadata mágica en item schema: `school`, `tradition`, `tags`.
- [x] Crear packs de magia `basic` y `advanced`.
- [x] Añadir componentes/requisitos de hechizos y rituales al pack de objetos mágicos.
- [x] Limpiar packs redundantes de magia y duplicados exactos no mágicos.
## Fase 0 — Preparación y control del proyecto
- [x ] Hacer backup o commit del estado actual
- [x ] Crear estructura objetivo de carpetas
- [x ] Mover archivos de código a carpetas lógicas
- [x ] Mover templates, estilos y lang a su sitio definitivo
- [x ] Crear carpetas de assets (`ui`, `parchment`, `letters`) y `fonts`
- [x ] Mover recursos gráficos y fuentes
- [x ] Confirmar rutas en `system.json`
- [x ] Confirmar rutas en `actor-sheet.mjs` e `item-sheet.mjs`
- [x ] Definir convención de nombres internos
- [x ] Separar mentalmente y por carpetas core vs contenido
- [x ] Crear `ROADMAP.md`
- [x ] Crear `tech-debt.md`
- [x ] Arrancar Foundry y verificar que todo sigue funcionando
## Fase 1.1 — Revisar `system.json`
- [x] Confirmar `id`, `title`, `description` y `compatibility`
- [x] Confirmar carga de `module/aquelarre.mjs`
- [x] Confirmar idioma `lang/es.json`
- [x] Confirmar `documentTypes` de Actor e Item
- [x] Añadir carga de estilos:
  - [x] `styles/system.css`
  - [x] `styles/theme-aquelarre.css`
  - [x] `styles/journals.css`
- [x] Revisar campo `authors`
- [x] Revisar o retirar temporalmente `license`
- [x] Verificar que Foundry sigue cargando el sistema sin errores tras el cambio
 ## Fase 1.2 — Ordenar `actor.mjs`
- [x] Revisar imports del archivo
- [x] Eliminar imports sobrantes
- [x] Confirmar helpers puros fuera de la clase:
  - [x] defaults
  - [x] merge helpers
  - [x] normalizadores
  - [x] utilidades puras
- [x] Confirmar métodos del actor dentro de la clase
- [x] Eliminar métodos duplicados
- [x] Eliminar flujo viejo de combate que ya no se usa
- [x] Mantener un único flujo principal de combate con `resolveWeaponAttack()`
- [x] Corregir cálculo de defensa en `resolveWeaponAttack()`
- [x] Mover la tirada de localización para que solo ocurra si hay impacto
- [x] Mover el gasto de acción a un punto lógico dentro de la resolución del ataque
- [x] Dejar `applyDamageToLocation()` como método principal de daño
- [x] Dejar `spendCombatAction()` / `resetCombatActions()` como métodos principales de acciones
- [x] Dejar `getArmorProtectionForLocation()` como método principal de absorción
- [x] Confirmar que `actor.mjs` queda funcional tras la limpieza
## Fase 1.3 — Revisar flujo de datos del Actor (`prepareDerivedData` y `ensureActorDefaults`)
### Revisión de `prepareDerivedData()`
- [x] Confirmar recálculo de skills (`baseValue`, `total`)
- [x] Confirmar recálculo de suerte derivada
- [x] Confirmar recálculo de PV máximos
- [x] Confirmar coherencia RR/IRR
- [x] Confirmar recálculo de `armorTotal`
- [x] Detectar mezcla entre datos derivados y saneamiento estructural
- [x] Anotar deuda técnica:
  - [x] bloques vacíos creados dentro de `prepareDerivedData()`
  - [x] merges completos en cada preparación
  - [x] clamp de `actions.current` dentro de derivadas
## Fase 1.4 — Revisar `template.json` frente al Actor
- [x] Revisar bloque `Actor.character`
- [x] Confirmar coherencia entre `template.json` y `actor.mjs`
- [x] Revisar bloque `secondary`
- [x] Revisar bloque `combat`
- [x] Revisar bloque `skills`
- [x] Revisar bloques `economy`, `inventory`, `magic`
- [x] Revisar `Item.weapon`
- [x] Revisar `Item.shield`
- [x] Revisar `Item.armor`
- [x] Revisar `Item.spell`
- [x] Revisar `Item.ritual`
- [x] Revisar `Item.gear`
- [x] Detectar asimetría entre `Actor.character` y `Actor.npc`
- [x] Confirmar que el schema actual es válido para el estado actual del sistema
- [x] Documentar deuda técnica:
  - [x] Homogeneizar más `npc` con `character` en el futuro
  - [x] Revisar más adelante qué campos deben ser puramente derivados
# Fase 2 — Sistema de combate

## 2.1 — Núcleo de ataque (actor.mjs)
- [x] Revisar `resolveWeaponAttack()`
- [x] Confirmar orden correcto:
  - [x] Tirada de ataque
  - [x] Tirada de defensa
  - [x] Comparación
  - [x] Consumo de acción
  - [x] Tirada de localización SOLO si hay impacto
  - [x] Tirada de daño
  - [x] Aplicación de daño
- [x] Validar uso de:
  - [x] `clampPercent`
  - [x] `DIFFICULTY_MODS`
- [x] Confirmar coherencia entre:
  - [x] `attackModifier`
  - [x] `defenseModifier`
- [x] Verificar críticos:
  - [x] `attackRoll.critical`
  - [x] `applyCriticalDamageBonus()`
- [x] Verificar pifias (aunque no estén explotadas aún)
- [x] Asegurar retorno consistente del método (hit / no hit)
---
## 2.2 — Defensa (actor.mjs)
- [x] Revisar `getDefenseSourceData()`
- [x] Validar modos:
  - [x] skill (esquivar)
  - [x] weapon (parada)
  - [x] shield
- [x] Confirmar:
  - [x] uso de `parryBonus`
  - [x] uso de `defenseBonus`
- [x] Validar fallback correcto si:
  - [x] no hay arma
  - [x] arma no es defensiva
  - [x] no hay escudo
- [x] Revisar `getDefenseBonusFromEquipment()`
- [x] Confirmar coherencia con `resolveWeaponAttack()`
- [x] Unificar la lógica defensiva del ataque con `getDefenseSourceData()`
- [x ] Añadir aviso opcional cuando el defensor tenga un arma no defensiva seleccionada
---
## 2.3 — Daño y armadura
- [x] Revisar `rollWeaponDamage()`
- [x] Confirmar:
  - [x] fórmula correcta (`weapon.system.damage`)
  - [x] aplicación de críticos
- [x] Revisar `applyDamageToLocation()`
- [x] Validar:
  - [x] absorción por armadura
  - [x] cálculo de daño final
  - [x] reducción de PV
- [x] Revisar `getArmorProtectionForLocation()`
- [x] Confirmar soporte para:
  - [x] general
  - [x] torso
  - [x] brazos
  - [x] piernas
- [x] Validar estados:
  - [x] ileso
  - [x] herido
  - [x] incapacitado
  - [x] moribundo
- [x] Ignorar protecciones inválidas o nulas
---
## 2.4 — Acciones de combate
- [x] Implementar `canSpendCombatAction()`
- [x] Implementar `spendCombatAction()`
- [x] Implementar `resetCombatActions()`
- [x] Validar:
  - [x] no gastar si no hay acciones
  - [x] gasto correcto por ataque
  - [x] nunca bajar de 0
- [x] Añadir protección de input (`cost`)
---

## 2.5 — Chat de combate
- [x] Revisar mensajes de:
  - [x] ataque fallido
  - [x] impacto
- [x] Validar contenido:
  - [x] atacante
  - [x] objetivo
  - [x] arma
  - [x] tiradas
  - [x] localización
  - [x] daño
- [ ] Mejorar legibilidad HTML:
  - [ ] clases CSS (`aquelarre-chat`)
- [ ] Unificar estilo de mensajes
- [ ] Evaluar:
  - [ ] separar plantilla de chat (futuro)

---

## 2.6 — Actor Sheet (actor-sheet.mjs)
- [ ] Revisar eventos:
  - [ ] botón de ataque
  - [ ] selección de arma activa
- [ ] Confirmar uso de:
  - [ ] `activeWeaponId`
- [ ] Validar:
  - [ ] selección de objetivo (target)
- [ ] Asegurar:
  - [ ] llamada correcta a `resolveWeaponAttack()`

---

## 2.7 — Character Sheet (character-sheet.hbs)
- [ ] Añadir bloque de combate:
  - [ ] selector de arma equipada
  - [ ] indicador de acciones restantes
  - [ ] botón de ataque
- [ ] Mostrar:
  - [ ] modificadores de ataque
  - [ ] modificadores de defensa
  - [ ] dificultad actual
- [ ] Mejorar UX:
  - [ ] feedback visual (sin acciones, etc.)
- [ ] Validar bindings con `system.combat`

---

## 2.8 — UX y validaciones
- [ ] Mensajes claros para:
  - [ ] sin arma equipada
- [x] sin acciones
- [x] defensa inválida
- [ ] Evitar errores silenciosos
- [ ] Añadir `ui.notifications.warn()` donde falte
- [ ] Confirmar que ningún flujo rompe sin feedback

---

## 2.9 — Testing funcional
- [ ] Caso: ataque normal sin defensa
- [ ] Caso: ataque vs esquivar
- [ ] Caso: ataque vs arma defensiva
- [ ] Caso: ataque vs escudo
- [ ] Caso: crítico
- [ ] Caso: daño reducido a 0
- [ ] Caso: armadura alta
- [ ] Caso: sin acciones
- [ ] Caso: sin arma equipada
- [ ] Caso: objetivo inválido

---

## 2.10 — Limpieza y consistencia
- [ ] Revisar duplicidades en lógica de combate
- [ ] Confirmar naming consistente:
  - [ ] skillKey
  - [ ] defenseSkillKey
- [ ] Revisar normalización:
  - [ ] `normalizeSkillKey()`
- [ ] Verificar coherencia entre:
  - [ ] template.json
  - [ ] actor.mjs
- [ ] Documentar flujo final de combate

---

# Resultado esperado de la Fase 2
- Sistema de combate completamente funcional
- Flujo ataque → defensa → daño estable
- Integración completa con UI
- Feedback claro en chat
- Sin errores silenciosos

# Fase 3 — Contenido y economía

## 3.1 — Compendios base
- [x] Crear compendio de armas
- [x] Crear compendio de armaduras
- [x] Crear compendio de escudos
- [x] Crear compendio de hechizos
- [x] Crear compendio de rituales
- [x] Crear compendio de equipo
- [x] Crear compendios de profesiones, reinos, etnias y clases sociales
- [x] Crear compendios de NPCs y pregenerados

## 3.2 — Economía
- [x] Añadir `price` y `currency` al schema de items
- [x] Mostrar precio y moneda en la ficha de item
- [x] Normalizar precio en `item.mjs`
- [x] Cargar precios oficiales desde fuentes externas cuando existen

## 3.3 — Expansión documental
- [x] Añadir compendio de objetos mágicos
- [x] Añadir compendio de ropas y vestimenta
- [x] Añadir compendio de comida y alojamiento
- [x] Añadir compendio de servicios
- [x] Añadir compendio de equipo variado
- [ ] Revisar item por item frente a fuente canónica
- [ ] Refinar semántica de categorías que hoy entran como `gear`

## 3.4 — Migración y robustez
- [ ] Crear migración explícita para actores e items antiguos
- [ ] Validar importación limpia de todos los compendios en Foundry
- [ ] Añadir estrategia de actualización de packs cuando cambie el schema
