-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 15 mai 2026 à 19:42
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `twisted-realms`
--

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `userImage` varchar(510) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL,
  `isGlobalChat` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `userImage`, `role`, `date`, `isGlobalChat`) VALUES
(1, 'LeMeubleRandom', 'meuble5002@gmail.com', '$2b$10$nGzEAg.zV06AKvpEseEDLO0EphcSr4aMd9RwWFzEmT.PiSR1Gg.d6', '1779414064548-127445822.png', 'user', '2026-05-21 11:48:27', 1);

-- --------------------------------------------------------

--
-- Structure de la table `card`
--

CREATE TABLE `card` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;

--
-- Déchargement des données de la table `card`
--

-- --------------------------------------------------------

--
-- Structure de la table `collection`
--

CREATE TABLE `user_collection` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `cardId` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;

--
-- Déchargement des données de la table `collection`
--

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `postDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;

--
-- Déchargement des données de la table `collection`
--

-- --------------------------------------------------------

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `users`
--

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `card`
--

ALTER TABLE `card`
  ADD PRIMARY KEY (`id`);

--
-- Index pour table `collection`
--

ALTER TABLE `user_collection`
  ADD PRIMARY KEY (`id`);

--
-- Index pour table `message`
--

ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

-- --------------------------------------------------------

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `users`
--

ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

--
-- AUTO_INCREMENT pour la table `card`
--

ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

--
-- AUTO_INCREMENT pour la table `collection`
--

ALTER TABLE `user_collection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

--
-- AUTO_INCREMENT pour la table `message`
--

ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
