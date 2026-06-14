import React from "react";
import "../assets/css/card.css";

import avatarImg from "../assets/images/placeholder.webp";

const Card = ({ card }) => {
  const cardStats = {
    name: card.name,
    faction: card.faction,
    type: card.type,
    effect: card.effect
      ? card.effect
      : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    accelerator: card.accelerator,
    power: card.atk,
    pv: card.PV,
  };

  const factionClass = `faction-${cardStats.faction.toLowerCase()}`;

  return (
    <div className={`card-container ${factionClass}`}>
      <div className="image">
        <img src={avatarImg} alt="" draggable="false" />
        <div className="card-name">{cardStats.name}</div>
        <div className="card-attribute">
          <span>{cardStats.faction.toUpperCase()}</span>:
          <span>{cardStats.type.toUpperCase()}</span>
        </div>
      </div>

      <div className="card-effect">
        <span>{cardStats.effect}</span>
      </div>

      <div className="card-stats">
        <div className="card-combat-stats">
          <span>{cardStats.power}</span>/<span>{cardStats.pv}</span>
        </div>
        <div className="card-accelerator-stat">
          <span>{cardStats.accelerator}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
