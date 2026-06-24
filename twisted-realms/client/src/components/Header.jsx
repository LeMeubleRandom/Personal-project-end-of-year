import { NavLink } from "react-router-dom";
import "../assets/css/header.css";

function Header({ user }) {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-logo">
          <NavLink to="/">
            <span className="brand-name">Twisted Realms</span>
          </NavLink>
        </div>

        <ul className="navbar-links">
          <li>
            <NavLink
              to="/"
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
