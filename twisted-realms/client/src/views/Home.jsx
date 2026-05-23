import GlobalChat from '../components/GlobalChat';
import { NavLink } from 'react-router-dom';

import '../assets/css/home.css';

import avatarImg from '../assets/images/black_skull_dragon__rush_duel___artwork__by_nhociory_difdumv.png';
import { useState, useEffect } from 'react';

function Home({ user }) {

    const serverUrl = `http://${window.location.hostname}:5000/user-images/`;
    
    const actualImage = user?.userImage ? `${serverUrl}${user.userImage}` : avatarImg;
    const [image, setImage] = useState(actualImage);
    
    return (
    <main>
      <section className='home-container'>
        <div className="home-intro">
          <h1>Bienvenue dans Twisted Realms</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta odio error corrupti ipsam veritatis laudantium illo voluptate quos corporis eligendi. Minima consectetur nostrum blanditiis, aut dolorum consequatur rerum architecto molestiae?
          </p>
        </div>
        <div className='home-profile'>
          <span className='home-player-name'>{user?.name || "Non connecté"}</span>
          <article className='avatar-container'>
            <img className="avatar" src={actualImage} alt="Avatar" />
          </article>
          <NavLink to="/lobby" className='home-btn'>
            Jouer en ligne
          </NavLink>
        </div>
        <GlobalChat user={user} />
        <div className='no-name'>
          <p>en construction</p>
        </div>
      </section>
    </main>
    );
}

export default Home