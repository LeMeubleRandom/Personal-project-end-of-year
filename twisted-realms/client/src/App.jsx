//import { useState } from 'react'

function App() {

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const valeurDeLinput = formData.get('test');

    try {
      const response = await fetch('/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: valeurDeLinput }),
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
      <div>
        <label htmlFor="test">Test</label>
        <input type="text" name="test" id="test" required/>
      </div>
      <button type="submit">
        Connected
      </button>
    </form>
  )
}

export default App
