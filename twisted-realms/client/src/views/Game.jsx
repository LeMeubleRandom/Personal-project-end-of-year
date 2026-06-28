import { useState, useEffect } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { io } from "socket.io-client";

import "../assets/css/game.css";

import GameTable from "../components/GameTable";

function Game({ user }) {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (!user.gameId) {
      setIsLoading(false);
      return;
    }

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL ||
      `http://${window.location.hostname}:5000`;
    
    const newSocket = io(backendUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to game socket server");
      newSocket.emit("join game", { gameId: user.gameId, userId: user.id });
    });

    newSocket.on("game state update", (updatedState) => {
      console.log("Game state received:", updatedState);
      setGameState(updatedState);
      setIsLoading(false);
    });

    newSocket.on("action error", ({ message }) => {
      alert(`Erreur : ${message}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user.gameId, user.id]);

  const sendAction = (actionType, payload = {}) => {
    if (socket && user.gameId) {
      socket.emit("player action", {
        gameId: user.gameId,
        playerId: user.id,
        actionType,
        payload,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="game-loading">
        <div className="pulse-spinner"></div>
        <p>Connexion au duel en cours...</p>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="game-error-screen">
        <h2>Aucun duel en cours</h2>
        <NavLink to="/lobby" className="lobby-redirect-btn">
          Retour au salon
        </NavLink>
      </div>
    );
  }

  return (
    <main className="game-container">
      <GameTable user={user} gameState={gameState} sendAction={sendAction} />
    </main>
  );
}

export default Game;
