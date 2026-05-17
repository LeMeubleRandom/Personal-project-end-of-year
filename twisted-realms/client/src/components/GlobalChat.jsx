import '../assets/css/globalChat.css'

function GlobalChat() {
    return (
      <section className='global-chat'>
        <h3>Chat Général</h3>
        
        <section className="global-chat-messages">
          <div className='user-message-bulle'>
            <span className="user-message-author">Joueur_Alpha</span>
            <p className='user-message-text'>Salut ! Quelqu'un pour un duel ? Je viens de terminer mon deck Nécromancie.</p>
          </div>
          <div className='message-bulle'>
            <span className="message-author">Maitre_Sombre</span>
            <p className='message-text'>Je suis chaud. Rejoins le lobby 4, le mot de passe est "twisted".</p>
          </div>
          <div className='message-bulle'>
            <span className="message-author">Joueur_Alpha</span>
            <p className='message-text'>J'arrive ! Prépare-toi à souffrir 💀</p>
          </div>
          <div className='message-bulle'>
            <span className="message-author">CardMaster99</span>
            <p className='message-text'>Salut tout le monde. Est-ce que quelqu'un sait si le patch pour nerfer le Dragon des Abysses est déjà en ligne ?</p>
          </div>
          <div className='message-bulle'>
            <span className="message-author">Elfe_Rousse</span>
            <p className='message-text'>Non, la mise à jour est prévue pour demain matin à 8h. Profites-en pour le jouer encore un peu avant qu'il devienne injouable haha !</p>
          </div>
          <div className='message-bulle'>
            <span className="message-author">Guerrier_Zen</span>
            <p className='message-text'>C'est pas trop tôt honnêtement... Cette carte ruine totalement la méta actuelle. Dès que l'adversaire la pose au tour 5 avec un boost de mana, la partie est quasiment terminée. Impossible de contrer son effet de zone sans avoir un sort de bannissement en main de départ.</p>
          </div>
          <div className='user-message-bulle'>
            <span className="user-message-author">Joueur_Alpha</span>
            <p className='user-message-text'>GG Maitre_Sombre ! Ton combo avec l'Artefact des Ombres m'a pris par surprise, bien joué.</p>
          </div>
        </section>

        <form className="global-chat-form" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            className="global-chat-input"
            placeholder="Écrivez votre message..." 
          />
          <button type="submit" className="global-chat-submit-btn">
            Envoyer
          </button>
        </form>

      </section>
    )
}

export default GlobalChat