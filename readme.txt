Aquelarre para Foundry VTT

Sistema no oficial para Foundry VTT inspirado en Aquelarre.

Estado actual

- Compatibilidad verificada con Foundry VTT 13.351.
- Combate funcional con ataque, defensa, armadura por localización y gasto de acciones.
- Soporte de melé, escudos con desgaste, ataque apuntado y PV negativos.
- Creación de personaje basada en reinos, etnias, clases sociales y profesiones.
- Compendios base de armas, armaduras, escudos, hechizos, rituales, equipo, NPCs y personajes ejemplo.
- Compendios ampliados con precios oficiales y objetos mágicos extraídos de PDFs de referencia.
- Compendio de tablas roleables para creación y localización de impacto.
- Actualización visual de ficha de personaje y journals con nuevo arte de cabecera, footer envejecido y fondos temáticos.

Subsistemas implementados

1. Combate
- Resolución de ataque contra objetivo seleccionado.
- Defensa mediante esquiva, arma o escudo.
- Elección explícita del defensor de si quiere defenderse o no.
- Gasto de acciones de combate para atacante y defensor.
- Desgaste de escudos por resistencia y auto-desequipado al agotarse.
- Ataque apuntado con modificador configurable y localización forzada.
- Daño por localización con absorción de armadura.
- Estados de daño y seguimiento de PV.

2. Items
- Tipos soportados: weapon, shield, armor, spell, ritual, gear.
- Precio y moneda en todos los tipos de item.
- Normalización automática de datos básicos de item.
- Fichas editables para armas, escudos, armaduras, hechizos, rituales y equipo.

3. Contenido
- Compendios de creación: profesiones, reinos, etnias y clases sociales.
- Compendios de juego: armas, armaduras, escudos, hechizos, rituales, equipo.
- Compendio adicional de objetos mágicos.
- Compendios auxiliares de ropa, comida, servicios y equipo variado.
- Compendio de tablas roleables de creación RAW y combate.
- Pack de NPCs y personajes pregenerados.

Compendios incluidos

- Aquelarre - Armas
- Aquelarre - Armaduras
- Aquelarre - Escudos
- Aquelarre - Hechizos
- Aquelarre - Rituales
- Aquelarre - Equipo
- Aquelarre - Objetos Mágicos
- Aquelarre - Ropas y Vestimenta
- Aquelarre - Comida y Alojamiento
- Aquelarre - Servicios Profesionales
- Aquelarre - Equipo Variado
- Aquelarre - Profesiones
- Aquelarre - Reinos
- Aquelarre - Etnias
- Aquelarre - Clases Sociales
- Aquelarre - Tablas Roleables
- Aquelarre - NPCs
- Aquelarre - Personajes Ejemplo

Estructura principal

systems/aquelarre/
├─ system.json
├─ template.json
├─ lang/es.json
├─ module/
│  ├─ aquelarre.mjs
│  ├─ combat/
│  │  └─ rolls.mjs
│  ├─ documents/
│  │  ├─ actor.mjs
│  │  └─ item.mjs
│  └─ sheets/
│     ├─ actor-sheet.mjs
│     └─ item-sheet.mjs
├─ templates/
│  ├─ actor/
│  │  └─ character-sheet.hbs
│  └─ item/
│     └─ item-sheet.hbs
├─ packs/
├─ styles/
└─ docs/

Documentación recomendada

- docs/data-model.md
- docs/naming-conventions.md
- docs/tech-debt.md
- ROADMAP.md
