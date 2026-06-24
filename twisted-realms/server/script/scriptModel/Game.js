import Player from "./Player.js";

export default class Game {
  constructor(gameId, player1Data, player2Data) {
    this.gameId = 1;

    this.players = {
      p1: new Player(player1Data),
      p2: new Player(player2Data),
    };

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
    if (this.status !== "Starting") return;

    this.status = "Playing";

    this.players.p1.drawHand();
    this.players.p2.drawHand();
    this.playerTurn = Math.random() < 0.5 ? "p1" : "p2";
    this.isFirstTurn = true;

    console.log(`${this.playerTurn} commence`);

    await this.drawPhase();
  }

  async rockPaperScissors() {}

  async drawPhase() {
    this.turn++;

    if (!this.isFirstTurn)
      this.playerTurn = this.playerTurn === "p1" ? "p2" : "p1";
    this.phase = "DrawPhase";
    this.nextPhase = "MainPhase1";
    this.players[this.playerTurn].draw();
  }

  async mainPhase() {
    this.phase = "MainPhase1";
    if (!this.isFirstTurn) this.nextPhase = "BattlePhase";
    else this.nextPhase = "EndPhase";
    this.canSpell = true;
    this.canSummon = true;
  }

  async secondMainPhase() {
    this.phase = "MainPhase2";
    this.nextPhase = "EndPhase";
    this.canSpell = true;
    this.canSummon = true;
  }

  async battlePhase() {
    this.phase = "BattlePhase";
    this.nextPhase = "EndPhase";
    this.canAttack = true;
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

      case "main2":
      case "MainPhase2":
        await this.secondMainPhase();
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
}
