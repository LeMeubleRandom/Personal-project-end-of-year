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
    const ownedQuantity = ownedCards[cardId] || 0;

    if (currentCountInDeck >= ownedQuantity) {
      setErrorMessage(
        "Vous n'avez pas d'autres exemplaires de cette carte dans votre collection.",
      );
      return;
    }

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

  const sortDeck = useMemo(() => {
    return currentCardList
      .map((id) => cardList.find((card) => card.id === id))
      .filter((card) => card !== undefined)
      .sort(
        (a, b) =>
          a.faction.localeCompare(b.faction) ||
          a.cost - b.cost ||
          a.name.localeCompare(b.name),
      );
  }, [cardList, currentCardList]);

  const filteredCollection = useMemo(() => {
    return cardList
      .filter((card) => {
        const cards = Array.isArray(userCollection.cardCollection)
          ? userCollection.cardCollection
          : JSON.parse(userCollection.cardCollection);
        const quantities = Array.isArray(userCollection.quantity)
          ? userCollection.quantity
          : JSON.parse(userCollection.quantity);

        if (showOnlyOwned) {
          const isOwned = (cards[card.id] || 0) > 0;
          if (!isOwned) return false;
        }
        if (showOnlyFav) {
          const isFav = quantities.includes(card.id);
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
      onDragEnd={(e) => {
        console.log("dragend");
      }}
    >
      <div className="deck-view-container">
        <label htmlFor="deck-name"></label>
        <input
          type="text"
          id="deck-name"
          placeholder="Nom du deck"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <div>
          <div className="deck-cards">
            {sortDeck.map((card, index) => {
              return (
                <Droppable id={index} key={index} name={""}>
                  <Card card={card} className="deck-card" isMini={false} />
                </Droppable>
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
                  const qty = userCollection.cardCollection[c.id] || 0;
                  const isOwned = qty > 0;
                  const key = `${index}-filtered-card`;
                  return (
                    <Draggable
                      cardId={c.id}
                      key={key}
                      name="filter-unique-card-container"
                    >
                      <Card card={c} isMini={true} />
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
                        <span className="unique-card-effect">
                          {c.effect ? c.effect : "Lorem ipsum dolor sit amet."}
                        </span>
                      </div>
                    </Draggable>
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
