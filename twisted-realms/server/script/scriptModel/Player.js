export default class Player {
  constructor(playerData) {
    this.id = playerData.id;
    this.name = playerData.name;
    this.pv = 2000;
    this.hand = [];
    this.deck = [];
    this.deckId = null;
    this.minDeckSize = 20;
    this.maxDeckSize = 60;
    this.accelerator = 0;
    this.graveyard = [];
    this.ostrac = [];
    this.mainZone = [];
    this.spellZone = [];
    this.field = [];
    this.phase = null;
    this.drawAmount = 1;
    this.maxHandSize = 7;
  }

  async drawHand() {
    for (let i = 0; i < 6; i++) {
      if (this.deck.length > 0) {
        const drawnCard = this.deck.shift();
        this.hand.push(drawnCard);
      } else {
        console.log("taille du deck incorrecte");
        return;
      }
    }
    console.log(`taille de la main de départ : ${this.hand.length}`);
  }

  async draw() {
    for (let i = 0; i < this.drawAmount; i++) {
      if (this.deck.length > 0) {
        const drawnCard = this.deck.shift();
        this.hand.push(drawnCard);
      } else {
        console.log(`plus de carte dans le deck`);
      }
    }
    console.log(`${this.name} a pioché. Cartes en main : ${this.hand.length}`);
  }

  async takeDamage(damage) {
    this.pv -= damage;
    console.log(`${this.name} a pris ${damage}`);
  }
}
