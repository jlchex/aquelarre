export class AquelarreItem extends Item {
  prepareDerivedData() {
    super.prepareDerivedData();

    const system = this.system;

    switch (this.type) {
      case "weapon":
        this._prepareWeaponData(system);
        break;
      case "shield":
        this._prepareShieldData(system);
        break;
      case "armor":
        this._prepareArmorData(system);
        break;
      case "spell":
        this._prepareSpellData(system);
        break;
      case "ritual":
        this._prepareRitualData(system);
        break;
      case "gear":
        this._prepareGearData(system);
        break;
    }
  }

  _prepareWeaponData(system) {
    this._preparePrice(system);

    // Validar y normalizar skill
    if (!system.skill) {
      system.skill = "pelea"; // default
    }

    // Determinar si es ranged o melee basado en kind
    if (system.kind === "ranged") {
      system.isRanged = true;
      system.isMelee = false;
    } else {
      system.isMelee = true;
      system.isRanged = false;
    }

    // Calcular hands si no está definido
    if (system.hands == null) {
      system.hands = 1;
    }

    // Bono de parada por defecto
    if (system.parryBonus == null) {
      system.parryBonus = 0;
    }

    // Tamaño del arma: ligera, media o pesada (determina elegibilidad en melé)
    const VALID_SIZES = ["ligera", "media", "pesada"];
    if (!VALID_SIZES.includes(system.size)) {
      if (Number(system.hands) >= 2) {
        system.size = "pesada";
      } else if (system.skill === "cuchillos" || system.skill === "pelea") {
        system.size = "ligera";
      } else {
        system.size = "media";
      }
    }
  }

  _prepareShieldData(system) {
    this._preparePrice(system);

    // Validar protection
    if (system.protection == null || system.protection < 0) {
      system.protection = 0;
    }

    // Bono defensivo por defecto
    if (system.defenseBonus == null) {
      system.defenseBonus = 0;
    }

    if (system.maxResistance == null || Number(system.maxResistance) < 0) {
      system.maxResistance = 10;
    }

    if (system.resistance == null || Number(system.resistance) < 0) {
      system.resistance = Number(system.maxResistance);
    }

    if (Number(system.resistance) > Number(system.maxResistance)) {
      system.resistance = Number(system.maxResistance);
    }
  }

  _prepareArmorData(system) {
    this._preparePrice(system);

    // Validar protection
    if (system.protection == null || system.protection < 0) {
      system.protection = 0;
    }

    if (system.maxResistance == null || Number(system.maxResistance) < 0) {
      system.maxResistance = 10;
    }

    if (system.resistance == null || Number(system.resistance) < 0) {
      system.resistance = Number(system.maxResistance);
    }

    if (Number(system.resistance) > Number(system.maxResistance)) {
      system.resistance = Number(system.maxResistance);
    }

    // Localización por defecto
    if (!system.location) {
      system.location = "torso";
    }
  }

  _prepareSpellData(system) {
    this._preparePrice(system);

    // Skill por defecto
    if (!system.skill) {
      system.skill = "alquimia";
    }

    // Mod dificultad por defecto
    if (system.difficultyMod == null) {
      system.difficultyMod = 0;
    }
  }

  _prepareRitualData(system) {
    this._preparePrice(system);

    // Skill por defecto
    if (!system.skill) {
      system.skill = "culto";
    }

    // Mod dificultad por defecto
    if (system.difficultyMod == null) {
      system.difficultyMod = 0;
    }
  }

  _prepareGearData(system) {
    this._preparePrice(system);

    // Cantidad por defecto
    if (system.quantity == null || system.quantity < 1) {
      system.quantity = 1;
    }
  }

  _preparePrice(system) {
    if (system.price == null || !Number.isFinite(Number(system.price)) || Number(system.price) < 0) {
      system.price = 0;
    } else {
      system.price = Number(system.price);
    }

    if (!system.currency) {
      system.currency = "mr";
    }
  }

  // Método útil para obtener el nombre de display
  getDisplayName() {
    return this.name;
  }

  // Método para verificar si el item está equipado
  isEquipped() {
    return this.system.equipped === true;
  }

  // Método para equipar/desequipar (puede ser usado por el actor)
  async toggleEquipped() {
    await this.update({ "system.equipped": !this.system.equipped });
  }
}
