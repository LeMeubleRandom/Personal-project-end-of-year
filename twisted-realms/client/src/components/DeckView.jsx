import React, { useState, useMemo, useEffect } from "react";
import Card from "./Card";
import "../assets/css/deckView.css";

const DeckView = ({
  user,
  activeDeck,
  cardList,
  ownedCards,
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

  return (
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
            return <Card card={card} className="deck-card" key={index} />;
          })}
        </div>
        <div className="deck-filter-container"></div>
      </div>
    </div>
  );
};

export default DeckView;
