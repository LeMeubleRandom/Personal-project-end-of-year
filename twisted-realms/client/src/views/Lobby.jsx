import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import GlobalChat from "../components/GlobalChat";
import "../assets/css/lobby.css";

function Lobby({ user, fetchUser }) {
  const navigate = useNavigate();
  const [lobbys, setLobbys] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [gameState, setGameState] = useState(false);

  const fetchLobby = async () => {
    try {
      const response = await fetch("/api/game", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      setLobbys(data);
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const hostLobby = async (e) => {
    if (!user?.activeDeck) {
      console.log("active deck null");
      return;
    }
    try {
      const response = await fetch("/api/game/host", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          activeDeck: user.activeDeck,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur HTTP : ${response.status}`,
        );
      }
      const data = await response.json();
      console.log("Created game:", data);
      fetchLobby();
      if (fetchUser) await fetchUser();
      navigate("/GameLobby");
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
      alert(error.message);
    }
  };

  const joinLobby = async (gameId) => {
    try {
      const response = await fetch("/api/game/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          activeDeck: user.activeDeck,
          gameId: gameId,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur HTTP : ${response.status}`,
        );
      }
      const data = await response.json();
      console.log("Joined game:", data);
      if (fetchUser) await fetchUser();
      navigate("/GameLobby");
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchLobby();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.inGame) {
    return <Navigate to="/GameLobby" replace />;
  }

  return (
    <main className="lobby-main">
      <div className="lobby-content">
        <div className="lobby-left-section">
          <div className="lobby-header-actions">
            <button className="lobby-btn host" onClick={hostLobby}>
              Créer un salon (Host)
            </button>
          </div>

          <div className="lobby-list-container">
            <h2>Salons Disponibles</h2>
            {lobbys.length === 0 ? (
              <div className="no-lobbies">
                Aucun salon n'est disponible pour le moment.
              </div>
            ) : (
              <div className="lobbies-grid">
                {lobbys.map((lobby) => (
                  <div key={lobby.id} className="lobby-card">
                    <div className="lobby-info">
                      <div className="lobby-id">Salon #{lobby.gameId}</div>
                      <div className="lobby-host">
                        Hôte :{" "}
                        <span>
                          {lobby.player1Name || `Joueur #${lobby.player1Id}`}
                        </span>
                      </div>
                    </div>
                    <button
                      className="lobby-btn join"
                      onClick={() => joinLobby(lobby.gameId)}
                    >
                      Rejoindre
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lobby-right-section">
          <GlobalChat user={user} />
        </div>
      </div>
    </main>
  );
}

export default Lobby;
