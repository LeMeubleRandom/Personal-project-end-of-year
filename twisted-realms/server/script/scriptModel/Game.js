import Player from "./Player.js";
import CardModel from "../../model/Card.js";
import User from "../../model/User.js";

export default class Game {
  constructor(gameId, player1Data, player2Data, lobbyData = {}) {
    this.gameId = gameId;
    this.player1Data = player1Data;
    this.player2Data = player2Data;

    this.players = {
      p1: new Player(player1Data),
      p2: new Player(player2Data),
    };

    this.createDate = lobbyData.createDate || new Date();
    this.isPrivate = lobbyData.isPrivate || 0;
    this.adminId = lobbyData.adminId || (player1Data ? player1Data.id : null);
    this.isStarted = lobbyData.isStarted || 0;

    this.gameState = "Starting";
    this.playerState = null;

    this.isRunning = false;
    this.timer = 0;
    this.isOver = false;
    this.playerTurn = null;
    this.phase = null;
    this.nextPhase = null;
    this.turn = 0;
    this.isFirstTurn = false;
    this.canAttack = false;
    this.canSummon = false;
    this.canSpell = false;

    this.history = [];
  }



  async start() {
    if (this.gameState !== "Starting") return;

    const p1Decks = await User.findDecksByUserId(this.players.p1.id);
    const p1Deck =
      p1Decks.find((d) => d.id === this.players.p1.deckId) || p1Decks[0];
    
    let p1CardList = [];
    if (p1Deck && p1Deck.cardList) {
      p1CardList = typeof p1Deck.cardList === "string"
        ? JSON.parse(p1Deck.cardList)
        : p1Deck.cardList;
    }

    const p1Cards = p1Deck
      ? await CardModel.getCardsByDeck(p1CardList)
      : [];
    const p1MainCard =
      p1Deck && p1Deck.mainCard
        ? (await CardModel.getCardsByDeck([p1Deck.mainCard]))[0]
        : null;

    const p2Decks = await User.findDecksByUserId(this.players.p2.id);
    const p2Deck =
      p2Decks.find((d) => d.id === this.players.p2.deckId) || p2Decks[0];

    let p2CardList = [];
    if (p2Deck && p2Deck.cardList) {
      p2CardList = typeof p2Deck.cardList === "string"
        ? JSON.parse(p2Deck.cardList)
        : p2Deck.cardList;
    }

    const p2Cards = p2Deck
      ? await CardModel.getCardsByDeck(p2CardList)
      : [];
    const p2MainCard =
      p2Deck && p2Deck.mainCard
        ? (await CardModel.getCardsByDeck([p2Deck.mainCard]))[0]
        : null;

    this.players.p1 = new Player(this.player1Data, p1Cards, p1MainCard);
    this.players.p2 = new Player(this.player2Data, p2Cards, p2MainCard);



    this.gameState = "Playing";
    this.isStarted = 1;
    this.isRunning = true;
    await this.players.p1.drawHand();
    await this.players.p2.drawHand();
    this.playerTurn = Math.random() < 0.5 ? "p1" : "p2";
    this.isFirstTurn = true;

    console.log(`${this.players[this.playerTurn].name} commence`);

    await this.drawPhase();
  }

  async rockPaperScissors() {}

  async drawPhase() {
    this.turn++;

    if (!this.isFirstTurn)
      this.playerTurn = this.playerTurn === "p1" ? "p2" : "p1";
    this.phase = "DrawPhase";
    this.nextPhase = "MainPhase1";
    await this.players[this.playerTurn].draw();
    await this.nextTurnPhase("MainPhase1");
  }

  async mainPhase() {
    this.phase = "MainPhase1";
    if (!this.isFirstTurn) this.nextPhase = "BattlePhase";
    else this.nextPhase = "EndPhase";
    this.canSpell = true;
    this.canSummon = true;
  }

  async battlePhase() {
    this.phase = "BattlePhase";
    this.nextPhase = "EndPhase";
    this.canAttack = true;
    this.players[this.playerTurn].mainZone.forEach(
      (c) => (c.hasAttacked = false),
    );
  }

  async resolveAttack(attackerIndex, targetIndex) {
    if (this.phase !== "BattlePhase") return;

    const attacker = this.players[this.playerTurn];
    const opponent = this.players[this.playerTurn === "p1" ? "p2" : "p1"];

    const attackingCard = attacker.mainZone[attackerIndex];
    if (!attackingCard || attackingCard.hasAttacked) return;

    if (targetIndex === null || targetIndex === undefined) {
      console.log(
        `${attackingCard.name} attaque directement ${opponent.name} !`,
      );
      await opponent.takeDamage(attackingCard.atk);
    } else {
      const defendingCard = opponent.mainZone[targetIndex];
      if (!defendingCard) return;

      console.log(
        `${attackingCard.name} (ATK: ${attackingCard.atk}) attaque ${defendingCard.name} (ATK/PV: ${defendingCard.atk}/${defendingCard.currentPv})`,
      );

      if (attackingCard.atk > defendingCard.currentPv) {
        opponent.mainZone.splice(targetIndex, 1);
        opponent.graveyard.push(defendingCard);
        console.log(`${defendingCard.name} est détruite.`);
      } else if (attackingCard.atk < defendingCard.currentPv) {
        attacker.mainZone.splice(attackerIndex, 1);
        attacker.graveyard.push(attackingCard);
        console.log(`${attackingCard.name} s'écrase et est détruite.`);
      } else {
        attacker.mainZone.splice(attackerIndex, 1);
        opponent.mainZone.splice(targetIndex, 1);
        attacker.graveyard.push(attackingCard);
        opponent.graveyard.push(defendingCard);
        console.log("Les deux créatures s'entretuent !");
      }
    }
    attackingCard.hasAttacked = true;
  }

  async endPhase() {
    this.phase = "EndPhase";
    this.nextPhase = "DrawPhase";

    const handSize = this.players[this.playerTurn].hand.length;
    const maxHandSize = this.players[this.playerTurn].maxHandSize;

    if (handSize > maxHandSize) {
      console.log(
        "Votre main dépasse la taille autorisée, veuillez en envoyer au cimetière",
      );
    }

    if (this.isFirstTurn) this.isFirstTurn = false;
    await this.nextTurnPhase("DrawPhase");
  }

  async nextTurnPhase(requestedPhase = null) {
    this.phase = null;
    this.canAttack = false;
    this.canSpell = false;
    this.canSummon = false;

    const targetPhase = requestedPhase || this.nextPhase;

    switch (targetPhase) {
      case "draw":
      case "DrawPhase":
        await this.drawPhase();
        break;

      case "main":
      case "MainPhase1":
        await this.mainPhase();
        break;

      case "battle":
      case "BattlePhase":
        await this.battlePhase();
        break;

      case "end":
      case "EndPhase":
        await this.endPhase();
        break;

      default:
        console.warn(
          "nextTurnPhase: valeur nextTurn inconnue ->",
          this.nextPhase,
        );
        break;
    }
  }

  checkGameOver() {
    if (this.players.p1.pv <= 0) {
      this.isOver = true;
      this.gameState = "Finished";
      return { winner: "p2", loser: "p1" };
    }
    if (this.players.p2.pv <= 0) {
      this.isOver = true;
      this.gameState = "Finished";
      return { winner: "p1", loser: "p2" };
    }
    return null;
  }
}
