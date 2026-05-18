import { NavLink } from 'react-router-dom';
import '../assets/css/navbar.css'

function Navbar() {
  const username = "Joueur_Alpha";

  return (
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
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/shop" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            Boutique
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/collection" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            Ma Collection
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/profile"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            mon profil
          </NavLink>
        </li>
      </ul>

      <div className="navbar-profile">
        <span>{username}</span>
      </div>

    </nav>
  );
}

export default Navbar;