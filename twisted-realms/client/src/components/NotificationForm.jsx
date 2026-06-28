import { useState, useEffect } from "react";
import "../assets/css/notificationsForm.css";

function NotificationForm({ user, setUser, fetchUser }) {
  const [isGlobalChat, setIsGlobalChat] = useState(user?.isGlobalChat !== 0);

  useEffect(() => {
    if (user) {
      setIsGlobalChat(user.isGlobalChat !== 0);
    }
  }, [user]);

  const handleToggle = async (e) => {
    const newValue = e.target.checked;
    setIsGlobalChat(newValue);

    try {
      const response = await fetch("/api/user/globalchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isGlobalChat: newValue ? 1 : 0 }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        fetchUser();
      } else {
        console.error("Erreur lors de la mise à jour des préférences du chat :", data.message);
        setIsGlobalChat(!newValue);
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
      setIsGlobalChat(!newValue);
    }
  };

  return (
    <article className="tab-content" id="notification-tab-content">
      <div className="tab-header">
        <h1 id="notification-title">Préférences du Chat Global</h1>
        <p>Gérez vos préférences de communication.</p>
      </div>

      <section className="profile-forms-container">
        <div className="profile-form">
          <div className="form-group row-align-chat">
            <div className="form-text-info">
              <span className="info-title">Chat Général</span>
              <p className="form-help">
                Activez ou désactivez la réception et l'envoi de messages dans le chat général global.
              </p>
            </div>
            <label className="switch-chat">
              <input
                type="checkbox"
                checked={isGlobalChat}
                onChange={handleToggle}
              />
              <span className="slider-chat round-chat"></span>
            </label>
          </div>
        </div>
      </section>
    </article>
  );
}

export default NotificationForm;
