import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import "../assets/css/gameTable.css";

const GameTable = ({ user, gameState, sendAction }) => {
  const navigate = useNavigate();

  const selfKey =
    Number(gameState.players.p1.id) === Number(user.id) ? "p1" : "p2";
  const oppKey = selfKey === "p1" ? "p2" : "p1";

  const self = gameState.players[selfKey];
  const opponent = gameState.players[oppKey];

  const isMyTurn = gameState.playerTurn === selfKey;
  const currentPhase = gameState.phase;

  const [selectedHandIndex, setSelectedHandIndex] = useState(null);
  const [selectedAttackerIndex, setSelectedAttackerIndex] = useState(null);
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSurrender, setShowSurrender] = useState(false);
  const [hasSurrend, setHasSurrend] = useState("Vous gagnez 20 crédits");
  const [effectTargetingFlow, setEffectTargetingFlow] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNextPhase = () => {
    if (!isMyTurn) return;
    sendAction("CHANGE_PHASE", { requestedPhase: gameState.nextPhase });
    setSelectedHandIndex(null);
    setSelectedAttackerIndex(null);
  };

  const handleHandCardClick = (index) => {
    if (!isMyTurn) return;
    setSelectedHandIndex(selectedHandIndex === index ? null : index);
  };

  const executeHandAction = (actionType, index) => {
    sendAction(actionType, { cardHandIndex: index });
    setSelectedHandIndex(null);
  };

  const handlePlayOrSummonClick = (actionType, index) => {
    const card = self.hand[index];
    if (!card) return;

    if (actionType === "PLAY_SUPPORT" && (card.id === 62 || card.name?.toLowerCase() === "réincarnation de monstre")) {
      const hasBeingInGraveyard = self.graveyard.some((c) => c.type === "Être");
      if (!hasBeingInGraveyard) {
        alert("Effet de Réincarnation : Aucun Être dans votre cimetière à réinvoquer !");
        return;
      }
      setEffectTargetingFlow({
        card,
        handIndex: index,
        actionType,
        step: "select_graveyard",
        discardIndex: null,
        graveyardCardId: null,
      });
      return;
    }

    if (actionType === "SUMMON_BEING" && (card.id === 1 || card.name?.toLowerCase().includes("nyxos"))) {
      const hasBeingInGraveyard = self.graveyard.some((c) => c.type === "Être");
      const hasOtherCardInHand = self.hand.length > 1;
      if (!hasOtherCardInHand || !hasBeingInGraveyard) {
        alert("Effet de Nyxos : Vous devez avoir au moins une autre carte en main à défausser et un Être dans le cimetière !");
        return;
      }
      setEffectTargetingFlow({
        card,
        handIndex: index,
        actionType,
        step: "select_discard",
        discardIndex: null,
        graveyardCardId: null,
      });
      return;
    }

    executeHandAction(actionType, index);
  };

  const handleDiscardSelection = (handIndex) => {
    setEffectTargetingFlow((prev) => ({
      ...prev,
      discardIndex: handIndex,
      step: "select_graveyard",
    }));
  };

  const handleGraveyardSelection = (graveyardCard) => {
    if (effectTargetingFlow.actionType === "PLAY_SUPPORT") {
      sendAction("PLAY_SUPPORT", {
        cardHandIndex: effectTargetingFlow.handIndex,
        targetGraveyardCardId: graveyardCard.id,
      });
    } else if (effectTargetingFlow.actionType === "SUMMON_BEING") {
      sendAction("SUMMON_BEING", {
        cardHandIndex: effectTargetingFlow.handIndex,
        discardCardHandIndex: effectTargetingFlow.discardIndex,
        targetGraveyardCardId: graveyardCard.id,
      });
    }
    setEffectTargetingFlow(null);
    setSelectedHandIndex(null);
  };

  const handleSelfBeingClick = (index) => {
    if (!isMyTurn || currentPhase !== "BattlePhase") return;
    const card = self.mainZone[index];
    if (card.hasAttacked) {
      alert("Cette créature a déjà attaqué ce tour-ci !");
      return;
    }
    setSelectedAttackerIndex(selectedAttackerIndex === index ? null : index);
  };

  const handleOpponentBeingClick = (index) => {
    if (selectedAttackerIndex === null) return;
    sendAction("ATTACK", {
      attackerIndex: selectedAttackerIndex,
      targetIndex: index,
    });
    setSelectedAttackerIndex(null);
  };

  const handleDirectAttack = () => {
    if (selectedAttackerIndex === null) return;
    sendAction("ATTACK", {
      attackerIndex: selectedAttackerIndex,
      targetIndex: null,
    });
    setSelectedAttackerIndex(null);
  };

  const handleSurrender = () => {
    sendAction("SURRENDER", {});
    setShowSurrender(false);
    setHasSurrend("Vous gagnez 0 crédit");
  };

  if (gameState.gameState === "Finished" || gameState.isOver) {
    const isWinner = self.pv > 0;
    return (
      <div className="duel-finished-overlay">
        <div className="duel-finished-card">
          <h1 className={isWinner ? "victory-title" : "defeat-title"}>
            {isWinner ? "VICTOIRE !" : "DÉFAITE..."}
          </h1>
          <p className="rewards-text">
            {isWinner ? "Vous gagnez 100 crédits" : hasSurrend}
          </p>
          <button
            className="lobby-redirect-btn"
            onClick={() => navigate("/lobby")}
          >
            Retour au salon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="board-container">
      <div className="orientation-warning-overlay">
        <div className="orientation-warning-content">
          <div className="rotate-phone-icon">🔄</div>
          <h2>Orientation Paysage Requise</h2>
          <p>
            Veuillez tourner votre appareil à l'horizontal pour jouer à Twisted
            Realms.
          </p>
        </div>
      </div>

      {showSurrender && (
        <div
          className="surrender-confirm-overlay"
          onClick={() => setShowSurrender(false)}
        >
          <div
            className="surrender-confirm-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Abandonner la partie</h3>
            <p>Voulez-vous déclarer forfait ? Cette action est irréversible.</p>
            <div className="surrender-actions">
              <button
                className="surrender-btn confirm animate-glow"
                onClick={handleSurrender}
              >
                Abandonner
              </button>
              <button
                className="surrender-btn cancel"
                onClick={() => setShowSurrender(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {effectTargetingFlow && (
        <div
          className="effect-selector-overlay"
          onClick={() => setEffectTargetingFlow(null)}
        >
          <div
            className="effect-selector-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {effectTargetingFlow.step === "select_discard"
                ? "Effet de Nyxos : Défausser une carte"
                : "Choisir un Être dans le cimetière"}
            </h3>
            <div className="selector-cards-list">
              {effectTargetingFlow.step === "select_discard" ? (
                self.hand.map((c, idx) => {
                  if (idx === effectTargetingFlow.handIndex) return null;
                  return (
                    <div
                      key={`discard-select-${idx}`}
                      className="selector-card-item hover-glow"
                      onClick={() => handleDiscardSelection(idx)}
                    >
                      <Card card={{ ...c, PV: c.pv }} isMini={true} />
                      <div className="card-label">Défausser</div>
                    </div>
                  );
                })
              ) : (
                self.graveyard
                  .filter((c) => c.type === "Être")
                  .map((c, idx) => (
                    <div
                      key={`graveyard-select-${idx}`}
                      className="selector-card-item hover-glow"
                      onClick={() => handleGraveyardSelection(c)}
                    >
                      <Card card={{ ...c, PV: c.pv }} isMini={true} />
                      <div className="card-label">Réinvoquer</div>
                    </div>
                  ))
              )}
            </div>
            <div className="selector-actions">
              <button
                className="selector-cancel-btn"
                onClick={() => setEffectTargetingFlow(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobile && selectedAttackerIndex !== null && (
        <div className="mobile-direct-attack-overlay">
          <button
            className="direct-attack-btn active-glow"
            onClick={handleDirectAttack}
          >
            ⚡ Attaquer directement l'adversaire !
          </button>
        </div>
      )}

      <button
        className={`sidebar-toggle-btn left-toggle ${isLeftBarOpen ? "open" : ""}`}
        onClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        aria-label="Toggle status bar"
      >
        {isLeftBarOpen ? "◀" : "▶"}
      </button>

      <button
        className={`sidebar-toggle-btn right-toggle ${isRightBarOpen ? "open" : ""}`}
        onClick={() => setIsRightBarOpen(!isRightBarOpen)}
        aria-label="Toggle player hand"
      >
        {isRightBarOpen ? "▶" : "◀"}
      </button>

      <header
        className={`game-status-bar ${isLeftBarOpen ? "mobile-open" : ""}`}
      >
        <div className="status-item">
          <span>Tour</span>
          <strong className="status-val">#{gameState.turn}</strong>
        </div>
        <div className="status-item">
          <span>Phase active</span>
          <strong className="status-val phase-name">{currentPhase}</strong>
        </div>
        <div className="status-item">
          <span>Tour de</span>
          <strong
            className={`status-val player-turn ${isMyTurn ? "my-turn" : "opponent-turn"}`}
          >
            {isMyTurn ? "VOUS" : opponent.name}
          </strong>
        </div>
        <div className="status-item">
          <span>Main adversaire</span>
          <strong className="status-val opponent-hand-val">
            {opponent.hand.length} cartes
          </strong>
        </div>
        {isMyTurn && (
          <button
            className="next-phase-btn active-glow"
            onClick={handleNextPhase}
          >
            {gameState.nextPhase === "DrawPhase"
              ? "Fin de tour"
              : "Phase Suivante"}
          </button>
        )}

        <button
          className="surrender-trigger-btn"
          onClick={() => setShowSurrender(true)}
        >
          Abandonner
        </button>

        {isMobile && (
          <div className="mobile-players-stats">
            <div className="mobile-player-stat-block opponent-stats">
              <h4>Adversaire ({opponent.name})</h4>
              <div className="stats-row">
                <span className="stat-badge pv-badge">PV: {opponent.pv}</span>
                <span className="stat-badge counter-badge">
                  Accélérateurs: {opponent.acceleratorCounters || 0}
                </span>
              </div>
              <div className="side-zones">
                <div className="side-slot deck-slot">
                  <span>Deck</span>
                  <strong>{opponent.deck.length}</strong>
                </div>
                <div className="side-slot graveyard-slot">
                  <span>Cimetière</span>
                  <strong>{opponent.graveyard.length}</strong>
                </div>
              </div>
            </div>

            <div className="mobile-player-stat-block self-stats">
              <h4
                className="clickable-pseudo"
                onClick={() => setShowSurrender(!showSurrender)}
              >
                Vous ({self.name}) <span className="surrender-hint">⚐</span>
              </h4>
              <div className="stats-row">
                <span className="stat-badge pv-badge">PV: {self.pv}</span>
                <span className="stat-badge counter-badge">
                  Accélérateurs: {self.acceleratorCounters}
                </span>
              </div>
              <div className="side-zones">
                <div className="side-slot deck-slot">
                  <span>Deck</span>
                  <strong>{self.deck.length}</strong>
                </div>
                <div className="side-slot graveyard-slot">
                  <span>Cimetière</span>
                  <strong>{self.graveyard.length}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="board-content">
        <section className="player-side opponent-side">
          {!isMobile && (
            <div className="player-left-panel">
              <div className="player-header">
                <h3>{opponent.name} (Adversaire)</h3>
                <div className="stats-row">
                  <span className="stat-badge pv-badge">PV: {opponent.pv}</span>
                  <span className="stat-badge counter-badge">
                    Accélérateurs: {opponent.acceleratorCounters || 0}
                  </span>
                </div>
                {selectedAttackerIndex !== null && (
                  <button
                    className="direct-attack-btn active-glow"
                    onClick={handleDirectAttack}
                  >
                    Attaquer directement l'adversaire !
                  </button>
                )}
              </div>

              <div className="side-zones">
                <div className="side-slot deck-slot">
                  <span>Deck</span>
                  <strong>{opponent.deck.length}</strong>
                </div>
                <div className="side-slot graveyard-slot">
                  <span>Cimetière</span>
                  <strong>{opponent.graveyard.length}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="field-layout">
            <div className="card-zone spell-zone">
              {Array.from({ length: 3 }).map((_, i) => {
                const card = opponent.spellZone[i];
                return (
                  <div key={`opp-spell-${i}`} className="card-slot spell-slot">
                    {card ? (
                      <Card card={card} isMini={true} />
                    ) : (
                      <span className="slot-placeholder">Sort</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="card-zone main-zone">
              {Array.from({ length: 5 }).map((_, i) => {
                const card = opponent.mainZone[i];
                return (
                  <div
                    key={`opp-being-${i}`}
                    className={`card-slot main-slot ${selectedAttackerIndex !== null && card ? "targetable" : ""}`}
                    onClick={() => card && handleOpponentBeingClick(i)}
                  >
                    {card ? (
                      <Card
                        card={{ ...card, PV: card.currentPv }}
                        isMini={true}
                      />
                    ) : (
                      <span className="slot-placeholder">Être</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="player-side self-side">
          {!isMobile && (
            <div className="player-left-panel">
              <div className="player-header">
                <h3
                  className="clickable-pseudo"
                  onClick={() => setShowSurrender(!showSurrender)}
                >
                  {self.name} (Vous) <span className="surrender-hint">⚐</span>
                </h3>
                <div className="stats-row">
                  <span className="stat-badge pv-badge">PV: {self.pv}</span>
                  <span className="stat-badge counter-badge">
                    Accélérateurs: {self.acceleratorCounters}
                  </span>
                </div>
              </div>

              <div className="side-zones">
                <div className="side-slot deck-slot">
                  <span>Deck</span>
                  <strong>{self.deck.length}</strong>
                </div>
                <div className="side-slot graveyard-slot">
                  <span>Cimetière</span>
                  <strong>{self.graveyard.length}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="field-layout">
            <div className="card-zone main-zone">
              {Array.from({ length: 5 }).map((_, i) => {
                const card = self.mainZone[i];
                const isSelected = selectedAttackerIndex === i;
                return (
                  <div
                    key={`self-being-${i}`}
                    className={`card-slot main-slot ${card && !card.hasAttacked && currentPhase === "BattlePhase" ? "can-attack" : ""} ${isSelected ? "selected-attacker" : ""}`}
                    onClick={() => card && handleSelfBeingClick(i)}
                  >
                    {card ? (
                      <div className={card.hasAttacked ? "exhausted" : ""}>
                        <Card
                          card={{ ...card, PV: card.currentPv }}
                          isMini={true}
                        />
                        {card.hasAttacked && (
                          <span className="exhausted-badge">Fatigué</span>
                        )}
                      </div>
                    ) : (
                      <span className="slot-placeholder">Être</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="card-zone spell-zone">
              {Array.from({ length: 3 }).map((_, i) => {
                const card = self.spellZone[i];
                return (
                  <div key={`self-spell-${i}`} className="card-slot spell-slot">
                    {card ? (
                      <Card card={card} isMini={true} />
                    ) : (
                      <span className="slot-placeholder">Sort</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <section
        className={`hand-container ${isRightBarOpen ? "mobile-open" : ""}`}
      >
        <h4 className="hand-title">Main ({self.hand.length})</h4>
        <div className="hand-cards">
          {self.hand.map((card, index) => {
            const isSelected = selectedHandIndex === index;
            const canAfford = self.acceleratorCounters >= card.cost;
            return (
              <div key={`hand-${index}`} className="hand-card-wrapper">
                <div
                  className={`hand-card-item-container ${isSelected ? "selected" : ""}`}
                  onClick={() => handleHandCardClick(index)}
                >
                  <Card card={{ ...card, PV: card.pv }} isMini={false} />
                </div>

                {isSelected && isMyTurn && currentPhase === "MainPhase1" && (
                  <div className="hand-card-actions">
                    {card.type != "Sort" && (
                      <button
                        className={`action-btn acc-btn faction-${card.faction}`}
                        onClick={() =>
                          executeHandAction("USE_ACCELERATOR", index)
                        }
                      >
                        Accélérer (+{card.accelerator})
                      </button>
                    )}
                    {card.type === "Être" && (
                      <button
                        className="action-btn play-btn"
                        disabled={!canAfford}
                        onClick={() => handlePlayOrSummonClick("SUMMON_BEING", index)}
                      >
                        Invoquer
                      </button>
                    )}
                    {(card.type === "Soutien" || card.type === "Sort") && (
                      <button
                        className="action-btn play-btn"
                        disabled={!canAfford}
                        onClick={() => handlePlayOrSummonClick("PLAY_SUPPORT", index)}
                      >
                        Jouer Sort
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default GameTable;
