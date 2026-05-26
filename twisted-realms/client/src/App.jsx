import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navigate } from "react-router-dom";

//Import des pages
import Home from "./views/Home";
import Collection from "./views/Collection";
import Shop from "./views/Shop";
import Profile from "./views/Profile";
import Lobby from "./views/Lobby";
import Login from "./views/Login";
import Register from "./views/Register";
import NotFound from "./views/NotFound";

//Import des composants
import Header from "./components/Header";

function AppContent() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (e) => {
    try {
      const response = await fetch("/api/user/me", {
        credentials: "include",
      });

      if (response.status === 401) {
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "success") {
        setUser(data.user);
        //console.log(data.user);
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return <div>Chargement de l'application...</div>;
  }

  return (
    <>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login setUser={setUser} />
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collection" element={<Collection />} />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} setUser={setUser} fetchUser={fetchUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/lobby" element={<Lobby user={user} />} />
        <Route path="/.." element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
