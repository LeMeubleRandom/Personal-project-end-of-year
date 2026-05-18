import GlobalChat from '../components/GlobalChat';

import '../assets/css/home.css';

import avatarImg from '../assets/images/icon_profile.png';

function Home() {

    const username = "Joueur_Alpha";
    
    return (
    <main className="home-main">
      <section className="home-intro">
        <h1>Bienvenue dans Twisted Realms</h1>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta odio error corrupti ipsam veritatis laudantium illo voluptate quos corporis eligendi. Minima consectetur nostrum blanditiis, aut dolorum consequatur rerum architecto molestiae?
        </p>
      </section>
      <section className='home-profile'>
        <span className='home-player-name'>{username}</span>
        <img className="avatar" src={avatarImg} alt="Avatar" />
        <button className='home-btn'>
          Jouer en ligne
        </button>
      </section>
      <GlobalChat />
      <section className='no-name'>
        <p>en construction</p>
      </section>
    </main>
    );
}

export default Home