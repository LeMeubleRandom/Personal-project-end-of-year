import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../assets/css/header.css";

function Header({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      {isMenuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
      <nav className="navbar">
        <div className="navbar-logo">
          <NavLink to="/" onClick={closeMenu}>
            <span className="brand-name">Twisted Realms</span>
          </NavLink>
        </div>

        <button
          className={`navbar-burger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shop"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Boutique
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/collection"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Ma Collection
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/decks"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Mes Decks
            </NavLink>
          </li>
          <li>
            <NavLink
              to={user ? "/profile" : "/login"}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              {user ? "Mon Profil" : "Se Connecter"}
            </NavLink>
          </li>
        </ul>

        <div className="navbar-profile">
          <NavLink to={user ? "/profile" : "/login"}>
            {user?.name || "Non connecté"}
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Header;
