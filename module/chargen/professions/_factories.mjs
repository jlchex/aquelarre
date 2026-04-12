function clone(data) {
  return foundry.utils.deepClone(data);
}

export function weapon({
  name,
  skill,
  damage = "1d6",
  kind = "melee",
  hands = 1,
  range = "",
  equipped = true,
  defensive = false,
  parryBonus = 0,
  notes = ""
}) {
  return {
    name,
    type: "weapon",
    system: {
      skill,
      damage,
      kind,
      hands,
      range,
      equipped,
      defensive,
      parryBonus,
      notes
    }
  };
}

export function shield({
  name,
  protection = 1,
  equipped = true,
  defenseBonus = 5,
  notes = ""
}) {
  return {
    name,
    type: "shield",
    system: {
      skill: "escudos",
      protection,
      equipped,
      defenseBonus,
      notes
    }
  };
}

export function armor({
  name,
  protection = 1,
  location = "general",
  equipped = true,
  notes = ""
}) {
  return {
    name,
    type: "armor",
    system: {
      protection,
      location,
      equipped,
      notes
    }
  };
}

export function gear({
  name,
  quantity = 1,
  equipped = false,
  notes = ""
}) {
  return {
    name,
    type: "gear",
    system: {
      quantity,
      equipped,
      notes
    }
  };
}

export function spell({
  name,
  skill = "alquimia",
  cost = "1 preparación",
  difficultyMod = 0,
  effect = "",
  components = "",
  notes = ""
}) {
  return {
    name,
    type: "spell",
    system: {
      skill,
      cost,
      difficultyMod,
      effect,
      components,
      notes
    }
  };
}

export function ritual({
  name,
  skill = "culto",
  cost = "Oración",
  difficultyMod = 0,
  effect = "",
  requirements = "",
  notes = ""
}) {
  return {
    name,
    type: "ritual",
    system: {
      skill,
      cost,
      difficultyMod,
      effect,
      requirements,
      notes
    }
  };
}

export function profession(key, data = {}) {
  return {
    [key]: {
      label: data.label ?? key,
      society: Array.isArray(data.society) ? [...data.society] : [],
      socialClass: Array.isArray(data.socialClass) ? [...data.socialClass] : [],
      ethnicities: Array.isArray(data.ethnicities) ? [...data.ethnicities] : [],
      kingdoms: Array.isArray(data.kingdoms) ? [...data.kingdoms] : [],
      sex: Array.isArray(data.sex) ? [...data.sex] : [],
      minStats: clone(data.minStats ?? {}),
      skillPoints: Number(data.skillPoints ?? 0),
      allowedSkills: Array.isArray(data.allowedSkills) ? [...data.allowedSkills] : [],
      equipment: clone(data.equipment ?? []),
      money: data.money ?? "",
      source: clone(data.source ?? {
        book: "raw_local",
        note: "Adaptación Foundry"
      })
    }
  };
}
