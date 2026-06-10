import { NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "../assets/css/decks.css";
import Card from "../components/Card";

function Decks({ user }) {
  const [cardList, setCardList] = useState([]);
  const [deckList, setDeckList] = useState([]);
  const [userDecks, setUserdecks] = useState([]);
  const [userCollection, setCollection] = useState([]);

  const [showOnlyOwned, setShowOnlyOwned] = useState([]);

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

  const fetchcardsByDeck = async (e) => {
    try {
      const response = await fetch(
        `/api/card/deck?cardList=${deckList[0].cardList}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setUserDecks(data);
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchCollection();
    //fetchUserDecks();
  });

  /*useEffect(() => {
    if (deckList.length == 0) {
      console.log("Cet utilisateur n'a aucun deck enregistré");
    } else {
      console.log(deckList);
      fetchcardsByDeck();
    }
  }, [deckList]);*/

  {
    userDecks.map((c) => <Card key={c.name} card={c} className="card" />);
  }

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

  return <main></main>;
}

export default Decks;
