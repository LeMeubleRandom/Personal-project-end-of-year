import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import '../assets/css/securityForm.css';

function SecurityForm({user, setUser, fetchUser}) {

    const navigate = useNavigate();

    const logout = async (e) => {
        try {
            const response = await fetch('/api/user/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                console.log("Déconnecté");
                setUser(null);
                navigate('/');
            } else {
                console.error("Erreur :", data.message);
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    }

    return (
        <article className="tab-content" id="security-tab-content">
            <div className="tab-header">
                <h1 id="security-title">Sécurité de vos informations</h1>
                <p>Options de sécurité</p>
            </div>

            <section className="profile-forms-container">

                <button 
                    className="btn-submit red"
                    onClick={logout}
                >
                    Se déconnecter
                </button>

            </section>
        </article>
    );
}

export default SecurityForm;