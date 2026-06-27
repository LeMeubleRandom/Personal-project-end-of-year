import { useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import avatarImg from "../assets/images/icon_profile.png";
import "../assets/css/gameLobby.css";

function GameLobby({ user, fetchUser }) {
  const navigate = useNavigate();
  const [gameLobbyParam, setGameLobbyParam] = useState(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    `http://${window.location.hostname}:5000`;
  const serverUrl = `${backendUrl.replace(/\/$/, "")}/user-images/`;

  const fetchLobby = async () => {
    if (!user?.gameId) return;
    try {
      const response = await fetch(`/api/game/${user.gameId}`, {
        credentials: "include",
      });

      if (response.status === 404) {
        alert("Le salon a été fermé par l'hôte.");
        if (fetchUser) await fetchUser();
        navigate("/lobby");
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();
      setGameLobbyParam(data);

      if (data && data.isStarted === 1) {
        navigate("/game");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  useEffect(() => {
    if (!user?.gameId) return;
    fetchLobby();
    const interval = setInterval(fetchLobby, 2000);
    return () => clearInterval(interval);
  }, [user?.gameId]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleStartGame = async () => {
    if (!gameLobbyParam || !gameLobbyParam.player2Id) return;
    try {
      const response = await fetch("/api/game/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: user.gameId,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur HTTP : ${response.status}`,
        );
      }

      navigate("/game");
    } catch (error) {
      console.error("Erreur lors du lancement de la partie :", error);
      alert(error.message);
    }
  };

  const handleLeaveLobby = async () => {
    try {
      const response = await fetch("/api/game/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          gameId: user.gameId,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      if (fetchUser) await fetchUser();
      navigate("/lobby");
    } catch (error) {
      console.error("Erreur lors de la sortie du salon :", error);
    }
  };

  const isHost =
    gameLobbyParam && Number(gameLobbyParam.player1Id) === Number(user.id);
  const player1Avatar = gameLobbyParam?.player1Image
    ? `${serverUrl}${gameLobbyParam.player1Image}`
    : avatarImg;
  const player2Avatar = gameLobbyParam?.player2Image
    ? `${serverUrl}${gameLobbyParam.player2Image}`
    : avatarImg;

  return (
    <main className="gamelobby-container">
      <div className="gamelobby-card">
        <h1 className="gamelobby-title">
          Salon <span className="neon-text">#{user.gameId}</span>
        </h1>
        <p className="gamelobby-subtitle">
          En attente des joueurs pour lancer le duel
        </p>

        <div className="gamelobby-players-grid">
          <div className="player-lobby-card host-card">
            <div className="gamelobby-avatar-wrapper">
              <img
                src={player1Avatar}
                alt="Host Avatar"
                className="gamelobby-player-avatar"
              />
              <span className="badge host-badge">Hôte</span>
            </div>
            <h3 className="player-name">
              {gameLobbyParam?.player1Name || "Chargement..."}
            </h3>
            <p className="player-deck-status">Deck prêt</p>
          </div>

          <div className="vs-separator">VS</div>

          {gameLobbyParam?.player2Id ? (
            <div className="player-lobby-card guest-card">
              <div className="gamelobby-avatar-wrapper">
                <img
                  src={player2Avatar}
                  alt="Guest Avatar"
                  className="gamelobby-player-avatar"
                />
                <span className="badge guest-badge">Adversaire</span>
              </div>
              <h3 className="player-name">{gameLobbyParam.player2Name}</h3>
              <p className="player-deck-status">Deck prêt</p>
            </div>
          ) : (
            <div className="player-lobby-card empty-card">
              <div className="pulse-spinner"></div>
              <p className="waiting-text">En attente d'un adversaire...</p>
            </div>
          )}
        </div>

        <div className="gamelobby-actions">
          {isHost ? (
            <button
              onClick={handleStartGame}
              disabled={!gameLobbyParam?.player2Id}
              className={`gamelobby-btn start-btn ${
                gameLobbyParam?.player2Id ? "active-glow" : "disabled-btn"
              }`}
            >
              Lancer la partie
            </button>
          ) : (
            <div className="guest-waiting-msg">
              <span className="mini-pulse"></span>
              En attente du lancement par l'hôte...
            </div>
          )}
          <button onClick={handleLeaveLobby} className="gamelobby-btn quit-btn">
            Quitter le salon
          </button>
        </div>
      </div>
    </main>
  );
}

export default GameLobby;
