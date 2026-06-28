import { NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AccountForm from "../components/AccountForm";
import SecurityForm from "../components/SecurityForm";
import NotificationForm from "../components/NotificationForm";

import "../assets/css/profile.css";

function Profile({ user, setUser, fetchUser }) {
  const [category, setCategory] = useState("account");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".profile-nav")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <main>
      <section className="profile-container">
        <div className={`profile-nav ${isOpen ? "open" : ""}`}>
          <div
            className="profile-nav-header"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h2>Settings</h2>
            <div className="profile-dropdown-arrow-wrapper">
              <svg
                className="profile-dropdown-arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          <ul className="profile-categories-container">
            <li
              className={`profile-categories ${category === "account" ? "active" : ""}`}
              onClick={() => {
                setCategory("account");
                setIsOpen(false);
              }}
            >
              Mon Compte
            </li>
            <li
              className={`profile-categories ${category === "security" ? "active" : ""}`}
              onClick={() => {
                setCategory("security");
                setIsOpen(false);
              }}
            >
              Sécurité
            </li>
            <li
              className={`profile-categories ${category === "social" ? "active" : ""}`}
              onClick={() => {
                setCategory("social");
                setIsOpen(false);
              }}
            >
              Social
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

          {category === "social" && (
            <NotificationForm user={user} setUser={setUser} fetchUser={fetchUser} />
          )}
        </div>
      </section>
    </main>
  );
}

export default Profile;
