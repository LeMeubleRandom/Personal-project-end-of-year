import { NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AccountForm from "../components/AccountForm";
import SecurityForm from "../components/SecurityForm";

import "../assets/css/profile.css";

function Profile({ user, setUser, fetchUser }) {
  const [category, setCategory] = useState("account");
  const [loading, setLoading] = useState(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main>
      <section className="profile-container">
        <div className="profile-nav">
          <h2>Settings</h2>
          <ul className="profile-categories-container">
            <li
              className={`profile-categories ${category === "account" ? "active" : ""}`}
              onClick={() => setCategory("account")}
            >
              Mon Compte
            </li>
            <li
              className={`profile-categories ${category === "security" ? "active" : ""}`}
              onClick={() => setCategory("security")}
            >
              Sécurité
            </li>
            <li
              className={`profile-categories ${category === "notification" ? "active" : ""}`}
              onClick={() => setCategory("notification")}
            >
              Notifications
            </li>
          </ul>
        </div>
        <div className="category-detail" id={`category-${category}-detail`}>
          {category === "account" && (
            <AccountForm user={user} setUser={setUser} fetchUser={fetchUser} />
          )}

          {category === "security" && (
            <SecurityForm user={user} setUser={setUser} fetchUser={fetchUser} />
          )}

          {category === "notification" && (
            <div className="tab-content">
              <h1>Alertes & Notifications</h1>
              <p>Gérez vos préférences de réception des messages du chat.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Profile;
