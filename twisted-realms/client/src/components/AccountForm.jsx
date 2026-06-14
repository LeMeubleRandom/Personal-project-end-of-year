import { useState } from "react";
import { useNavigate } from "react-router-dom";
import avatarImg from "../assets/images/black_skull_dragon__rush_duel___artwork__by_nhociory_difdumv.png";

import "../assets/css/accountForm.css";

function AccountForm({ user, setUser, fetchUser }) {
  const navigate = useNavigate();
  const serverUrl = `http://${window.location.hostname}:5000/user-images/`;

  const actualImage = user?.userImage
    ? `${serverUrl}${user.userImage}`
    : avatarImg;

  const [image, setImage] = useState(actualImage);
  const [oldImage, setOldImage] = useState(actualImage);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    if (selectedFile) {
      formData.append("image", selectedFile);
      formData.append("oldImage", oldImage);
    }

    try {
      console.log(name, image, oldImage);
      const response = await fetch("/api/user/profile", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        fetchUser();
      } else {
        console.error("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const updateUserEmail = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    try {
      console.log(email);
      const response = await fetch("/api/user/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
        credentials: "include",
      });

      if (response.ok) {
        fetchUser();
      } else {
        console.error("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer définitivement votre compte ?",
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Compte supprimé");
        setUser(null);
        navigate("/");
      } else {
        const data = await response.json();
        console.error("Erreur :", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <article className="tab-content">
      <div className="tab-header">
        <h1>Détails du Compte</h1>
        <p>Mettez à jour vos informations</p>
      </div>

      <section className="profile-forms-container">
        <form
          id="profile-user-form"
          className="profile-form"
          onSubmit={updateUserProfile}
        >
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              placeholder="Entrez votre nouveau pseudo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <small className="form-help">
              Ce nom sera visible par les autres utilisateurs
            </small>
          </div>
          <div>
            <span>Image de Profil</span>
            <label htmlFor="image" className="profile-placeholder-image">
              <img className="profile-image" src={image} alt="Aperçu avatar" />
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept=".png, .jpeg, .jpg, .webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <button type="submit" className="btn-submit">
            Enregistrer
          </button>
        </form>

        <form
          id="profile-email-form"
          className="profile-form"
          onSubmit={updateUserEmail}
        >
          <div className="form-group">
            <label htmlFor="email">Adresse Email</label>
            <input
              type="email"
              id="email"
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <small className="form-help">
              Votre adresse email reste strictement confidentielle
            </small>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Modifier l'adresse
            </button>
          </div>
        </form>
        <div className="profile-form">
          <h2 className="delete-btn-name">Zone de danger</h2>
          <button
            type="button"
            className="btn-submit red"
            onClick={deleteAccount}
          >
            Supprimer le compte
          </button>
        </div>
      </section>
    </article>
  );
}

export default AccountForm;
