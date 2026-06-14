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
  `createdAt` datetime NOT NULL,
  `isGlobalChat` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `userImage`, `role`, `createdAt`, `isGlobalChat`) VALUES
(2, 'Jamie', 'antoinedbc2005@gmail.com', '$2b$10$9m2pcJFV8a83mSBq56wElO/gq3XU7Ydubg7BdyAAlk/DTwCBfIhIG', '1779741525599-931313353.webp', 'user', '2026-05-22 07:56:49', 1),
(3, 'Sofiane', 'test@gmail.com', '$2b$10$/rRdJccmpBZWH762zZFWHuXhTG0B9emTAjRtR1v3he1ZcXCr7abWW', '1779440163457-795085330.jpeg', 'user', '2026-05-22 08:55:27', 1),
(4, 'JsuisVieux', 'jeremygirard89100@gmail.com', '$2b$10$cxPLcSQz.JC1LNBntb9.0.tNAFA46ZH3fDd3uMo6LcQEC.W8I/OKW', '1779442514076-829402163.jpg', 'user', '2026-05-22 09:34:30', 1),
(5, 'boris', 'boris.rose.dev@gmail.com', '$2b$10$3F0PauDwP8K0YHcYFQ3areGGylWunMmhLsfINv915WHxHutlgu8xS', '1779442889677-543814697.jpeg', 'user', '2026-05-22 09:39:58', 1);

-- --------------------------------------------------------

--
-- Structure de la table `deck`
--

CREATE TABLE `deck` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `cardList` JSON DEFAULT ('[]'),
  `mainCard` int(11) DEFAULT NULL,
  `postDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `deck`
--

INSERT INTO `deck` (`id`, `userId`, `name`, `cardList`, `postDate`) VALUES
(1, 2, 'Deck Arcanique', '[35, 31, 38, 32, 40, 33, 37, 35, 39, 34, 36, 31, 32, 38, 40, 33, 36, 37, 39, 34, 35, 31, 38, 32, 40, 33, 37, 39, 34, 36]', '2026-05-31 12:00:00'),
(2, 2, 'Deck Draconique', '[12, 15, 11, 19, 14, 16, 20, 13, 18, 17, 11, 12, 15, 13, 16, 14, 19, 20, 17, 18, 15, 11, 16, 12, 19, 13, 20, 14, 18, 17]', '2026-06-11 12:00:00');


-- --------------------------------------------------------

--
-- Structure de la table `card`
--

CREATE TABLE `card` (
  `id` int(11) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `faction` VARCHAR(100) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `atk` int(11) NOT NULL,
  `PV` int(11) NOT NULL,
  `effect` VARCHAR(255) NOT NULL,
  `cost` int(11) NOT NULL,
  `accelerator` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `card`
--

INSERT INTO `card` (`id`, `name`, `faction`, `type`, `atk`, `PV`, `effect`, `cost`, `accelerator`) VALUES
(1, "Nyxos, Engeance noir", "Kasmigena", "Être", 250, 2, "Défaussez une carte, remettez en jeu une carte Être depuis votre cimetière, mais ses PV sont réduits à 1.", 1, 1),
(2, "Golem de Basalte", "Kasmigena", "Être", 180, 5, "", 2, 2),
(3, "Architecte Primordial", "Kasmigena", "Être", 150, 6, "", 2, 2),
(4, "Monolithe Résonnant", "Kasmigena", "Être", 100, 7, "", 3, 3),
(5, "Gardien des Fresques", "Kasmigena", "Être", 180, 4, "", 1, 1),
(6, "Tisseur de Lignes Ley", "Kasmigena", "Être", 190, 3, "", 1, 1),
(7, "Titan d'Ardoise", "Kasmigena", "Être", 250, 5, "", 3, 3),
(8, "Forge-Monde", "Kasmigena", "Être", 220, 4, "", 2, 2),
(9, "Voix des Ancêtres", "Kasmigena", "Être", 170, 5, "", 2, 2),
(10, "Garde-Ruine d'Airain", "Kasmigena", "Être", 210, 3, "", 1, 1),
(11, "Tyran du Brasier", "Dragons", "Être", 280, 2, "", 2, 2),
(12, "Mâchoire d'Obsidienne", "Dragons", "Être", 250, 3, "", 2, 2),
(13, "Écaille-Tonnerre", "Dragons", "Être", 260, 2, "", 1, 1),
(14, "Crache-Magma", "Dragons", "Être", 240, 2, "", 1, 1),
(15, "Cataclysme Ailé", "Dragons", "Être", 310, 1, "", 3, 3),
(16, "Wyverne Cendrée", "Dragons", "Être", 220, 2, "", 1, 1),
(17, "Mange-Sorts Draconique", "Dragons", "Être", 230, 3, "", 2, 2),
(18, "Tempête d'Écailles", "Dragons", "Être", 270, 1, "", 2, 2),
(19, "Sang-Bouillant", "Dragons", "Être", 290, 1, "", 2, 2),
(20, "Frappe-Météore", "Dragons", "Être", 300, 2, "", 3, 3),
(21, "Mécabot d'Infanterie", "Erudis", "Être", 190, 3, "", 1, 1),
(22, "Drone de Reconnaissance", "Erudis", "Être", 140, 2, "", 1, 1),
(23, "Matrice Défensive", "Erudis", "Être", 100, 6, "", 2, 2),
(24, "Canon à Ions Lourd", "Erudis", "Être", 260, 1, "", 2, 2),
(25, "Ingénieur Holographique", "Erudis", "Être", 160, 3, "", 1, 1),
(26, "Paladin Cybernétique", "Erudis", "Être", 210, 4, "", 2, 2),
(27, "Noyau d'Énergie Instable", "Erudis", "Être", 280, 1, "", 3, 3),
(28, "Titan d'Acier Brossé", "Erudis", "Être", 250, 5, "", 3, 3),
(29, "Nettoyeur Plasma", "Erudis", "Être", 220, 2, "", 1, 1),
(31, "Apprenti des Astres", "Mages", "Être", 170, 2, "", 1, 1),
(32, "Érudite de l'Améthyste", "Mages", "Être", 190, 3, "", 1, 1),
(33, "Maître des Illusions", "Mages", "Être", 150, 4, "", 2, 2),
(34, "Invocateur de Nébuleuse", "Mages", "Être", 210, 2, "", 1, 1),
(35, "Canaliseur de Mana", "Mages", "Être", 180, 3, "", 1, 1),
(36, "Tempête Arcanique", "Mages", "Être", 250, 1, "", 2, 2),
(37, "Tisseuse de Destins", "Mages", "Être", 160, 5, "", 2, 2),
(38, "Golem de Cristal Pur", "Mages", "Être", 230, 4, "", 3, 3),
(39, "Archimage du Creuset", "Mages", "Être", 240, 2, "", 2, 2),
(40, "Murmure Stellaire", "Mages", "Être", 130, 6, "", 2, 2),
(41, "Amas de Chair Mouvante", "Mutants", "Être", 200, 5, "", 2, 2),
(42, "Crache-Acide", "Mutants", "Être", 230, 1, "", 1, 1),
(43, "Parasite Cérébral", "Mutants", "Être", 150, 2, "", 1, 1),
(44, "Horreur Symbiotique", "Mutants", "Être", 260, 3, "", 3, 3),
(45, "Fongus Toxique", "Mutants", "Être", 140, 4, "", 1, 1),
(46, "Chimère Disloquée", "Mutants", "Être", 280, 1, "", 2, 2),
(47, "Fléau Rampant", "Mutants", "Être", 210, 2, "", 1, 1),
(48, "Biomasse Instable", "Mutants", "Être", 250, 4, "", 3, 3),
(49, "Traqueur Aveugle", "Mutants", "Être", 220, 3, "", 2, 2),
(50, "Ruche Purulente", "Mutants", "Être", 100, 6, "", 2, 2),
(51, "Voyageur Intemporel", "Potentias", "Être", 150, 5, "", 2, 2),
(52, "Égide Céleste", "Potentias", "Être", 120, 6, "", 2, 2),
(53, "Entité du Vide", "Potentias", "Être", 180, 4, "", 1, 1),
(54, "Gardien de l'Éternité", "Potentias", "Être", 200, 7, "", 3, 3),
(55, "Âme Scintillante", "Potentias", "Être", 140, 3, "", 1, 1),
(56, "Médiateur Astral", "Potentias", "Être", 160, 4, "", 1, 1),
(57, "Poussière d'Immortalité", "Potentias", "Être", 110, 5, "", 1, 1),
(58, "Tisseur de Paix", "Potentias", "Être", 130, 4, "", 1, 1),
(59, "Veilleur Silencieux", "Potentias", "Être", 170, 6, "", 2, 2),
(60, "Souffle de la Création", "Potentias", "Être", 220, 5, "", 3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `collection`
--

CREATE TABLE `userCollection` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `cardCollection` JSON DEFAULT ('[]'),
  `quantity` JSON DEFAULT ('[]'),
  `favorite` JSON DEFAULT ('[]')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `collection`
--

INSERT INTO `userCollection` (`id`, `userId`, `cardCollection`, `quantity`, `favorite`) VALUES
(1, 2, '[1, 3, 5, 8, 12, 15, 20]', '[2, 1, 3, 2, 1, 3, 2]', '[]'),
(2, 3, '[]', '[]', '[]'),
(3, 4, '[]', '[]', '[]'),
(4, 5, '[]', '[]', '[]');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `postDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `collection`
--

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `game` (
  `id` int(11) NOT NULL,
  `gameId` int(11) NOT NULL,
  `player1Id` VARCHAR(100) NOT NULL,
  `player2Id` VARCHAR(100) NOT NULL,
  `player1` VARCHAR(100) NOT NULL,
  `player2` VARCHAR(100) NOT NULL,
  `player1Deckid` int(11) NOT NULL,
  `player2Deckid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Index pour la table `deck`
--

ALTER TABLE `deck`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `card`
--

ALTER TABLE `card`
  ADD PRIMARY KEY (`id`);

--
-- Index pour table `collection`
--

ALTER TABLE `userCollection`
  ADD PRIMARY KEY (`id`);

--
-- Index pour table `message`
--

ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Index pour table `game`
--

ALTER TABLE `game`
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
-- AUTO_INCREMENT pour la table `deck`
--

ALTER TABLE `deck`
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

ALTER TABLE `userCollection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

--
-- AUTO_INCREMENT pour la table `message`
--

ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

--
-- AUTO_INCREMENT pour la table `game`
--

ALTER TABLE `game`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
