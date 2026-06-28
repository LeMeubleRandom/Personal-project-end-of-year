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
    this.mainZone = Array(5).fill(null);
    this.spellZone = Array(3).fill(null);
    this.field = [];

    this.phase = null;
    this.drawAmount = 1;
    this.maxHandSize = 7;

    this.startingCard = mainCardData ? new Card(mainCardData) : null;
    this.surrend = false;
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
    console.log(`${this.name} a mélangé son deck.`);
  }

  async drawHand() {
    for (let i = 0; i < 4; i++) {
      if (this.deck.length > 0) {
        this.hand.push(this.deck.shift());
      } else {
        console.log("Taille du deck incorrecte");
        return;
      }
    }
    console.log(`Taille de la main de départ : ${this.hand.length}`);
  }

  async drawOne() {
    if (this.deck.length === 0) {
      this.pv = 0;
      console.log(`${this.name} n'a plus de cartes à piocher !`);
      return;
    }
    this.hand.push(this.deck.shift());
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

    const activeBeings = this.mainZone.filter((c) => c !== null);
    if (
      card.type !== "Être" ||
      this.acceleratorCounters < card.cost ||
      activeBeings.length >= 5
    ) {
      return false;
    }

    const searchOrder = [2, 1, 3, 0, 4];
    let targetSlot = -1;
    for (const i of searchOrder) {
      if (this.mainZone[i] === null) {
        targetSlot = i;
        break;
      }
    }

    if (targetSlot === -1) return false;

    this.acceleratorCounters -= card.cost;
    this.hand.splice(cardHandIndex, 1);
    this.mainZone[targetSlot] = card;
    console.log(
      `${this.name} déploie l'être ${card.name}. Compteurs restants : ${this.acceleratorCounters}`,
    );
    return true;
  }

  playSupport(cardHandIndex) {
    if (cardHandIndex < 0 || cardHandIndex >= this.hand.length) return false;
    const card = this.hand[cardHandIndex];

    const activeSpells = this.spellZone.filter((c) => c !== null);
    if (
      (card.type !== "Soutien" && card.type !== "Sort") ||
      this.acceleratorCounters < card.cost ||
      activeSpells.length >= 3
    ) {
      return false;
    }

    const searchOrder = [1, 0, 2];
    let targetSlot = -1;
    for (const i of searchOrder) {
      if (this.spellZone[i] === null) {
        targetSlot = i;
        break;
      }
    }

    if (targetSlot === -1) return false;

    this.acceleratorCounters -= card.cost;
    this.hand.splice(cardHandIndex, 1);
    this.spellZone[targetSlot] = card;
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
