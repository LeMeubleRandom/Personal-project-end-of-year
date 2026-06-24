import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "../assets/css/game.css";

import GameTable from "../components/GameTable";
import GlobalChat from "../components/GlobalChat";

function Game({ user }) {
  const [isLoading, setIsLoading] = useState(true);

  const fetchGame = async (e) => {
    console.log("game");

    try {
      const response = await fetch("/api/game/start", {
        credentials: "include",
      });

      if (response.status === 401) {
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, []);

  if (isLoading) {
    return <div>Chargement de la partie...</div>;
  }

  return (
    <main className="game-container">
      <div className="chat"></div>
      <GameTable />
    </main>
  );
}

export default Game;
