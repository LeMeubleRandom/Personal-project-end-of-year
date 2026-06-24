import React, { useState, useMemo, useEffect } from "react";
import Card from "./Card";
import { useDraggable, useDroppable, DragDropProvider } from "@dnd-kit/react";
import Draggable from "./Draggable";
import Droppable from "./Droppable";

import "../assets/css/deckView.css";

const DeckView = ({
  user,
  activeDeck,
  cardList,
  userCollection,
  setIsEdit,
  fetchUserDecks,
  favoriteList,
}) => {
  const [deckName, setDeckName] = useState(activeDeck?.name || "Nouveau Deck");
  const [currentCardList, setCurrentCardList] = useState([]);
  const [currentMainCard, setCurrentMainCard] = useState(
    activeDeck?.mainCard || null,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaction, setSelectedFaction] = useState("All");

  const [showOnlyOwned, setShowOnlyOwned] = useState(false);
  const [showOnlyFav, setOnlyFav] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const deckCards = Array.isArray(activeDeck.cardList)
      ? activeDeck.cardList
      : typeof activeDeck.cardList === "string"
        ? JSON.parse(activeDeck.cardList)
        : [];
    setCurrentCardList(deckCards);
  }, []);

  const ownedCards = useMemo(() => {
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
  }, [userCollection]);

  const deckCardCounts = useMemo(() => {
    const counts = {};
    currentCardList.forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }, [currentCardList]);

  //ajoute une carte dans la variable currentdecklist
  //ne rajoute pas directement dans la base de donnée
  const handleAddCard = (cardId) => {
    setErrorMessage("");

    if (currentCardList.length >= 30) {
      setErrorMessage("Votre deck contient déjà le maximum de 30 cartes.");
      return;
    }

    const currentCountInDeck = deckCardCounts[cardId] || 0;
    const ownedQuantity = userCollection[cardId] || 0;

    /*if (currentCountInDeck >= ownedQuantity) {
      setErrorMessage(
        "Vous n'avez pas d'autres exemplaires de cette carte dans votre collection.",
      );
      return;
    }*/

    if (currentCountInDeck >= 3) {
      setErrorMessage(
        "Vous ne pouvez pas ajouter plus de 3 exemplaires d'une même carte.",
      );
      return;
    }

    const newList = [...currentCardList, cardId];
    setCurrentCardList(newList);

    if (!currentMainCard) {
      setCurrentMainCard(cardId);
    }
  };

  //enlève une carte de la variable currentCardList
  //ne supprime pas dans la base de donnée directement
  const handleRemoveCard = (cardId) => {
    setErrorMessage("");
    const index = currentCardList.indexOf(cardId);
    if (index === -1) return;

    const newList = [...currentCardList];
    newList.splice(index, 1);
    setCurrentCardList(newList);
    console.log(newList);

    if (currentMainCard === cardId) {
      const remainingCount = newList.filter((id) => id === cardId).length;
      if (remainingCount === 0) {
        setCurrentMainCard(newList[0] || null);
      }
    }
  };

  //Place la carte en tant que carte principale du deck
  const handleSetMainCard = (cardId) => {
    setCurrentMainCard(cardId);
  };

  //update le deck dans la base de donnée
  const handleSaveDeck = async () => {
    if (!deckName.trim()) {
      setErrorMessage("Le nom du deck ne peut pas être vide.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/user/deck/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: activeDeck.id,
          name: deckName.trim(),
          cardList: JSON.stringify(currentCardList),
          mainCard: currentMainCard,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();
      console.log("Deck sauvegardé avec succès", data);

      await fetchUserDecks();
      setIsEdit(false);
    } catch (err) {
      console.error(err);
      setErrorMessage("Une erreur est survenue lors de la sauvegarde du deck.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDeck = async () => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce deck ?",
    );
    if (!confirmDelete) return;

    setErrorMessage("");

    try {
      const response = await fetch("/api/user/deck/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: activeDeck.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      await fetchUserDecks();
      setIsEdit(false);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Une erreur est survenue lors de la suppression du deck.",
      );
    }
  };

  const sortDeck = useMemo(() => {
    const sorted = currentCardList
      .map((id) => cardList.find((card) => card.id === id))
      .filter((card) => card !== undefined)
      .sort(
        (a, b) =>
          a.faction.localeCompare(b.faction) ||
          a.cost - b.cost ||
          a.name.localeCompare(b.name),
      );

    const renderedCounts = {};
    return sorted.map((card) => {
      renderedCounts[card.id] = (renderedCounts[card.id] || 0) + 1;
      const isOwned = (userCollection[card.id] || 0) >= renderedCounts[card.id];
      return { card, isOwned };
    });
  }, [cardList, currentCardList, userCollection]);

  const filteredCollection = useMemo(() => {
    return cardList
      .filter((card) => {
        if (showOnlyOwned) {
          const isOwned = (userCollection[card.id] || 0) > 0;
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
  }, [cardList, selectedFaction, searchQuery, showOnlyOwned, showOnlyFav]);

  return (
    <DragDropProvider
      onDragStart={(e) => {
        console.log("dragstart");
      }}
      onDragOver={(e) => {
        console.log("dragover");
      }}
      onDragMove={(e) => {
        console.log("dragmov");
      }}
      onDragEnd={(event) => {
        console.log("dragend", event);
        const { active, over } = event;
        if (over && over.id === "droppableDeck") {
          let cardId = active.data?.current?.cardId;
          if (cardId === undefined && typeof active.id === "string") {
            const rawId = active.id.replace("draggable-", "");
            const foundCard = cardList.find((c) => String(c.id) === rawId);
            if (foundCard) {
              cardId = foundCard.id;
            }
          }
          if (cardId !== undefined) {
            handleAddCard(cardId);
          }
        }
      }}
    >
      <div className="deck-view-container">
        <div className="deck-head-container">
          <div>
            <label htmlFor="deck-name"></label>
            <input
              type="text"
              id="deck-name"
              placeholder="Nom du deck"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
            />
          </div>
          <div className="deck-head-actions">
            <button className="deck-delete-btn" onClick={handleDeleteDeck}>
              Supprimer
            </button>
            <button
              className="deck-save-btn"
              onClick={handleSaveDeck}
              disabled={isSaving}
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
        {errorMessage && (
          <div className="deck-error-message">{errorMessage}</div>
        )}
        <div>
          <div className="deck-cards">
            {sortDeck.map(({ card, isOwned }, index) => {
              return (
                <div
                  className={`deck-card-container ${isOwned ? "owned" : "locked"}`}
                  key={index}
                  onClick={(e) => {
                    setCurrentMainCard(card.id);
                  }}
                >
                  <Card card={card} className="deck-card" isMini={false} />
                </div>
              );
            })}
          </div>
          <div className="deck-side-container">
            <h3>Filtres</h3>
            <div className="deck-filter-container">
              <div className="deck-label-container">
                <input
                  type="text"
                  placeholder="Rechercher une carte..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <label className="deck-filter-label">
                  <input
                    type="checkbox"
                    checked={showOnlyOwned}
                    onChange={(e) => setShowOnlyOwned(e.target.checked)}
                  />
                  Possédées
                </label>
                <label className="deck-filter-label">
                  <input
                    type="checkbox"
                    checked={showOnlyFav}
                    onChange={(e) => setOnlyFav(e.target.checked)}
                  />
                  Favorites
                </label>
              </div>
              <div className="deck-filter-cards-container">
                {filteredCollection.map((c, index) => {
                  const qty = userCollection[c.id] || 0;
                  const isOwned = qty > 0;
                  console.log(isOwned);
                  const key = `${index}-filtered-card`;
                  return (
                    <div className="filter-unique-card-container" key={key}>
                      <div
                        className={`filtered-card-view ${isOwned ? "owned" : "locked"}`}
                      >
                        <Card card={c} isMini={true} />
                      </div>
                      <div className="filter-unique-card-description">
                        <div className="filter-unique-card-attribut">
                          <div className="filter-unique-card-info">
                            <h2 className="filter-unique-card-name">
                              {c.name}
                            </h2>
                            <h2 className="filter-unique-card-type">
                              {c.faction}/{c.type}
                            </h2>
                          </div>
                          <div className="filter-unique-card-stat">
                            <div className="unique-card-stat">
                              <span>ACCEL</span>
                              <span>{c.accelerator}</span>
                            </div>
                            <div className="unique-card-stat">
                              <span>ATK</span>
                              <span>{c.atk}</span>
                            </div>
                            <div className="unique-card-stat">
                              <span>PV</span>
                              <span>{c.PV}</span>
                            </div>
                          </div>
                        </div>
                        <div className="unique-card-effect-container">
                          <span className="unique-card-effect">
                            {c.effect
                              ? c.effect
                              : "Lorem ipsum dolor sit amet."}
                          </span>
                          <div className="unique-card-btn">
                            <button
                              className="unique-card-btn-action minus"
                              onClick={() => handleRemoveCard(c.id)}
                              disabled={(deckCardCounts[c.id] || 0) === 0}
                            >
                              -
                            </button>
                            <span className="unique-card-count">
                              {deckCardCounts[c.id] || 0}
                            </span>
                            <button
                              className="unique-card-btn-action plus"
                              onClick={() => handleAddCard(c.id)}
                              disabled={
                                (deckCardCounts[c.id] || 0) >= 3 ||
                                currentCardList.length >= 30
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragDropProvider>
  );
};

export default DeckView;
