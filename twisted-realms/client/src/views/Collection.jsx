import { NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "../assets/css/collection.css";
import Card from "../components/Card";

function Collection() {
  const [cardList, setCardList] = useState([]);
  const [deckList, setDeckList] = useState([]);
  const [userDecks, setUserDecks] = useState([]);

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

  const fetchDecks = async (e) => {
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
    fetchDecks();
  }, []);

  useEffect(() => {
    if (deckList.length == 0) {
      console.log("Cet utilisateur n'a aucun deck enregistré");
    } else {
      console.log(deckList);
      fetchcardsByDeck();
    }
  }, [deckList]);

  return (
    <main className="collection-container">
      <div className="cards-container">
        {cardList.map((c) => (
          <Card key={c.id} card={c} className="card" />
        ))}
      </div>
      <div className="filtre">
        {userDecks.map((c) => (
          <Card key={c.name} card={c} className="card" />
        ))}
      </div>
    </main>
  );
}

export default Collection;
