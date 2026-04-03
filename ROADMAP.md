# Aquelarre Foundry Roadmap
Objetivo general

Construir un sistema que pase por estas capas, en este orden:

Base técnica estable
Combate jugable completo
Creación de personaje sólida
Items, profesiones y contenido base
Estilo visual Aquelarre
Journals, aventuras y handouts
Magia, contenido avanzado y expansiones
Pulido, migraciones y distribución
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
- [ ] Revisar responsabilidades de `prepareDerivedData()`:
  - [ ] Confirmar que solo calcula datos derivados (no persistentes)
  - [ ] Verificar cálculo de características secundarias (suerte, PV, RR/IRR)
  - [ ] Verificar recalculo de skills (base + invested = total)
  - [ ] Revisar cálculo de armadura total
  - [ ] Detectar posibles efectos secundarios no deseados

- [ ] Revisar responsabilidades de `ensureActorDefaults()`:
  - [ ] Confirmar que solo normaliza datos persistentes
  - [ ] Revisar uso de `update()` (evitar llamadas innecesarias)
  - [ ] Detectar posibles bucles de render o updates redundantes
  - [ ] Validar que no pisa datos del usuario inesperadamente

- [ ] Separación de responsabilidades:
  - [ ] Asegurar que `prepareDerivedData()` no hace updates
  - [ ] Asegurar que `ensureActorDefaults()` no recalcula lógica de juego innecesaria
  - [ ] Identificar lógica duplicada entre ambos métodos

- [ ] Performance y estabilidad:
  - [ ] Detectar cálculos repetidos en cada render
  - [ ] Evaluar si algún cálculo debería cachearse o simplificarse
  - [ ] Revisar impacto en actores con muchos items

- [ ] Definir reglas claras para el sistema:
  - [ ] Qué datos son fuente de verdad (persistidos)
  - [ ] Qué datos son derivados (calculados en runtime)
  - [ ] Cuándo se debe llamar a `ensureActorDefaults()`

- [ ] Documentar deuda técnica:
  - [ ] Marcar posibles refactors futuros (sin implementar aún)
  - [ ] Anotar zonas sensibles del código (alto riesgo de bugs)
