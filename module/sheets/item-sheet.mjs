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
    return context;
  }
}
