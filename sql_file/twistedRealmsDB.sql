-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: twisted-realms-db-antodbc2005-f130.l.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '470e8013-6f94-11f1-8fd6-42010ac80032:1-822';

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `faction` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `atk` int DEFAULT NULL,
  `PV` int DEFAULT NULL,
  `effect` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost` int DEFAULT NULL,
  `accelerator` int DEFAULT NULL,
  `art` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
INSERT INTO `card` VALUES (1,'Nyxos, Engeance noir','Kasmigena','Être',250,2,'Défaussez une carte, remettez en jeu une carte Être depuis votre cimetière, mais ses PV sont réduits à 1.',1,1,NULL),(2,'Golem de Basalte','Kasmigena','Être',180,5,'',2,2,NULL),(3,'Architecte Primordial','Kasmigena','Être',150,6,'',2,2,NULL),(4,'Monolithe Résonnant','Kasmigena','Être',100,7,'',3,3,NULL),(5,'Gardien des Fresques','Kasmigena','Être',180,4,'',1,1,NULL),(6,'Tisseur de Lignes Ley','Kasmigena','Être',190,3,'',1,1,NULL),(7,'Titan d\'Ardoise','Kasmigena','Être',250,5,'',3,3,NULL),(8,'Forge-Monde','Kasmigena','Être',220,4,'',2,2,NULL),(9,'Voix des Ancêtres','Kasmigena','Être',170,5,'',2,2,NULL),(10,'Garde-Ruine d\'Airain','Kasmigena','Être',210,3,'',1,1,NULL),(11,'Tyran du Brasier','Dragons','Être',280,2,'',2,2,NULL),(12,'Mâchoire d\'Obsidienne','Dragons','Être',250,3,'',2,2,NULL),(13,'Écaille-Tonnerre','Dragons','Être',260,2,'',1,1,NULL),(14,'Crache-Magma','Dragons','Être',240,2,'',1,1,NULL),(15,'Cataclysme Ailé','Dragons','Être',310,1,'',3,3,NULL),(16,'Wyverne Cendrée','Dragons','Être',220,2,'',1,1,NULL),(17,'Mange-Sorts Draconique','Dragons','Être',230,3,'',2,2,NULL),(18,'Tempête d\'Écailles','Dragons','Être',270,1,'',2,2,NULL),(19,'Sang-Bouillant','Dragons','Être',290,1,'',2,2,NULL),(20,'Frappe-Météore','Dragons','Être',300,2,'',3,3,NULL),(21,'Mécabot d\'Infanterie','Erudis','Être',190,3,'',1,1,NULL),(22,'Drone de Reconnaissance','Erudis','Être',140,2,'',1,1,NULL),(23,'Matrice Défensive','Erudis','Être',100,6,'',2,2,NULL),(24,'Canon à Ions Lourd','Erudis','Être',260,1,'',2,2,NULL),(25,'Ingénieur Holographique','Erudis','Être',160,3,'',1,1,NULL),(26,'Paladin Cybernétique','Erudis','Être',210,4,'',2,2,NULL),(27,'Noyau d\'Énergie Instable','Erudis','Être',280,1,'',3,3,NULL),(28,'Titan d\'Acier Brossé','Erudis','Être',250,5,'',3,3,NULL),(29,'Nettoyeur Plasma','Erudis','Être',220,2,'',1,1,NULL),(30,'Black Magician','Mages','Être',220,5,'',3,3,NULL),(31,'Apprenti des Astres','Mages','Être',170,2,'',1,1,NULL),(32,'Érudite de l\'Améthyste','Mages','Être',190,3,'',1,1,NULL),(33,'Maître des Illusions','Mages','Être',150,4,'',2,2,NULL),(34,'Invocateur de Nébuleuse','Mages','Être',210,2,'',1,1,NULL),(35,'Canaliseur de Mana','Mages','Être',180,3,'',1,1,NULL),(36,'Tempête Arcanique','Mages','Être',250,1,'',2,2,NULL),(37,'Tisseuse de Destins','Mages','Être',160,5,'',2,2,NULL),(38,'Golem de Cristal Pur','Mages','Être',230,4,'',3,3,NULL),(39,'Archimage du Creuset','Mages','Être',240,2,'',2,2,NULL),(40,'Murmure Stellaire','Mages','Être',130,6,'',2,2,NULL),(41,'Amas de Chair Mouvante','Mutants','Être',200,5,'',2,2,NULL),(42,'Crache-Acide','Mutants','Être',230,1,'',1,1,NULL),(43,'Parasite Cérébral','Mutants','Être',150,2,'',1,1,NULL),(44,'Horreur Symbiotique','Mutants','Être',260,3,'',3,3,NULL),(45,'Fongus Toxique','Mutants','Être',140,4,'',1,1,NULL),(46,'Chimère Disloquée','Mutants','Être',280,1,'',2,2,NULL),(47,'Fléau Rampant','Mutants','Être',210,2,'',1,1,NULL),(48,'Biomasse Instable','Mutants','Être',250,4,'',3,3,NULL),(49,'Traqueur Aveugle','Mutants','Être',220,3,'',2,2,NULL),(50,'Ruche Purulente','Mutants','Être',100,6,'',2,2,NULL),(51,'Voyageur Intemporel','Potentias','Être',150,5,'',2,2,NULL),(52,'Égide Céleste','Potentias','Être',120,6,'',2,2,NULL),(53,'Entité du Vide','Potentias','Être',180,4,'',1,1,NULL),(54,'Gardien de l\'Éternité','Potentias','Être',200,7,'',3,3,NULL),(55,'Âme Scintillante','Potentias','Être',140,3,'',1,1,NULL),(56,'Médiateur Astral','Potentias','Être',160,4,'',1,1,NULL),(57,'Poussière d\'Immortalité','Potentias','Être',110,5,'',1,1,NULL),(58,'Tisseur de Paix','Potentias','Être',130,4,'',1,1,NULL),(59,'Veilleur Silencieux','Potentias','Être',170,6,'',2,2,NULL),(60,'Souffle de la Creation','Potentias','Être',220,5,'',3,3,NULL),(61,'Pot of Greed','Aucune','Sort',NULL,NULL,'Piochez 2 cartes',NULL,NULL,'PotofGreed-DBR-JP-VG-artwork.png'),(62,'Réincarnation de monstre','Aucune','Sort',NULL,NULL,'Invoquez 1 monstre depuis votre cimetière',NULL,NULL,'MonsterReborn-DBR-JP-VG-artwork.png');
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cardPack`
--

DROP TABLE IF EXISTS `cardPack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cardPack` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cardList` json DEFAULT (_utf8mb4'[]'),
  `containedCard` int NOT NULL,
  `price` int NOT NULL,
  `badge` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recommanded` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cardPack`
--

LOCK TABLES `cardPack` WRITE;
/*!40000 ALTER TABLE `cardPack` DISABLE KEYS */;
INSERT INTO `cardPack` VALUES (1,'Booster: Souffle du Dragon','Booster','Contient 5 cartes de la faction Dragons.','[11, 12, 13, 14, 15, 16, 17, 18, 19, 20]',5,100,'Nouveau',1),(2,'Booster: Héritage Kasmigena','Booster','Contient 5 cartes de la faction Kasmigenas.','[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]',5,100,NULL,0),(3,'Booster: Mutation Génétique','Booster','Contient 5 cartes de la faction Mutants.','[41, 42, 43, 44, 45, 46, 47, 48, 49, 50]',5,100,NULL,0),(4,'Booster: Technologie Érudite','Booster','Contient 5 cartes de la faction Érudis.','[21, 22, 23, 24, 25, 26, 27, 28, 29, 30]',5,100,NULL,0),(5,'Booster: Mages de l\'Arcane','Booster','Contient 5 cartes de la faction Mages.','[31, 32, 33, 34, 35, 36, 37, 38, 39, 40]',5,100,NULL,0),(6,'Booster: Aura des Potentias','Booster','Contient 5 cartes de la faction Potentias.','[51, 52, 53, 54, 55, 56, 57, 58, 59, 60]',5,100,NULL,0);
/*!40000 ALTER TABLE `cardPack` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deck`
--

DROP TABLE IF EXISTS `deck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deck` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cardList` json DEFAULT (_utf8mb4'[]'),
  `mainCard` int DEFAULT NULL,
  `postDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deck`
--

LOCK TABLES `deck` WRITE;
/*!40000 ALTER TABLE `deck` DISABLE KEYS */;
INSERT INTO `deck` VALUES (1,2,'Deck Arcanique','[35, 31, 38, 32, 40, 33, 37, 35, 39, 34, 36, 31, 32, 38, 40, 33, 36, 37, 39, 34, 35, 31, 38, 32, 40, 33, 37, 39, 34, 36]',NULL,'2026-05-31 12:00:00'),(2,2,'Deck Draconique','[12, 15, 11, 19, 14, 20, 13, 18, 17, 11, 12, 15, 13, 14, 19, 20, 17, 18, 15, 11, 16, 12, 19, 13, 20, 14, 18, 17, 16, 16]',16,'2026-06-11 12:00:00'),(3,7,'Gloire a meuble !!!','[16, 16, 16, 14, 14, 14]',16,'2026-06-24 10:22:59'),(4,10,'Deck Nyx','[16, 14, 13, 19, 18, 17, 12, 11, 20, 15, 21, 22, 25, 29, 23, 24, 26, 27]',16,'2026-06-24 13:46:22'),(5,2,'Mutants','[41, 41, 41, 49, 49, 49, 50, 50, 50, 42, 42, 42, 43, 43, 43, 45, 45, 45, 47, 47, 47, 61, 61, 61, 62, 62, 62, 1, 1, 48]',42,'2026-06-24 17:02:14'),(7,11,'Structure Deck: Mages de l\'Arcane','[31, 32, 33, 34, 35, 37, 38, 40, 31, 32, 33, 34, 35, 37, 38, 40, 31, 32, 33, 34, 35, 37, 38, 40, 62, 62, 62, 61, 61, 61]',31,'2026-06-26 10:07:42'),(8,10,'miaou','[14, 18, 17, 12, 11, 22, 29, 26, 1, 6, 8, 3, 4, 32, 40, 37, 36, 45, 43, 50, 46, 53, 56, 58, 60]',14,'2026-06-26 10:37:29'),(12,7,'Structure Deck: Évolution Mutante','[41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]',44,'2026-06-27 19:18:17'),(13,6,'Structure Deck: Colère du Dragon','[11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]',11,'2026-06-28 10:13:31');
/*!40000 ALTER TABLE `deck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gameId` int NOT NULL,
  `player1Id` int NOT NULL,
  `player2Id` int DEFAULT NULL,
  `player1DeckId` int NOT NULL,
  `player2DeckId` int DEFAULT NULL,
  `createDate` datetime NOT NULL,
  `isPrivate` tinyint(1) NOT NULL DEFAULT '0',
  `adminId` int NOT NULL,
  `isStarted` tinyint(1) NOT NULL DEFAULT '0',
  `player1Hand` json NOT NULL,
  `player2Hand` json NOT NULL,
  `player1DeckOrder` json DEFAULT NULL,
  `player2DeckOrder` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `game_id_IDX` (`id`,`gameId`,`adminId`,`player1Id`,`player2Id`,`player1DeckId`,`player2DeckId`,`createDate`,`isPrivate`) USING BTREE,
  KEY `game_adminId_IDX` (`adminId`,`gameId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `postDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'test',2,'2026-06-24 09:55:41'),(2,'test',2,'2026-06-24 09:55:52'),(3,'connexion',2,'2026-06-24 09:59:01'),(4,'test',2,'2026-06-24 10:01:23'),(5,'test',2,'2026-06-24 10:02:20'),(6,'bonjour',2,'2026-06-24 10:09:42'),(7,'explose',7,'2026-06-24 10:19:10'),(8,'yo',2,'2026-06-24 10:19:49'),(9,'da',7,'2026-06-24 10:20:01'),(10,'ça marche bien nan?',2,'2026-06-24 10:20:07'),(11,'masterclass de la part de AD',7,'2026-06-24 10:20:20'),(12,'évite de dire des dingueries c\'est publique mdr',2,'2026-06-24 10:20:22'),(13,'oeje me doute',7,'2026-06-24 10:20:29'),(14,'c\'est probablement ce que je vais montrer pour le grand final',2,'2026-06-24 10:20:49'),(15,'ah ui purée le projet',7,'2026-06-24 10:21:16'),(16,'tu fais bien de me le rappeler',7,'2026-06-24 10:21:24'),(17,'regarde dans mes decks ou ma collection, essaie de faire un deck aussi, meme si tu n\'as pas de cartes',2,'2026-06-24 10:21:44'),(18,'joli joli',7,'2026-06-24 10:25:11'),(19,'Masterclass',8,'2026-06-24 10:35:36'),(20,'Jem faur',8,'2026-06-24 10:35:52'),(21,'yeee',2,'2026-06-24 10:45:34'),(22,'bonjour',2,'2026-06-24 13:42:44'),(23,'Bonsoir',9,'2026-06-24 13:42:52'),(24,'miaou',10,'2026-06-24 13:44:51'),(25,'Gloire à Mirvu',2,'2026-06-25 09:59:59'),(26,'Gloire à worm',2,'2026-06-25 10:00:08'),(27,'GLOIRE AU DUEL TERMINAL',2,'2026-06-25 10:00:20'),(28,'GLOIRE À FRAULEIN',2,'2026-06-25 10:00:38'),(29,'Bonjour messieurs les jurys',2,'2026-06-25 10:00:57'),(30,'Mettez lui la note max',2,'2026-06-25 10:01:14'),(31,'pourquoi gloire à mirvu mais pas aux autres ??',10,'2026-06-25 15:45:44'),(32,'mais oui c\'est trop stylé franchement',10,'2026-06-25 15:46:13'),(33,'Shop fonctionnel',11,'2026-06-26 10:10:20'),(34,'Avatar du chat fonctionnel',2,'2026-06-26 10:54:44'),(35,'lets goooo',10,'2026-06-26 10:56:11'),(36,'c\'est tellement clean j\'adore',10,'2026-06-26 10:57:13'),(37,'Bonjour',4,'2026-06-26 18:17:40'),(38,'bon par contre ta pdp a disparu dans les backroom',2,'2026-06-26 18:18:16'),(39,'c\'est qui ? jsuis curieux',10,'2026-06-26 18:18:32'),(40,'un vieux',2,'2026-06-26 18:18:41'),(41,'cerveau qui explose emoji',10,'2026-06-26 18:18:55'),(42,'Le vieux qui est pas dans ta classe',4,'2026-06-26 18:21:33'),(43,'jérémy ?',10,'2026-06-26 18:23:05'),(44,'Bingo',4,'2026-06-26 18:23:21'),(45,'pouah juste trop fort',10,'2026-06-26 18:23:26'),(46,'Après y avait vraiment pas d\'autre option',4,'2026-06-26 18:23:43'),(47,'Et même si tu prenais les 2 classes t\'avais une chance sur 2',4,'2026-06-26 18:23:56'),(48,'ouais mais n\'importe qui pourrait me dire ne pas être dans ma classe',10,'2026-06-26 18:24:20'),(49,'qqn externe à l\'école aurait pu me dire la même chose',10,'2026-06-26 18:24:37'),(50,'techniquement il serait pas non plus dans ma classe',10,'2026-06-26 18:24:47'),(51,'Ouais mais du coup j\'aurais pas dit ça, ça voulait dire que j\'étais dans l\'autre classe',4,'2026-06-26 18:25:11'),(52,'évidemment ça fait sens mais t\'aurais pu essayer de me douiller c\'est ça que jveux dire',10,'2026-06-26 18:25:36'),(53,'J\'suis pas assez malicieux ',4,'2026-06-26 18:26:13'),(54,'Mais c\'est vrai que t\'aurais pu tomber sur un lutin',4,'2026-06-26 18:26:29'),(55,'JALLAIS FAIRE LA VANNE',10,'2026-06-26 18:26:36'),(56,'Haha',4,'2026-06-26 18:26:43'),(57,'T\'as vu les apm que j\'ai pour un vieux',4,'2026-06-26 18:27:15'),(58,'Un joueur starcraft',4,'2026-06-26 18:27:23'),(59,'bro était un beta testeur des echecs',2,'2026-06-26 18:32:06'),(60,'MDRRRRR',10,'2026-06-26 18:40:55'),(61,':0',7,'2026-06-27 19:02:14'),(62,'vasy host une game',2,'2026-06-27 19:14:44'),(63,'btw pas mal la pp',2,'2026-06-27 19:15:11'),(64,'Mrc mek',7,'2026-06-27 19:16:41'),(65,'Test des gifs dans le chat',6,'2026-06-28 09:56:06');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `structureDeck`
--

DROP TABLE IF EXISTS `structureDeck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `structureDeck` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cardList` json DEFAULT (_utf8mb4'[]'),
  `price` int NOT NULL,
  `badge` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mainCardId` int DEFAULT NULL,
  `recommanded` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `structureDeck`
--

LOCK TABLES `structureDeck` WRITE;
/*!40000 ALTER TABLE `structureDeck` DISABLE KEYS */;
INSERT INTO `structureDeck` VALUES (1,'Structure Deck: Mages de l\'Arcane','Structure Deck','Un deck complet prêt à jouer axé sur les mages et la magie.','[31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 31, 32, 33, 34, 35, 36, 37, 38, 61, 62]',1000,'Nouveau',39,1),(2,'Structure Deck: Colère du Dragon','Structure Deck','Un deck complet axé sur la puissance destructrice des dragons.','[11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 11, 12, 13, 14, 15, 16, 17, 18, 61, 62]',1000,NULL,11,0),(3,'Structure Deck: Civilisation Antique','Structure Deck','Un deck complet exploitant la magie ancestrale des Kasmigenas.','[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 61, 62]',1000,NULL,1,0),(4,'Structure Deck: Évolution Mutante','Structure Deck','Un deck complet exploitant l\'adaptation et les anomalies génétiques des Mutants.','[41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 41, 42, 43, 44, 45, 46, 47, 48, 61, 62]',1000,NULL,44,0),(5,'Structure Deck: Suprématie Technologique','Structure Deck','Un deck complet axé sur la technologie et les machines des Érudis.','[21, 22, 23, 24, 25, 26, 27, 28, 29, 21, 22, 23, 24, 25, 26, 27, 28, 29, 21, 22, 23, 24, 25, 26, 27, 28, 61, 51, 51, 62]',1000,NULL,28,0),(7,'Structure Deck: Jugement de l\'Équilibre','Structure Deck','Un deck complet axé sur le soutien et la neutralité des Potentias.','[51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 51, 52, 53, 54, 55, 56, 57, 58, 61, 62]',1000,NULL,54,0);
/*!40000 ALTER TABLE `structureDeck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userImage` varchar(510) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `isGlobalChat` tinyint(1) DEFAULT '1',
  `credits` int NOT NULL DEFAULT '1500',
  `activeDeck` int DEFAULT NULL,
  `gameId` int DEFAULT NULL,
  `inGame` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'Jamie','antoinedbc2005@gmail.com','$2b$10$9m2pcJFV8a83mSBq56wElO/gq3XU7Ydubg7BdyAAlk/DTwCBfIhIG','default-1782665768538-46333.jpg','user','2026-05-22 07:56:49',1,1740,5,NULL,0),(3,'Sofiane','test@gmail.com','$2b$10$/rRdJccmpBZWH762zZFWHuXhTG0B9emTAjRtR1v3he1ZcXCr7abWW','1779440163457-795085330.jpeg','user','2026-05-22 08:55:27',1,1500,NULL,NULL,0),(4,'JsuisVieux','jeremygirard89100@gmail.com','$2b$10$cxPLcSQz.JC1LNBntb9.0.tNAFA46ZH3fDd3uMo6LcQEC.W8I/OKW','1779442514076-829402163.jpg','user','2026-05-22 09:34:30',1,1500,NULL,NULL,0),(5,'boris','boris.rose.dev@gmail.com','$2b$10$3F0PauDwP8K0YHcYFQ3areGGylWunMmhLsfINv915WHxHutlgu8xS','1779442889677-543814697.jpeg','user','2026-05-22 09:39:58',1,1500,NULL,NULL,0),(6,'Meuble','antoindbc2005@gmail.com','$2b$10$9m2pcJFV8a83mSBq56wElO/gq3XU7Ydubg7BdyAAlk/DTwCBfIhIG','1779741525599-931313353.webp','user','2026-05-22 07:56:49',1,500,13,NULL,0),(7,'mirvu','pro.garcia.hugo@gmail.com','$2b$10$1HmiofskPXyv7H8IgZtsIOWhu21yZZ4fChxMIapDN/o0Skb68wxMi','1782587982126-838482760.jpg','user','2026-06-24 10:18:56',1,2300,12,NULL,0),(8,'Dakeyras','mad.pugle@gmail.com','$2b$10$AJBuzP3h3jDA8kUTmzgq5e1lGyqP8kYOoWJ1GU3pwZjVcrUQqH3IO','default-1782297324263-980145.jpg','user','2026-06-24 10:35:24',1,1500,NULL,NULL,0),(9,'Xen','chabafrancois@gmail.com','$2b$10$KeQYJwfFckQIzv7oj4KjaOaJg62CAGOYReb8DLz24y/m0N9ZdJyhu','default-1782308444341-646530.png','user','2026-06-24 13:40:44',1,1500,NULL,NULL,0),(10,'devilishlyney','devilishlyney@proton.me','$2b$10$Y6iBsV1k05CEG/DsIanT4.9I/TwSX5FVqX5atPQvbUTEsBcxyZqHO','1782659219243-349970775.jpg','user','2026-06-24 13:43:15',1,900,4,NULL,0),(11,'gameTest','meuble5002@gmail.com','$2b$10$uxo0SOnQCl.yRGZ/1.kf0ev40yyNUiwE6Jc6xBi19xpo17nmlEUCi','default-1782664959979-472920.png','user','2026-06-26 09:48:14',1,9520,7,NULL,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userCollection`
--

DROP TABLE IF EXISTS `userCollection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userCollection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `cardCollection` json DEFAULT (_utf8mb4'[]'),
  `quantity` json DEFAULT (_utf8mb4'[]'),
  `favorite` json DEFAULT (_utf8mb4'[]'),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userCollection`
--

LOCK TABLES `userCollection` WRITE;
/*!40000 ALTER TABLE `userCollection` DISABLE KEYS */;
INSERT INTO `userCollection` VALUES (1,2,'[1, 3, 5, 8, 12, 15, 20, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 61, 62]','[2, 1, 3, 2, 1, 3, 2, 3, 4, 4, 3, 4, 3, 3, 3, 4, 4, 3, 3]','[41, 61]'),(2,3,'[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]','[3, 3, 3, 3, 3, 3, 3, 3, 3, 3]','[1]'),(3,4,'[]','[]','[]'),(4,5,'[]','[]','[]'),(5,6,'[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]','[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]','[1]'),(6,7,'[49, 45, 47, 46, 41, 9, 7, 1, 8, 42, 43, 44, 48, 50]','[4, 4, 4, 4, 4, 1, 1, 2, 1, 3, 3, 3, 3, 3]','[]'),(7,8,'[]','[]','[]'),(8,9,'[]','[]','[]'),(9,10,'[17, 18, 12, 11, 14, 8, 1, 4, 6, 3, 46, 43, 45, 50, 29, 22, 26, 32, 40, 36, 37, 60, 56, 53, 58]','[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 3, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1]','[]'),(10,11,'[20, 15, 14, 43, 42, 49, 46, 19, 12, 13, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 61, 62]','[2, 2, 3, 1, 2, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]','[]');
/*!40000 ALTER TABLE `userCollection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'defaultdb'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-28 23:39:59
