import { NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "../assets/css/collection.css";
import Card from "../components/Card";

function Collection({ user }) {
  const [cardList, setCardList] = useState([]);
  const [userCollection, setCollection] = useState([]);

  const [showOnlyOwned, setShowOnlyOwned] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const fetchCards = async (e) => {
    try {
      const response = await fetch("/api/card", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      setCardList(data);
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const fetchCollection = async (e) => {
    try {
      const response = await fetch("/api/user/collection", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      setCollection(data);
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchCollection();
  }, []);

  const getOwnedCards = () => {
    const row = userCollection;
    if (!row) return {};

    const rawCards = row.cardCollection;
    const rawQuantities = row.quantity;

    if (!rawCards || !rawQuantities) return {};

    try {
      const cards = Array.isArray(rawCards) ? rawCards : JSON.parse(rawCards);
      const quantities = Array.isArray(rawQuantities)
        ? rawQuantities
        : JSON.parse(rawQuantities);

      const map = {};
      cards.forEach((id, index) => {
        map[id] = quantities[index] || 0;
      });
      return map;
    } catch (e) {
      console.error("Erreur lors de l'analyse de la collection :", e);
      return {};
    }
  };

  const ownedCards = getOwnedCards();

  const visibleCards = showOnlyOwned
    ? cardList.filter((c) => ownedCards[c.id] > 0)
    : cardList;

  return (
    <main className="collection-container">
      <div className="cards-container">
        {visibleCards.map((c) => {
          const qty = ownedCards[c.id] || 0;
          const isOwned = qty > 0;
          return (
            <div
              key={c.id}
              className={`card-wrapper ${isOwned ? "owned" : "locked"}`}
            >
              <Card card={c} className="card" />
              <div className="card-quantity-badge">x{qty}</div>
            </div>
          );
        })}
      </div>
      <div className="filtre">
        <div className="filter-group">
          <h3>Filtres</h3>
          <label className="filter-label">
            <input
              type="checkbox"
              checked={showOnlyOwned}
              onChange={(e) => setShowOnlyOwned(e.target.checked)}
            />
            Possédées uniquement
          </label>
        </div>
      </div>
    </main>
  );
}

export default Collection;
