import { NavLink, Navigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import "../assets/css/collection.css";
import Card from "../components/Card";

function Collection({ user }) {
  const [cardList, setCardList] = useState([]);
  const [userCollection, setCollection] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaction, setSelectedFaction] = useState("All");

  const [showOnlyOwned, setShowOnlyOwned] = useState(false);
  const [showOnlyFav, setOnlyFav] = useState(false);

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
      console.error("Erreur lors de la récupération :", e);
      return {};
    }
  };

  const ownedCards = getOwnedCards();

  const factionsList = useMemo(() => {
    const factions = new Set(cardList.map((c) => c.faction));
    return ["All", ...Array.from(factions)];
  }, [cardList]);

  const filteredCollection = useMemo(() => {
    return cardList
      .filter((card) => {
        if (showOnlyOwned) {
          const isOwned = (ownedCards[card.id] || 0) > 0;
          if (!isOwned) return false;
        }
        if (showOnlyFav) {
          const isFav = userCollection.favorite.includes(card.id);
          if (!isFav) return false;
        }

        if (selectedFaction !== "All" && card.faction !== selectedFaction) {
          return false;
        }

        if (
          searchQuery.trim() !== "" &&
          !card.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.faction.localeCompare(b.faction) || a.cost - b.cost);
  }, [cardList, selectedFaction, searchQuery, showOnlyOwned, showOnlyFav]);

  return (
    <main>
      <div className="panel-header">
        <h2>Ma Collection</h2>
        <div className="filters-row">
          <input
            type="text"
            placeholder="Rechercher une carte..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedFaction}
            onChange={(e) => setSelectedFaction(e.target.value)}
            className="faction-select"
          >
            {factionsList.map((faction) => (
              <option key={faction} value={faction}>
                {faction === "All" ? "Factions" : faction}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="collection-container">
        <div className="cards-container">
          {filteredCollection.map((c) => {
            const qty = ownedCards[c.id] || 0;
            const isOwned = qty > 0;
            return (
              <div
                key={c.id}
                className={`card-wrapper ${isOwned ? "owned" : "locked"}`}
              >
                <h3 className="card-wrapper-name">{c.name}</h3>
                <Card card={c} className="card" />
                <span className="badge-owned" title="Possédé(s)">
                  Possédé: {qty}
                </span>
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
              Possédées
            </label>
            <label className="filter-label">
              <input
                type="checkbox"
                checked={showOnlyFav}
                onChange={(e) => setOnlyFav(e.target.checked)}
              />
              Favorites
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Collection;
