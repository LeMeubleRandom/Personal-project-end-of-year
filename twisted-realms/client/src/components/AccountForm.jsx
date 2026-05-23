import { useState } from 'react';
import avatarImg from '../assets/images/black_skull_dragon__rush_duel___artwork__by_nhociory_difdumv.png';

import '../assets/css/accountForm.css';

function AccountForm({ user, setUser, fetchUser }) {
    
    const serverUrl = `http://${window.location.hostname}:5000/user-images/`;
    
    
    const actualImage = user?.userImage ? `${serverUrl}${user.userImage}` : avatarImg;

    const [image, setImage] = useState(actualImage);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
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
        formData.append('name', name);
        if (selectedFile) {
            formData.append('image', selectedFile); 
        }

        try {
            console.log(name, image);
            const response = await fetch('/api/user/profile', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                if (selectedFile && user?.userImage) {
                    await deleteUserImage(); 
                }
                fetchUser(); 
            } else {
                console.error("Erreur lors de la mise à jour du profil");
            }
        }

        catch (error) {
            console.error("Erreur de connexion au serveur :", error);
        }
    }

    const deleteUserImage = async (e) => {
        try {
            const response = await fetch(`/api/user/deleteImage/${user.userImage}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Fichier supprimé");
            } else {
                console.error("Erreur :", data.message);
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    }

    return (
    <article className="tab-content">
        <div className='tab-header'>
            <h1>Détails du Compte</h1>
            <p>Mettez à jour vos informations</p>
        </div>

        <section className="profile-forms-container">

            <form 
                  id="profile-user-form" 
                  className='profile-form' 
                  onSubmit={updateUserProfile}
            >
                <div className='form-group'>
                    <label htmlFor='username'>Nom d'utilisateur</label>
                    <input
                    type='text'
                    id='username'
                    placeholder='Entrez votre nouveau pseudo'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                    <small className="form-help">Ce nom sera visible par les autres utilisateurs</small>
                </div>
                <div>
                    <span>Image de Profil</span>
                    <label htmlFor="image" className="profile-placeholder-image">
                        <img src={image} alt="Aperçu avatar" className="profile-image" />
                    </label>
                    <input 
                        type="file"
                        id='image'
                        name='image'
                        accept='.png, .jpeg, .jpg, .webp'
                        onChange={handleImageChange}
                        style={{ display: 'none' }} 
                    />
                </div>
                <button type='submit' className='btn-submit'>
                    Enregistrer
                </button>
            </form>

            <form 
                  id="profile-email-form" 
                  className='profile-form' 
                  onSubmit={(e) => { e.preventDefault(); console.log("Email modifié"); }}
            >
                <div className='form-group'>
                <label htmlFor='email'>Adresse Email</label>
                <input 
                    type='email' 
                    id='email' 
                    placeholder='nom@exemple.com'
                    defaultValue={user?.email || ''} 
                />
                <small className="form-help">Votre adresse email reste strictement confidentielle</small>
                </div>
                <div className='form-actions'>
                <button type='submit' className='btn-submit'>
                    Modifier l'adresse
                </button>
                </div>
            </form>
        </section>
    </article>
    )
}

export default AccountForm;