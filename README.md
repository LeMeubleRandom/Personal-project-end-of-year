# 🌌 Twisted Realms

> **🌐 Site en production :** Le site est déployé et accessible à l'adresse suivante : [twisted-realms.vercel.app](https://twisted-realms.vercel.app)

---

## 📝 Présentation du projet

**Twisted Realms** est une application web de Jeu de Cartes à Collectionner (TCG) originale et immersive, entièrement jouable directement depuis votre navigateur. Inspirée de plateformes compétitives comme Dueling Nexus ou Dueling Book, elle permet aux joueurs de s'inscrire, de gérer leur collection de cartes, de concevoir des decks personnalisés et d'affronter d'autres joueurs en temps réel grâce à un système de combat au tour par tour fluide et dynamique.

---

## 🔮 L'Univers et les Factions

Le jeu s'articule autour de **6 factions uniques** dotées de leur propre lore et de mécaniques de combat complémentaires :

1. **Les Dragons** 🐉 : Créatures massives et destructrices. Leur magie est lourde et instable, mais incroyablement ravageuse sur le champ de bataille.
2. **Les Kasmigenas** 🏛️ : Une civilisation ancestrale dont les pouvoirs modèlent la réalité. Leurs ancêtres sont considérés comme les bâtisseurs du monde.
3. **Les Mutants** 🧬 : Des anomalies génétiques dotées d'une capacité d'adaptation terrifiante, capables de s'adapter pour détruire des nations entières.
4. **Les Érudis** ⚙️ : Scientifiques et ingénieurs convaincus que la technologie surpasse la magie. Ils luttent pour le progrès et la protection de leur peuple.
5. **Les Mages** 🧙 : Rivaux éternels des Érudis, ils tirent leur fierté de sorts complexes façonnant leur existence.
6. **Les Potentias** 🌌 : Une faction mystérieuse et neutre. Ils agissent comme protecteurs et guides, conférant un sentiment d'immortalité à leurs alliés.

---

## 🎮 Règles et Système de Jeu

Les duels de **Twisted Realms** reposent sur des mécaniques de tour par tour intenses :

- **Préparation du Deck** : Chaque deck est composé de **30 cartes**.
- **Conditions de Victoire** : Chaque joueur débute avec **2000 Points de Vie (PV)**. Le premier à réduire les PV de son adversaire à 0 remporte la partie.
- **Mécanique d'Accélérateur** : Pour déployer des êtres ou des sorts puissants, le joueur doit charger ses compteurs. En plaçant une carte comme _Accélérateur_, celle-ci est renvoyée sous son deck et génère des compteurs d'énergie utilisables durant le tour.
- **Les Zones du Plateau** :
  - **Zone Principale (Êtres)** : Jusqu'à 5 emplacements pour invoquer ses créatures combattantes.
  - **Zone de Soutien (Sorts/Soutiens)** : 3 emplacements pour activer des effets tactiques.
  - **Main, Deck, Cimetière et Ostrac (bannissement)**.
- **Les Phases d'un Tour** :
  1.  **Draw Phase** : Pioche de cartes pour alimenter sa main (ajustement automatique à 5 cartes au besoin).
  2.  **Main Phase** : Invocation de créatures (_Êtres_), activation de sorts (_Soutiens_) et chargement des compteurs (_Accélérateurs_).
  3.  **Battle Phase** : Lancement des attaques. Un joueur peut cibler les créatures adverses ou attaquer les PV de l'adversaire directement s'il n'y a pas de bloqueur. Les cartes s'infligent des dégâts simultanément lors d'un combat (chaque 100 points d'ATK inflige 1 dégât de PV à la créature ciblée).
  4.  **End Phase** : Résolution de fin de tour et vérification de la taille de la main.

---

## ✨ Fonctionnalités Clés

### 👤 Gestion des Utilisateurs & Profils

- **Inscription & Connexion sécurisées** : Chiffrement des mots de passe avec `bcrypt` et maintien de session via JSON Web Tokens (JWT) stockés dans des cookies sécurisés.
- **Profil personnalisé** : Modification de l'avatar (upload d'images géré via `multer`), historique de progression, et sélection du deck actif.

### 🃏 Éditeur de Deck & Collection

- **Visualisation de Collection** : Tri et filtrage par faction, type, coût, gestion des cartes favorites, et affichage des exemplaires possédés.
- **Créateur de Decks** : Outil ergonomique pour ajouter ou retirer des cartes, définir le nom de son deck et lui attribuer une carte maîtresse.

### 🛒 Boutique de Cartes (Shop)

- **Dépense de Crédits** : Gagnez des crédits en jouant pour acheter des _Structure Decks_ complets ou des _Boosters_ de factions spécifiques afin d'enrichir votre collection.

### 🌐 Mode Multijoueur & Chat en Temps Réel

- **Salons de Jeu (Lobby)** : Rejoignez des salons créés par d'autres joueurs ou hébergez le vôtre (Host) pour démarrer un duel en tête-à-tête.
- **WebSockets (Socket.io)** : synchronisation immédiate des actions de jeu, de la pioche, du déploiement, des attaques et de la fin de tour.
- **Chat Global** : Discutez instantanément avec l'ensemble des joueurs connectés depuis la page d'accueil ou le lobby.

---

## 🛠️ Architecture Technique

L'application est construite sur une architecture découplée moderne :

### Frontend (`/client`)

- **Framework** : React avec Vite
- **Gestion des Routes** : React Router Dom v7
- **Communication Temps Réel** : `socket.io-client`
- **Style** : CSS3 Vanilla pour des designs uniques et dynamiques

### Backend (`/server`)

- **Serveur HTTP/WS** : Express & Socket.io sous Node.js
- **Authentification & Sécurité** : JWT, `cookie-parser`, `bcrypt`
- **Téléchargements d'images** : `multer`

### Base de données & Cache

- **MySQL** (`mysql2`) : Gestion relationnelle des profils, de la collection globale des cartes, des decks sauvegardés et de l'historique des matchs.
- **Redis** (`redis`) : Utilisé pour la gestion d'états rapides et la mise en cache.

---

## 🚀 Installation et Lancement Local

### Prérequis

- [Node.js](https://nodejs.org/) (version 18+)
- [MySQL](https://www.mysql.com/)
- [Redis](https://redis.io/)

### 1. Cloner le projet

```bash
git clone https://github.com/votre-depot/twisted-realms.git
cd twisted-realms
```

### 2. Base de données

1. Démarrez votre serveur MySQL.
2. Créez une base de données nommée `twisted-realms`.
3. Importez le fichier SQL disponible dans le dossier `/sql_file` pour initialiser le schéma et les données de test (les cartes par défaut, decks et boosters) :
   ```bash
   mysql -u root -p twisted-realms < sql_file/latestdb.sql
   ```

### 3. Configurer le Backend (`/server`)

1. Rendez-vous dans le dossier du serveur :
   ```bash
   cd server
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` basé sur `.env.example` et remplissez vos informations de connexion (MySQL, Redis, Secret JWT) :
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=twisted-realms
   DB_USER=votre_utilisateur
   DB_PASS=votre_mot_de_passe
   JWT_SECRET=votre_cle_secrete
   # Optionnels si gérés en local :
   # DATABASE_URL=
   # REDIS_URL=
   REDIS_HOST=127.0.0.1
   ```
4. Démarrez le serveur (avec nodemon pour le développement) :
   ```bash
   npm start
   ```

### 4. Configurer le Frontend (`/client`)

1. Ouvrez un nouveau terminal et accédez au dossier client :
   ```bash
   cd client
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Démarrez le serveur de développement Vite :
   ```bash
   npm run dev
   ```
4. Ouvrez votre navigateur sur l'adresse locale indiquée (généralement `http://localhost:5173`).

```,StartLine:1,TargetContent:

```
