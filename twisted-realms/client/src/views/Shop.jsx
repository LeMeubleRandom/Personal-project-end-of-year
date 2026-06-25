import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../assets/css/shop.css";

function Shop({ user }) {
  const [activeTab, setActiveTab] = useState("Pack");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /*if (!user) {
    return <Navigate to="/login" replace />;
  }*/

  const categories = ["Recommended", "Pack", "Structure Deck"];

  const shopItems = {
    Recommended: [
      {
        id: "rec1",
        name: "Structure Deck: Mages de l'Arcane",
        price: 1000,
        description:
          "Un deck complet prêt à jouer axé sur les mages et la magie.",
        type: "Structure Deck",
        badge: "Nouveau",
      },
    ],
    Pack: [
      {
        id: "p1",
        name: "Booster: Souffle du Dragon",
        price: 100,
        description: "Contient 5 cartes de la faction Dragons.",
        type: "Booster",
      },
      {
        id: "p2",
        name: "Booster: Élite des Érudis",
        price: 100,
        description: "Contient 5 cartes de la faction Érudis.",
        type: "Booster",
      },
      {
        id: "p3",
        name: "Booster: Anomalie Mutante",
        price: 100,
        description: "Contient 5 cartes de la faction Mutants.",
        type: "Booster",
      },
      {
        id: "p4",
        name: "Booster: Mages de l'Arcane",
        price: 100,
        description: "Contient 5 cartes de la faction Mages.",
        type: "Booster",
      },
    ],
    "Structure Deck": [
      {
        id: "sd1",
        name: "Structure Deck: Mages de l'Arcane",
        price: 1000,
        description:
          "Un deck complet prêt à jouer axé sur les mages et la magie.",
        type: "Structure Deck",
      },
      {
        id: "sd2",
        name: "Structure Deck: Rage du Dragon",
        price: 1000,
        description:
          "Un deck complet axé sur la puissance offensive des dragons.",
        type: "Structure Deck",
      },
    ],
  };

  const currentItems = shopItems[activeTab] || [];

  return (
    <main className="shop-container">
      <div className="shop-header">
        <h2>Boutique</h2>
        <div className="user-points">
          <span>Points : </span>
          <span className="points-amount">{user.credits || 0}</span>
        </div>
      </div>

      <div className="shop-main-layout">
        {isSidebarOpen && (
          <div
            className="shop-sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <button
          className={`shop-sidebar-toggle ${isSidebarOpen ? "open" : ""}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={
            isSidebarOpen ? "Fermer les catégories" : "Ouvrir les catégories"
          }
        >
          <svg
            className={`toggle-arrow ${isSidebarOpen ? "open" : ""}`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isSidebarOpen ? (
              <polyline points="9 5 16 12 9 19"></polyline>
            ) : (
              <polyline points="15 5 8 12 15 19"></polyline>
            )}
          </svg>
        </button>

        <div className={`shop-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <h3>Catégories</h3>
          <div className="shop-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`shop-tab ${category.toLowerCase().replace(" ", "-")} ${activeTab === category ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(category);
                  setIsSidebarOpen(false);
                }}
              >
                <span className="tab-text">{category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="shop-content">
          <div className="active-category-header">
            <h3>{activeTab}</h3>
          </div>

          <div className="shop-items-grid">
            {currentItems.map((item) => (
              <div key={item.id} className="shop-item-card">
                {item.badge && <span className="item-badge">{item.badge}</span>}
                <div className="item-type">{item.type}</div>
                <h4 className="item-name">{item.name}</h4>
                <p className="item-description">{item.description}</p>
                <div className="item-footer">
                  <div className="item-price">
                    <span className="price-val">{item.price}</span> pts
                  </div>
                  <button
                    className="buy-btn"
                    onClick={() =>
                      alert(
                        `Achat de : ${item.name} pour ${item.price} points.`,
                      )
                    }
                  >
                    Acheter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Shop;
