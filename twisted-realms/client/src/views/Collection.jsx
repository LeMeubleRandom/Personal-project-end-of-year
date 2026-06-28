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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFactionDropdownOpen, setIsFactionDropdownOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && !event.target.closest(".filtre")) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isFactionDropdownOpen &&
        !event.target.closest(".custom-faction-select")
      ) {
        setIsFactionDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFactionDropdownOpen]);

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

  const favoriteList = useMemo(() => {
    if (!userCollection || !userCollection.favorite) return [];
    try {
      const favs = userCollection.favorite;
      return Array.isArray(favs) ? favs : JSON.parse(favs);
    } catch (e) {
      console.error("Erreur de parsing des favoris :", e);
      return [];
    }
  }, [userCollection]);

  const filteredCollection = useMemo(() => {
    return cardList
      .filter((card) => {
        if (showOnlyOwned) {
          const isOwned = (ownedCards[card.id] || 0) > 0;
          if (!isOwned) return false;
        }
        if (showOnlyFav) {
          const isFav = favoriteList.includes(card.id);
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
  }, [cardList, selectedFaction, searchQuery, showOnlyOwned, showOnlyFav, favoriteList]);

  const handleToggleFavorite = async (cardId) => {
    try {
      const response = await fetch("/api/user/collection/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "success") {
        setCollection((prev) => ({
          ...prev,
          favorite: data.favorite,
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris :", error);
    }
  };

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
          <div
            className={`custom-faction-select ${isFactionDropdownOpen ? "open" : ""}`}
          >
            <button
              type="button"
              className="custom-faction-trigger"
              onClick={() => setIsFactionDropdownOpen(!isFactionDropdownOpen)}
              aria-label="Sélectionner une faction"
            >
              <span className="selected-value">
                {selectedFaction === "All" ? "Factions" : selectedFaction}
              </span>
              <svg
                className="custom-faction-arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <ul className="custom-faction-options">
              {factionsList.map((faction) => (
                <li
                  key={faction}
                  className={`custom-faction-option ${selectedFaction === faction ? "active" : ""}`}
                  onClick={() => {
                    setSelectedFaction(faction);
                    setIsFactionDropdownOpen(false);
                  }}
                >
                  {faction === "All" ? "Toutes les factions" : faction}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="collection-container">
        <div className="cards-container">
          {filteredCollection.map((c) => {
            const qty = ownedCards[c.id] || 0;
            const isOwned = qty > 0;
            console.log(isOwned);
            return (
              <div
                key={c.id}
                className={`card-wrapper ${isOwned ? "owned" : "locked"}`}
              >
                <h3 className="card-wrapper-name">{c.name}</h3>
                <Card card={c} className="card" isMini={false} />
                <div className="collection-card-footer">
                  <span className="badge-owned" title="Possédé(s)">
                    Possédé: {qty}
                  </span>
                  <button
                    type="button"
                    className={`btn-favorite ${favoriteList.includes(c.id) ? "is-fav" : ""}`}
                    onClick={() => handleToggleFavorite(c.id)}
                    title={favoriteList.includes(c.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill={favoriteList.includes(c.id) ? "#f1c40f" : "none"}
                      stroke={favoriteList.includes(c.id) ? "#f1c40f" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className={`filtre ${isFilterOpen ? "open" : ""}`}>
          <div
            className="filtre-header"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <h3>Filtres</h3>
            <div className="collection-dropdown-arrow-wrapper">
              <svg
                className="collection-dropdown-arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          <div className="filter-group">
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
