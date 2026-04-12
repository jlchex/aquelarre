import { AquelarreActor } from "./documents/actor.mjs";
import { AquelarreItem } from "./documents/item.mjs";
import { AquelarreActorSheet } from "./sheets/actor-sheet.mjs";
import { AquelarreItemSheet } from "./sheets/item-sheet.mjs";

import "./hooks/combat-hooks.mjs";

Hooks.once("init", function () {
  console.log("Aquelarre | Inicializando sistema v0.3.0 RAW");

  Handlebars.registerHelper("upperCase", (value) => String(value ?? "").toUpperCase());
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("ne", (a, b) => a !== b);
  Handlebars.registerHelper("lt", (a, b) => Number(a) < Number(b));
  Handlebars.registerHelper("lte", (a, b) => Number(a) <= Number(b));
  Handlebars.registerHelper("gt", (a, b) => Number(a) > Number(b));
  Handlebars.registerHelper("gte", (a, b) => Number(a) >= Number(b));

  CONFIG.Actor.documentClass = AquelarreActor;
  CONFIG.Item.documentClass = AquelarreItem;

  Actors.registerSheet("aquelarre", AquelarreActorSheet, {
    types: ["character", "npc"],
    makeDefault: true,
    label: "Aquelarre"
  });

  Items.registerSheet("aquelarre", AquelarreItemSheet, {
    types: ["weapon", "shield", "armor", "spell", "ritual", "gear"],
    makeDefault: true,
    label: "Aquelarre"
  });
});

