import Card from "./Card.js";

export default class Player {
  constructor(playerData, deckCards = [], mainCardData = null) {
    this.id = playerData.id;
    this.name = playerData.name;
    this.pv = 2000;
    this.hand = [];
    this.deck = deckCards.map((c) => new Card(c));
    this.deckId = playerData.activeDeck || null;
    this.minDeckSize = 20;
    this.maxDeckSize = 60;

    this.acceleratorCounters = 0;

    this.graveyard = [];
    this.ostrac = [];
    this.mainZone = [];
    this.spellZone = [];
    this.field = [];

    this.phase = null;
    this.drawAmount = 1;
    this.maxHandSize = 7;

    this.startingCard = mainCardData ? new Card(mainCardData) : null;
  }

  async drawHand() {
    for (let i = 0; i < 6; i++) {
      if (this.deck.length > 0) {
        this.hand.push(this.deck.shift());
      } else {
        console.log("Taille du deck incorrecte");
        return;
      }
    }
    console.log(`Taille de la main de départ : ${this.hand.length}`);
  }

  async draw() {
    if (this.hand.length < 5) {
      while (this.hand.length < 5) {
        if (this.deck.length === 0) {
          this.pv = 0;
          console.log(`${this.name} n'a plus de cartes à piocher !`);
          return;
        }
        this.hand.push(this.deck.shift());
      }
    } else {
      if (this.deck.length === 0) {
        this.pv = 0;
        console.log(`${this.name} n'a plus de cartes à piocher !`);
        return;
      }
      this.hand.push(this.deck.shift());
    }
    console.log(`${this.name} a pioché. Cartes en main : ${this.hand.length}`);
  }

  useAsAccelerator(cardHandIndex) {
    if (cardHandIndex < 0 || cardHandIndex >= this.hand.length) return false;
    const card = this.hand.splice(cardHandIndex, 1)[0];

    this.deck.push(card);

    this.acceleratorCounters += card.accelerator;
    console.log(
      `${this.name} utilise ${card.name} comme accélérateur. Compteurs : ${this.acceleratorCounters}`,
    );
    return true;
  }

  summonBeing(cardHandIndex) {
    if (cardHandIndex < 0 || cardHandIndex >= this.hand.length) return false;
    const card = this.hand[cardHandIndex];

    if (
      card.type !== "Être" ||
      this.acceleratorCounters < card.cost ||
      this.mainZone.length >= 5
    ) {
      return false;
    }

    this.acceleratorCounters -= card.cost;
    this.hand.splice(cardHandIndex, 1);
    this.mainZone.push(card);
    console.log(
      `${this.name} déploie l'être ${card.name}. Compteurs restants : ${this.acceleratorCounters}`,
    );
    return true;
  }

  playSupport(cardHandIndex) {
    if (cardHandIndex < 0 || cardHandIndex >= this.hand.length) return false;
    const card = this.hand[cardHandIndex];

    if (
      (card.type !== "Soutien" && card.type !== "Sort") ||
      this.acceleratorCounters < card.cost ||
      this.spellZone.length >= 3
    ) {
      return false;
    }

    this.acceleratorCounters -= card.cost;
    this.hand.splice(cardHandIndex, 1);
    this.spellZone.push(card);
    console.log(
      `${this.name} joue le soutien ${card.name}. Compteurs restants : ${this.acceleratorCounters}`,
    );
    return true;
  }

  async takeDamage(damage) {
    this.pv -= damage;
    console.log(`${this.name} a pris ${damage}. PV restants : ${this.pv}`);
  }
}
