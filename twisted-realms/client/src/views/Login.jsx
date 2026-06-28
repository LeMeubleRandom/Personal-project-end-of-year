import GlobalChat from "../components/GlobalChat";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import "../assets/css/login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("test");

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.status === "success") {
          setUser(userData.user);
        }
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors de la connexion");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  return (
    <main>
      <section className="login-main">
        <article className="login-layout">
          <h1>Connectez-vous</h1>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              name="email"
              className="login-form-input"
              id="login-form-email"
              placeholder="Entrez votre Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              name="password"
              className="login-form-input"
              id="login-form-password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="login-btns">
              <button type="submit" className="login-submit" id="login-login">
                Connexion
              </button>

              <NavLink
                to="/Register"
                className="login-submit"
                id="login-register"
              >
                S'inscrire
              </NavLink>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}

export default Login;
