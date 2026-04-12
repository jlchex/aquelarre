export class AquelarreItemSheet extends foundry.appv1.sheets.ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["aquelarre", "sheet", "item"],
      width: 540,
      height: 520
    });
  }

  get template() {
    return "systems/aquelarre/templates/item/item-sheet.hbs";
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    context.system = this.item.system;

    // Añadir datos derivados para display
    context.isEquipped = this.item.isEquipped();
    context.displayName = this.item.getDisplayName();

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Botón para toggle equipado
    html.find('[data-action="toggle-equipped"]').on("click", this._onToggleEquipped.bind(this));
  }

  async _onToggleEquipped(event) {
    event.preventDefault();
    await this.item.toggleEquipped();
    this.render();
  }
}
