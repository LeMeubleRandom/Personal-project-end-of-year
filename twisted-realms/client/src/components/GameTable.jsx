import React from "react";
import "../assets/css/gameTable.css";

const GameTable = () => {
  return (
    <div className="board-container">
      <div className="board-content">
        <section className="field-container" id="opponent-zone">
          <div className="card-zone" id="opponent-spell-zone">
            <div className="spell-card-zone"></div>
            <div className="spell-card-zone"></div>
            <div className="spell-card-zone"></div>
            <div className="spell-card-zone"></div>
            <div className="spell-card-zone"></div>
          </div>
          <div className="card-zone" id="opponent-main-zone">
            <div className="main-card-zone"></div>
            <div className="main-card-zone"></div>
            <div className="main-card-zone"></div>
            <div className="main-card-zone"></div>
            <div className="main-card-zone"></div>
          </div>
        </section>
        <section className="adjac-zone-container" id="opponent-left-zones">
          <div className="deck-zone"></div>
          <div className="graveyard-zone"></div>
          <div className="ostrac-zone"></div>
        </section>
        <section className="adjac-zone-container" id="opponent-right-zones">
          <div className="other"></div>
          <div className="other"></div>
        </section>
        <section className="field-container" id="player-zone">
          <div className="card-zone" id="player-main-zone">
            <div className="main-card-zone">
              <p className="player-zone-name">main</p>
            </div>
            <div className="main-card-zone">
              <p className="player-zone-name">main</p>
            </div>
            <div className="main-card-zone">
              <p className="player-zone-name">main</p>
            </div>
            <div className="main-card-zone">
              <p className="player-zone-name">main</p>
            </div>
            <div className="main-card-zone">
              <p className="player-zone-name">main</p>
            </div>
          </div>
          <div className="card-zone" id="player-spell-zone">
            <div className="spell-card-zone">
              <p className="player-zone-name">spell</p>
            </div>
            <div className="spell-card-zone">
              <p className="player-zone-name">spell</p>
            </div>
            <div className="spell-card-zone">
              <p className="player-zone-name">spell</p>
            </div>
            <div className="spell-card-zone">
              <p className="player-zone-name">spell</p>
            </div>
            <div className="spell-card-zone">
              <p className="player-zone-name">spell</p>
            </div>
          </div>
        </section>
        <section className="adjac-zone-container" id="player-right-zones">
          <div className="ostrac-zone">
            <p className="player-zone-name">ostrac</p>
          </div>
          <div className="graveyard-zone">
            <p className="player-zone-name">graveyard</p>
          </div>
          <div className="deck-zone">
            <p className="player-zone-name">deck</p>
          </div>
        </section>
        <section className="adjac-zone-container" id="player-left-zones">
          <div className="other">
            <p className="player-zone-name">other</p>
          </div>
          <div className="other">
            <p className="player-zone-name">other</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GameTable;
