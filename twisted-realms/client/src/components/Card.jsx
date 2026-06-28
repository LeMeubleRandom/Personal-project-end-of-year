import React from "react";
import "../assets/css/card.css";

import avatarImg from "../assets/images/placeholder.webp";

const cardArtFiles = import.meta.glob("../assets/images/cardArt/*", {
  eager: true,
});

const getCardArtwork = (card) => {
  if (card.art) {
    const artPath = `../assets/images/cardArt/${card.art}`;
    const matchedAsset = cardArtFiles[artPath];
    if (matchedAsset) {
      return matchedAsset.default || matchedAsset;
    }
  }
  return avatarImg;
};

const Card = ({ card, isMini }) => {
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
  const isSpell = cardStats.type?.toLowerCase() === "sort";

  return (
    <div className={`card-container ${factionClass} ${isMini ? "mini" : ""}`}>
      <div className="image">
        <img src={getCardArtwork(card)} alt="" draggable="false" />
        {!isMini && <div className="card-name">{cardStats.name}</div>}
        {!isMini && (
          <div className="card-attribute">
            <span>{cardStats.faction.toUpperCase()}</span>:
            <span>{cardStats.type.toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="card-effect">
        {!isMini && <span>{cardStats.effect}</span>}
      </div>

      {!isSpell && (
        <div className="card-stats">
          <div className="card-combat-stats">
            <span>{cardStats.power}</span>/<span>{cardStats.pv}</span>
          </div>
          <div className="card-accelerator-stat">
            <span>{cardStats.accelerator}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
