//import { useState } from 'react'

function App() {

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: "Hello Backend!" }),
      });

      const data = await response.json();
      console.log("Réponse du serveur :", data);
      alert("Connecté avec succès !");
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="form"
    >
      <button type="submit">
        Connected
      </button>
    </form>
  )
}

export default App
