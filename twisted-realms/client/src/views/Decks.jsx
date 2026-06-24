import { NavLink, Navigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import "../assets/css/decks.css";
import Card from "../components/Card";
import DeckView from "../components/DeckView";

function Decks({ user }) {
  const [cardList, setCardList] = useState([]);
  const [deckList, setDeckList] = useState([]);
  const [userDecks, setUserDecks] = useState([]);
  const [userCollection, setCollection] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);

  const [isEdit, setIsEdit] = useState(false);
  const [editedDeck, setEditedDeck] = useState([]);

  const [showOnlyOwned, setShowOnlyOwned] = useState([]);

  const [incompletedDeck, setIncompDeck] = useState(null);
  const [missingCard, setMissingCard] = useState(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const verifyQuantity = (decks, owned) => {
    console.log(decks);
    console.log(owned);
    const missing = {};
    const missing2 = {};

    decks.forEach((deck) => {
      const deckCards = Array.isArray(deck.cardList)
        ? deck.cardList
        : typeof deck.cardList === "string"
          ? JSON.parse(deck.cardList)
          : [];

      const counts = {};
      deckCards.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
      console.log(deckCards.length);
      let isMissing = false;
      for (const id of Object.keys(counts)) {
        const required = counts[id];
        const has = owned[id] || 0;
        if (has < required) {
          isMissing = true;
          break;
        }
      }
      if (isMissing) {
        missing[deck.id] = "Cartes manquantes";
      }

      if (deckCards.length != 30)
        missing2[deck.id] = "Nombre de cartes insuffisant";
    });

    setMissingCard(missing);
    setIncompDeck(missing2);
  };

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

  const fetchUserDecks = async (e) => {
    try {
      const response = await fetch("/api/user/deck", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      setDeckList(data);
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const fetchcardsByDeck = async (deck) => {
    const targetDeck = deck || deckList[0];
    if (!targetDeck) {
      console.warn("Aucun deck n'est disponible.");
      return;
    }
    setActiveDeck(targetDeck);

    try {
      const cardListParam =
        typeof targetDeck.cardList === "string"
          ? targetDeck.cardList
          : JSON.stringify(targetDeck.cardList);
      const response = await fetch(
        `/api/card/deck?cardList=${encodeURIComponent(cardListParam)}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      setUserDecks(data);
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

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

  const ownedCards = useMemo(() => getOwnedCards(), [userCollection]);

  const visibleCards = showOnlyOwned
    ? cardList.filter((c) => ownedCards[c.id] > 0)
    : cardList;

  const handleCreateDeck = async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/user/deck/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: "Nouveau Deck",
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      await fetchUserDecks();
    } catch (error) {
      console.error("Erreur lors de la création du deck :", error);
    }
  };

  const viewDeck = async (deck) => {
    if (!user) {
      Navigate("/login");
      return;
    }
    setActiveDeck(deck);
    setIsEdit(true);
  };

  useEffect(() => {
    fetchCards();
    fetchCollection();
    fetchUserDecks();
  }, []);

  useEffect(() => {
    verifyQuantity(deckList, ownedCards);
  }, [deckList, ownedCards]);

  useEffect(() => {
    if (deckList.length == 0) {
      console.log("Cet utilisateur n'a aucun deck enregistré");
    } else {
      fetchcardsByDeck(deckList[0]);
    }
  }, [deckList]);

  return (
    <main>
      {isEdit && (
        <DeckView
          user={user}
          activeDeck={activeDeck}
          cardList={cardList}
          userCollection={ownedCards}
          setIsEdit={setIsEdit}
          fetchUserDecks={fetchUserDecks}
          favoriteList={userCollection.favorite}
        />
      )}
      {!isEdit && (
        <div className="deck-container">
          {deckList.map((c) => {
            const deckCards = Array.isArray(c.cardList)
              ? c.cardList
              : typeof c.cardList === "string"
                ? JSON.parse(c.cardList)
                : [];

            const targetCardId = c.mainCard || deckCards[0];

            const targetCard = cardList.find(
              (card) => card.id === targetCardId,
            );

            return (
              <div
                key={c.name}
                className="decks-view"
                onClick={() => viewDeck(c)}
              >
                <h2>{c.name}</h2>
                {targetCard && <Card card={targetCard} isMini={false} />}
                {missingCard[c.id] && (
                  <div className="error">{missingCard[c.id]}</div>
                )}
                {incompletedDeck && (
                  <div className="error">{incompletedDeck[c.id]}</div>
                )}
              </div>
            );
          })}
          <div
            className="add-deck-btn"
            onClick={handleCreateDeck}
            style={{ cursor: "pointer" }}
          >
            <span className="add-deck-icon">+</span>
            <span className="add-deck-text">Nouveau Deck</span>
            <span className="add-deck-desc">Créer un deck personnalisé</span>
          </div>
        </div>
      )}
    </main>
  );
}

export default Decks;
