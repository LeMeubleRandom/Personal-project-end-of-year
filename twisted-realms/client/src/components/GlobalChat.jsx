import "../assets/css/globalChat.css";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { NavLink, useNavigate } from "react-router-dom";

const socket = io(`http://${window.location.hostname}:5000`, {
  withCredentials: true,
});

function GlobalChat({ user }) {
  const [messageText, setMessageText] = useState("");
  const [messageList, setMessagesList] = useState([]);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (messageText.trim() === "") return;

    const messageData = {
      id: Date.now(),
      name: user.name,
      message: messageText,
    };

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          message: messageText,
        }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Réponse du serveur :", data);

      socket.emit("chat message", messageData);

      setMessageText("");
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const fetchMessages = async (e) => {
    try {
      const response = await fetch("/api/message", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      setMessagesList(data);
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    fetchMessages();

    socket.on("connect", () => {
      console.log("Connecté au serveur Socket.io");
    });

    socket.on("chat message", (newMessage) => {
      console.log(newMessage);
      setMessagesList((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("connect");
      socket.off("chat message");
    };
  }, []);

  /*useEffect(() => {
      fetchMessages();
    }, [user]);*/

  /*const response = await fetch("http://localhost:5000/api/message", {
        method: "GET",
        headers: {
            "Authorization": "Bearer ton_token_secret"
        }
    });*/

  return (
    <section className="global-chat">
      <h3>Chat Général</h3>

      <section className="global-chat-messages">
        {messageList.map((m) => (
          <div
            className={`${m.name === user?.name ? "user-" : ""}message-bulle`}
            key={`${m.id}-div`}
          >
            <span
              className={`${m.name === user?.name ? "user-" : ""}message-author`}
              key={`${m.id}-span`}
            >
              {m.name}
            </span>
            <p
              className={`${m.name === user?.name ? "user-" : ""}message-text`}
              key={`${m.id}-p`}
            >
              {m.message}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </section>

      <form className="global-chat-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="global-chat-input"
          placeholder="Écrivez votre message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="submit" className="global-chat-submit-btn">
          Envoyer
        </button>
      </form>
    </section>
  );
}

export default GlobalChat;
