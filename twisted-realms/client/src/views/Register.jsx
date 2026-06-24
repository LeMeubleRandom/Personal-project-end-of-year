import GlobalChat from "../components/GlobalChat";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import "../assets/css/register.css";

function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      if (response.ok) {
        console.log("test de réponse");
        navigate("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  return (
    <main>
      <section className="register-main">
        <article className="register-layout">
          <h1>Bienvenue, nouvel utilisateur</h1>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleRegister} className="register-form">
            <input
              type="text"
              name="name"
              className="register-form-input"
              id="register-form-name"
              placeholder="Entrez votre Pseudo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              name="email"
              className="register-form-input"
              id="register-form-email"
              placeholder="Entrez un Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              name="password"
              className="register-form-input"
              id="register-form-password"
              placeholder="Entrez un mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="register-btns">
              <button
                type="submit"
                className="register-submit"
                id="register-register"
              >
                Inscription
              </button>

              <NavLink
                to="/login"
                className="register-submit"
                id="register-login"
              >
                Se connecter
              </NavLink>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}

export default Register;
