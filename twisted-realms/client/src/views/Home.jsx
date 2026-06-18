import GlobalChat from "../components/GlobalChat";
import Card from "../components/Card";
import { NavLink, useNavigate } from "react-router-dom";

import "../assets/css/home.css";

import avatarImg from "../assets/images/black_skull_dragon__rush_duel___artwork__by_nhociory_difdumv.png";
import { useState, useEffect, useMemo } from "react";

function Home({ user }) {
  const serverUrl = `http://${window.location.hostname}:5000/user-images/`;

  const actualImage = user?.userImage
    ? `${serverUrl}${user.userImage}`
    : avatarImg;
  const [image, setImage] = useState(actualImage);
  const [cardList, setCardList] = useState([]);
  const navigate = useNavigate();

  const randomCard = useMemo(() => {
    if (!cardList.length) return null;
    const randomIndex = Math.floor(Math.random() * cardList.length);
    return cardList[randomIndex];
  }, [cardList]);

  const enterLobby = async (e) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/lobby");
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

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <main>
      <section className="home-container">
        <div className="home-intro">
          <h1>Bienvenue dans Twisted Realms</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta
            odio error corrupti ipsam veritatis laudantium illo voluptate quos
            corporis eligendi. Minima consectetur nostrum blanditiis, aut
            dolorum consequatur rerum architecto molestiae?
          </p>
        </div>
        <div className="home-profile">
          <span className="home-player-name">
            {user?.name || "Non connecté"}
          </span>
          <article className="avatar-container">
            <img className="avatar" src={actualImage} alt="Avatar" />
          </article>
          <button className="home-btn" onClick={enterLobby}>
            Jouer en ligne
          </button>
        </div>
        <GlobalChat user={user} />
        <div className="no-name">
          {randomCard ? <Card card={randomCard} isMini={false} /> : <p>en construction</p>}
        </div>
      </section>
    </main>
  );
}

export default Home;
