# Technical Debt — Sistema Aquelarre

Este documento recoge la deuda técnica visible tras la ampliación de combate, economía y compendios.

La intención no es resolverla inmediatamente, sino:

- dejarla visible
- evitar reintroducir problemas ya detectados
- priorizar refactors futuros

## Estado general

Actualmente el sistema ya tiene:

- estructura estable
- nomenclatura base definida
- combate ampliado jugable
- creación de personaje utilizable
- compendios y precios integrados

La deuda pendiente ya no es tanto de arranque como de consolidación y migración.

## Prioridad alta

### 1. `ensureActorDefaults()` sigue haciendo `update()`
Actualmente se usa como utilidad de saneamiento y migración ligera, pero sigue escribiendo en el actor.

**Riesgo**
- renders innecesarios
- coste extra
- dependencia accidental desde flujos de UI

**Decisión actual**
- mantenerlo
- no llamarlo desde `getData()`
- usarlo solo en puntos concretos

**Futuro deseable**
- reducir su uso
- dejar `prepareDerivedData()` como cálculo principal
- migrar defaults persistentes con herramientas más específicas

### 2. Falta una migración formal de schema para contenidos antiguos
Se han introducido cambios de schema importantes:

- `leerEscribir` a `leer_y_escribir`
- localizaciones con `_`
- `price` y `currency` en items
- `resistance` y `maxResistance` en escudos
- `resistance` y `maxResistance` en armaduras
- `system.combat.statusEffects` con objetos enriquecidos (`label`, `remainingTurns`, `notes`)
- compendios normalizados al schema actual

**Riesgo**
- actores o items antiguos pueden quedar en formatos incompletos
- contenido importado manualmente puede no ajustarse al modelo canónico

**Decisión actual**
- normalización parcial en runtime o durante la preparación de contenido

**Futuro deseable**
- migración explícita por versión de sistema
- saneamiento automático de compendios legacy

### 3. `actor.mjs` sigue concentrando demasiada lógica
El archivo centraliza combate, creación, progresión y estado temporal.

**Riesgo**
- cambios en un subsistema afectan a otros con demasiada facilidad
- mantenimiento y pruebas más costosos

**Decisión actual**
- mantenerlo centralizado hasta cerrar más validaciones funcionales

**Futuro deseable**
- extraer módulos por dominio
- separar helpers de combate, creación y progresión

### 4. Algunas operaciones de skills recalculan y guardan bloques completos
`increaseSkill()` y `decreaseSkill()` siguen trabajando con copias amplias del bloque `system.skills`.

**Riesgo**
- operaciones más pesadas de lo necesario
- más fácil introducir inconsistencias

**Futuro deseable**
- actualizar solo la skill afectada
- recalcular derivados de forma más localizada

## Prioridad media

### 5. `allowedSkills` y `skillPoints` siguen siendo persistidos
Parte de esa información podría derivarse desde la profesión seleccionada.

**Riesgo**
- divergencia entre profesión y datos guardados

**Decisión actual**
- mantener persistente por simplicidad

**Futuro deseable**
- decidir qué debe seguir persistido y qué debe derivarse desde `professionKey`

### 6. `bio.*` y `creation.*` conviven con duplicidad controlada
La regla actual es correcta:

- `system.creation.*` es la fuente canónica
- `system.bio.*` es presentación o narrativa

**Riesgo**
- que nuevas features lean desde `bio.*` por error

**Futuro deseable**
- reforzar esta regla en nuevas implementaciones

### 7. `fatherProfessionKey` mantiene una nomenclatura menos neutra

**Riesgo**
- convención menos consistente o flexible

**Decisión actual**
- no tocar por ahora para evitar romper creación

**Futuro deseable**
- evaluar migración a `parentProfessionKey` en una migración controlada

### 7.1 Catálogo de profesión paterna embebido en código

Actualmente los bonificadores por profesión paterna se definen en un catálogo interno en `actor.mjs`.

**Riesgo**
- dificultad para ajustar balance sin tocar código
- posibilidad de divergencia con contenido documental

**Decisión actual**
- mantenerlo en código para cerrar la funcionalidad y validar UX

**Futuro deseable**
- mover catálogo a datos versionados (JSON/compendio)
- soportar ajuste de bonos sin cambio de lógica

### 8. `armorTotal` es solo un resumen visual
La protección real se resuelve por localización e items equipados.

**Riesgo**
- usar `armorTotal` como fuente de verdad por error

**Decisión actual**
- mantenerlo como resumen visual

### 9. Estado temporal de combate sigue persistido
Campos como iniciativa o últimos resultados siguen guardándose en el actor.

**Riesgo**
- mezclar estado reciente con modelo permanente

**Decisión actual**
- mantenerlo por utilidad en UI y depuración

### 10. Parte del contenido documental entra como `gear`
Ropa, comida, servicios y muchos objetos mágicos se representan como `gear` por compatibilidad.

**Riesgo**
- pérdida de semántica específica
- necesidad de distinguir categorías por notas o nombre

**Decisión actual**
- priorizar compatibilidad y carga estable de compendios

**Futuro deseable**
- estudiar metadatos o subcategorías auxiliares
- refinar objetos mágicos si pasan a tener mecánicas propias

### 11. Modelo de daño todavía demasiado libre para RAW avanzada
`weapon.system.damage` sigue siendo una fórmula libre y no separa de forma canónica daño base, bonus por Fuerza ni tipo de arma resolutivo.

**Riesgo**
- automatizaciones RAW parciales o aproximadas
- difícil distinguir en reglas de secuelas si el arma es cortante, perforante o contundente cuando el item no lo expresa con suficiente precisión

**Decisión actual**
- mantener la fórmula libre porque ya sostiene el combate jugable actual

**Futuro deseable**
- separar daño base y bonus variable
- reforzar tipado de arma para reglas de secuelas y columna

### 12. Secuelas no numéricas siguen sólo parcialmente automatizadas
Las secuelas que reducen características numéricas ya modifican el actor. Las no numéricas o globales todavía no siempre alteran todas las competencias o restricciones derivadas que implican las reglas RAW.

**Riesgo**
- divergencia entre chat, hoja y efecto mecánico real
- necesidad de arbitraje manual en mesa para casos como ceguera, sordera, manquedad o restricciones amplias de competencias

**Decisión actual**
- representar parte de estas secuelas mediante estados, notas o texto descriptivo

**Futuro deseable**
- modelar defectos permanentes y penalizadores globales reutilizables
- aplicar efectos sistémicos a competencias relacionadas

## Prioridad baja

### 13. `actor-sheet.mjs` todavía tiene margen de limpieza
La sheet es funcional, pero aún puede separarse mejor entre wiring y construcción de contexto.

### 14. Validación documental incompleta de compendios
Los datos de PDFs ya están cargados, pero falta una revisión canónica item por item dentro del sistema.

**Riesgo**
- precios correctos con descripciones todavía resumidas
- algunos objetos mágicos sin modelado mecánico detallado

### 15. Limpieza de redundancia hecha en compendios de magia

Se eliminaron duplicados exactos entre packs de magia y duplicados puntuales no mágicos.

**Estado actual**
- packs mágicos activos: `magic-basic`, `magic-advanced`, `magic-items`
- retirados: `spells`, `rituals`, `magic-compendium`
- duplicado no mágico limpiado: `Saco` en `miscellaneous`

**Riesgo residual**
- aún pueden existir duplicados semánticos (nombres parecidos, mismo uso con etiqueta distinta)

## No tocar todavía

Estos puntos existen, pero no deben priorizarse antes de cerrar migraciones y validación funcional:

- reestructurar todo el modelo de items
- convertir profesiones en item type
- rehacer magia completa
- sacar todos los derivados fuera de `template.json`
- rediseñar toda la hoja
- mover toda la lógica a varios archivos

## Criterio para pagar deuda técnica

Una deuda técnica debe atacarse cuando:

- ya provoca errores reales
- bloquea una feature del siguiente sprint
- multiplica el coste de mantenimiento
- obliga a duplicar lógica

No debe atacarse solo porque sería más bonito.
