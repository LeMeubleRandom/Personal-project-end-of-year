export default class Card {
  constructor(dbCard) {
    this.id = dbCard.id;
    this.name = dbCard.name;
    this.faction = dbCard.faction;
    this.type = dbCard.type;
    this.atk = dbCard.atk;

    this.pv = dbCard.PV;
    this.currentPv = dbCard.PV;

    this.effect = dbCard.effect;
    this.cost = dbCard.cost;
    this.accelerator = dbCard.accelerator;
    this.art = dbCard.art;
    this.hasAttacked = false;
  }
}
