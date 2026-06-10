import { NavLink, useNavigate, Navigate } from "react-router-dom";

import "../assets/css/lobby.css";

import { useState, useEffect, useMemo } from "react";

function Lobby({ user }) {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [gameState, setGameState] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hostLobby = async (e) => {
    try {
      const response = await fetch("/api/host", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };
  const joinLobby = async (e) => {};

  return (
    <main>
      <button className="lobby-btn" onClick={hostLobby}>
        Host lobby
      </button>
      <button className="lobby-btn" onClick={joinLobby}>
        Join lobby
      </button>
    </main>
  );
}

export default Lobby;
