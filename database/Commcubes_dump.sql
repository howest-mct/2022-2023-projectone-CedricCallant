-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: commcubes
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action`
--

DROP TABLE IF EXISTS `action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action` (
  `ActionId` int NOT NULL,
  `Description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ActionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action`
--

LOCK TABLES `action` WRITE;
/*!40000 ALTER TABLE `action` DISABLE KEYS */;
INSERT INTO `action` VALUES (1,'Ledstrip turns on'),(2,'Motor vibrates'),(3,'Cube unlocks'),(4,'Ledstrip color changes'),(7,'Ledstrip mode changes'),(8,'Ledstrip goes out'),(9,'Lamp turns on'),(10,'Lamp turns off'),(11,'Movement detected'),(12,'Loud noise detected');
/*!40000 ALTER TABLE `action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatmessage`
--

DROP TABLE IF EXISTS `chatmessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatmessage` (
  `ChatHistoryId` int NOT NULL AUTO_INCREMENT,
  `Tijdstip` datetime NOT NULL,
  `SenderCubeId` varchar(20) NOT NULL,
  `ReceiverCubeId` varchar(20) NOT NULL,
  `Hexcode` varchar(7) NOT NULL,
  `Message` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ChatHistoryId`,`Tijdstip`),
  KEY `fk_ChatMessage_Color1_idx` (`Hexcode`),
  KEY `fk_ChatMessage_Cube1_idx` (`ReceiverCubeId`),
  KEY `fk_ChatMessage_Cube2_idx` (`SenderCubeId`),
  CONSTRAINT `fk_ChatMessage_Cube1` FOREIGN KEY (`ReceiverCubeId`) REFERENCES `cube` (`CubeId`),
  CONSTRAINT `fk_ChatMessage_Cube2` FOREIGN KEY (`SenderCubeId`) REFERENCES `cube` (`CubeId`),
  CONSTRAINT `fk_ChatMessage_Cube3` FOREIGN KEY (`Hexcode`) REFERENCES `color` (`Hexcode`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatmessage`
--

LOCK TABLES `chatmessage` WRITE;
/*!40000 ALTER TABLE `chatmessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatmessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `color`
--

DROP TABLE IF EXISTS `color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color` (
  `Hexcode` varchar(7) NOT NULL,
  `Name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Hexcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color`
--

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
INSERT INTO `color` VALUES ('#000000','Black'),('#000080','Navy blue'),('#00009C','Duke blue'),('#0000CD','Medium blue'),('#0000FF','Blue'),('#000F89','Phthalo blue'),('#0014A8','Zaffre'),('#0018A8','Blue (Pantone)'),('#002147','Oxford blue'),('#002366','Royal blue (dark)'),('#002387','Resolution blue'),('#002FA7','International Klein Blue'),('#003153','Prussian blue'),('#0033AA','UA blue'),('#004040','Rich black'),('#00416A','Indigo dye'),('#004225','British racing green'),('#004242','Warm black'),('#0047AB','Cobalt blue'),('#0048BA','Absolute Zero'),('#004953','Midnight green (eagle green)'),('#004B49','Deep jungle green'),('#004F98','USAFA blue'),('#00563F','Castleton green'),('#0063dc','Flickr Blue'),('#006400','Dark green (X11)'),('#006600','Pakistan green'),('#0067A5','Sapphire (Crayola)'),('#006A4E','Bottle green'),('#006B3C','Cadmium green'),('#006DB0','Honolulu blue'),('#00703C','Dartmouth green'),('#0070B8','Spanish blue'),('#0072BB','French blue'),('#007474','Skobeloff'),('#00755E','Tropical rain forest'),('#007AA5','CG blue'),('#007BA7','Celadon blue'),('#007BB8','Star command blue'),('#007F5C','Spanish viridian'),('#007F66','Generic viridian'),('#007FFF','Azure'),('#008000','Ao (English)'),('#008080','Teal'),('#0087BD','Blue (NCS)'),('#008B8B','Dark cyan'),('#009150','Spanish green'),('#0093AF','Blue (Munsell)'),('#009698','Viridian green'),('#009966','Green-cyan'),('#009B7D','Paolo Veronese green'),('#009E60','Shamrock green'),('#009F6B','Green (NCS)'),('#00A550','Green (pigment)'),('#00A693','Persian green'),('#00A86B','Jade'),('#00A877','Green (Munsell)'),('#00AB66','GO green'),('#00AD43','Green (Pantone)'),('#00B7EB','Cyan (process)'),('#00BFFF','Capri'),('#00CC99','Caribbean green'),('#00CCCC','Robin egg blue'),('#00CCFF','Vivid sky blue'),('#00CED1','Dark turquoise'),('#00FA9A','Medium spring green'),('#00FF00','Electric green'),('#00FF40','Erin'),('#00FF7F','Spring green'),('#00FFCD','Sea green (Crayola)'),('#00FFEF','Turquoise blue'),('#00FFFF','Aqua'),('#010203','Rich black (FOGRA39)'),('#010B13','Rich black (FOGRA29)'),('#013220','Dark green'),('#014421','Forest green (traditional)'),('#01796F','Pine green'),('#0247FE','Blue (RYB)'),('#03C03C','Dark pastel green'),('#043927','Sacramento State green'),('#064E40','Blue-green (color wheel)'),('#0A7E8C','Metallic Seaweed'),('#0ABAB5','Tiffany Blue'),('#0BDA51','Malachite'),('#0C020F','Xiketic'),('#0D98BA','Blue-green'),('#0F4D92','Yale Blue'),('#0F52BA','Sapphire'),('#100C08','Smoky black'),('#1034A6','Egyptian blue'),('#1164B4','Green-blue'),('#123524','Phthalo green'),('#126180','Blue sapphire'),('#138808','India green'),('#1560BD','Denim'),('#15F4EE','Fluorescent blue'),('#177245','Dark spring green'),('#18453B','MSU green'),('#191970','Midnight blue'),('#195905','Lincoln green'),('#1974D2','Bright navy blue'),('#1A2421','Dark jungle green'),('#1B1811','Black chocolate'),('#1B1B1B','Eerie black'),('#1B4D3E','Brunswick green'),('#1C05B3','Trypan Blue'),('#1C39BB','Persian blue'),('#1CA9C9','Pacific blue'),('#1CAC78','Green (Crayola)'),('#1D2951','Space cadet'),('#1DACD6','Cerulean (Crayola)'),('#1E90FF','Dodger blue'),('#1F75FE','Blue (Crayola)'),('#20B2AA','Light sea green'),('#2243B6','Denim blue'),('#228B22','Forest green (web)'),('#23297A','St. Patrick\'s blue'),('#232B2B','Charleston green'),('#242124','Raisin black'),('#246BCE','Celtic blue'),('#26428B','Dark cornflower blue'),('#26619C','Lapis lazuli'),('#2887C8','Green-blue (Crayola)'),('#299617','Slimy green'),('#29AB87','Jungle green'),('#2A2F23','Pine tree'),('#2a3439','Gunmetal'),('#2A52BE','Cerulean blue'),('#2D383A','Outer space (Crayola)'),('#2D68C4','True Blue'),('#2E2787','Picotee blue'),('#2E2D88','Cosmic cobalt'),('#2E5090','YInMn Blue'),('#2E5894','B\'dazzled blue'),('#2E8B57','Sea green'),('#2F4F4F','Dark slate gray'),('#2F847C','Celadon green'),('#301934','Dark purple'),('#30B21A','Yellow-green (Color Wheel)'),('#30BA8F','Mountain Meadow'),('#30BFBF','Maximum blue green'),('#317873','Myrtle green'),('#318CE7','Bleu de France'),('#319177','Illuminating emerald'),('#32127A','Persian indigo'),('#32174D','Russian violet'),('#324AB2','Violet-blue'),('#32CD32','Lime green'),('#333399','Blue (pigment)'),('#343434','Jet'),('#353839','Onyx'),('#354230','Kombu green'),('#355E3B','Hunter green'),('#36454F','Charcoal'),('#36747D','Ming'),('#367588','Teal blue'),('#39A78E','Zomp'),('#39FF14','Neon green'),('#3AB09E','Keppel'),('#3B2F2F','Black coffee'),('#3B3C36','Black olive'),('#3B7A57','Amazon'),('#3C1414','Dark sienna'),('#3C341F','Olive Drab #7'),('#3C69E7','Bluetiful'),('#3CB371','Medium sea green'),('#3D0C02','Black bean'),('#3D2B1F','Bistre'),('#3E8EDE','Tufts blue'),('#3EB489','Mint'),('#3F00FF','Ultramarine'),('#3FFF00','Harlequin'),('#40826D','Viridian'),('#40E0D0','Turquoise'),('#4166F5','Ultramarine blue'),('#4169E1','Royal blue (light)'),('#43302E','Old burgundy'),('#436B95','Queen blue'),('#43B3AE','Verdigris'),('#444C38','Rifle green'),('#446CCF','Han blue'),('#4666FF','Neon blue'),('#4682B4','Steel blue'),('#47ABCC','Maximum blue'),('#483C32','Dark lava'),('#483D8B','Dark slate blue'),('#48BF91','Ocean green'),('#48D1CC','Medium turquoise'),('#49796B','Hooker\'s green'),('#4A5D23','Dark moss green'),('#4A646C','Deep Space Sparkle'),('#4B0082','Indigo'),('#4B3621','Café noir'),('#4B5320','Army green'),('#4C2882','Spanish violet'),('#4C516D','Independence'),('#4C9141','May green'),('#4CBB17','Kelly green'),('#4D1A7F','Blue-violet (color wheel)'),('#4D5D53','Feldgrau'),('#4D8C57','Middle green'),('#4E5180','Purple navy'),('#4F42B5','Ocean Blue'),('#4F7942','Fern green'),('#5072A7','Blue yonder'),('#507D2A','Sap green'),('#50C878','Emerald'),('#512888','KSU purple'),('#5218FA','Han purple'),('#534B4F','Dark liver'),('#536872','Cadet'),('#536878','Dark electric blue'),('#543D37','Dark liver (horses)'),('#545AA7','Liberty'),('#54626F','Black coral'),('#555555','Davy\'s grey'),('#555D50','Ebony'),('#556B2F','Dark olive green'),('#563C5C','English violet'),('#568203','Avocado'),('#56887D','Wintergreen Dream'),('#56A0D3','Carolina blue'),('#58427C','Cyber grape'),('#59260B','Seal brown'),('#592720','Caput mortuum'),('#5946B2','Plump Purple'),('#5A4FCF','Iris'),('#5B92E5','United Nations blue'),('#5D3954','Dark byzantium'),('#5DA493','Polished Pine'),('#5DADEC','Blue jeans'),('#5E8C31','Maximum green'),('#5F8A8B','Steel Teal'),('#5F9EA0','Cadet blue'),('#5FA777','Forest green (Crayola)'),('#5FA778','Shiny Shamrock'),('#6050DC','Majorelle blue'),('#6082B6','Glaucous'),('#614051','Eggplant'),('#635147','Umber'),('#644117','Pullman Brown (UPS Brown)'),('#6495ED','Cornflower blue'),('#65000B','Rosewood'),('#654321','Dark brown'),('#660000','Blood red'),('#66023C','Tyrian purple'),('#663399','Rebecca Purple'),('#664228','Van Dyke brown'),('#665D1E','Antique bronze'),('#666699','Dark blue-gray'),('#6699CC','Blue-gray'),('#66B032','Green (RYB)'),('#66DDAA','Medium aquamarine'),('#66FF00','Bright green'),('#66FF66','Screamin\' Green'),('#673147','Old mauve'),('#674846','Rose ebony'),('#674C47','Liver'),('#676767','Granite gray'),('#679267','Russian green'),('#682860','Palatinate purple'),('#696969','Dim gray'),('#6A0DAD','Purple'),('#6A5ACD','Slate blue'),('#6B4423','Kobicha'),('#6B8E23','Olive Drab (#3)'),('#6C2E1F','Liver (organ)'),('#6C3082','Eminence'),('#6C541E','Field drab'),('#6CA0DC','Little boy blue'),('#6D9BC3','Cerulean frost'),('#6EAEA1','Green Sheen'),('#6F00FF','Electric indigo'),('#6F4E37','Coffee'),('#701C1C','Persian plum'),('#702670','Midnight'),('#702963','Byzantium'),('#703642','Catawba'),('#704214','Sepia'),('#708090','Slate gray'),('#71A6D2','Iceberg'),('#722F37','Wine'),('#727472','Nickel'),('#72A0C1','Air superiority blue'),('#733380','Maximum purple'),('#7366BD','Blue-violet (Crayola)'),('#738678','Xanadu'),('#73C2FB','Maya blue'),('#74C365','Mantis'),('#757575','Sonic silver'),('#766EC8','Violet-blue (Crayola)'),('#76D7EA','Sky blue (Crayola)'),('#777696','Rhythm'),('#778899','Light slate gray'),('#778BA5','Shadow blue'),('#77B5FE','French sky blue'),('#78184A','Pansy purple'),('#7851A9','Royal purple'),('#79443B','Bole'),('#796878','Old lavender'),('#7B1113','UP maroon'),('#7B3F00','Chocolate (traditional)'),('#7B68EE','Medium slate blue'),('#7BB661','Bud green'),('#7C0A02','Barn red'),('#7C4848','Tuscan red'),('#7CB9E8','Aero'),('#7CFC00','Lawn green'),('#7DF9FF','Electric blue'),('#7E5E60','Deep taupe'),('#7ED4E6','Middle blue'),('#7F00FF','Violet (color wheel)'),('#7F1734','Claret'),('#7FFF00','Chartreuse (web)'),('#7FFFD4','Aquamarine'),('#800000','Maroon (web)'),('#800020','Burgundy'),('#800080','Patriarch'),('#801818','Falu red'),('#80461B','Russet'),('#807532','Spanish bistre'),('#808000','Olive'),('#808080','Gray (web)'),('#81613C','Coyote brown'),('#826644','Raw umber'),('#838996','Roman silver'),('#841617','OU Crimson red'),('#841B2D','Antique ruby'),('#848482','Battleship grey'),('#856088','Chinese violet'),('#856D4D','French bistre'),('#85754E','Gold Fusion'),('#8601AF','Violet (RYB)'),('#86608E','French lilac'),('#87413F','Brandy'),('#87421F','Fuzzy Wuzzy'),('#87A96B','Asparagus'),('#87CEEB','Sky blue'),('#87CEFA','Light sky blue'),('#87FF2A','Spring Frost'),('#880085','Mardi Gras'),('#8806CE','French violet'),('#882D17','Kobe'),('#88540B','Brown'),('#893843','Solid pink'),('#893F45','Cordovan'),('#89CFF0','Baby blue'),('#8A2BE2','Blue-violet'),('#8A3324','Burnt umber'),('#8A496B','Twilight lavender'),('#8A795D','Shadow'),('#8A7F80','Rocket metallic'),('#8A9A5B','Moss green'),('#8B0000','Dark red'),('#8B008B','Dark magenta'),('#8B4513','Saddle brown'),('#8B72BE','Middle blue purple'),('#8B8589','Taupe gray'),('#8B8680','Middle grey'),('#8BA8B7','Pewter Blue'),('#8C92AC','Cool grey'),('#8CBED6','Dark sky blue'),('#8D4E85','Razzmic Berry'),('#8DA399','Morning blue'),('#8DB600','Apple green'),('#8DD9CC','Middle blue green'),('#8E3A59','Quinacridone magenta'),('#8E4585','Plum'),('#8F00FF','Electric violet'),('#8F9779','Artichoke'),('#8FBC8F','Dark sea green'),('#8FD400','Sheen green'),('#905D5D','Rose taupe'),('#90EE90','Light green'),('#914E75','Sugar Plum'),('#915C83','Antique fuchsia'),('#915F6D','Mauve taupe'),('#91A3B0','Cadet grey'),('#922B3E','Red-violet (Color wheel)'),('#9370DB','Medium purple'),('#93C572','Pistachio'),('#93CCEA','Light cornflower blue'),('#9400D3','Dark violet'),('#954535','Chestnut'),('#960018','Carmine'),('#963D7F','Violet (crayola)'),('#967117','Bistre brown'),('#9678B6','Purple mountain majesty'),('#96C8A2','Eton blue'),('#979AAA','Manatee'),('#987456','Liver chestnut'),('#98817B','Cinereous'),('#989898','Spanish gray'),('#98FF98','Mint green'),('#9932CC','Dark orchid'),('#996515','Golden brown'),('#996666','Copper rose'),('#9966CC','Amethyst'),('#997A8D','Mountbatten pink'),('#9A4EAE','Purpureus'),('#9AB973','Olivine'),('#9ACD32','Yellow-green'),('#9B111E','Ruby red'),('#9BC4E2','Pale cerulean'),('#9C2542','Big dip o’ruby'),('#9C51B6','Purple Plum'),('#9C7C38','Metallic Sunburst'),('#9E1B32','Crimson (UA)'),('#9E5E6F','Rose Dust'),('#9EFD38','French lime'),('#9F00C5','Purple (Munsell)'),('#9F00FF','Vivid violet'),('#9F1D35','Vivid burgundy'),('#9F2B68','Amaranth (M&P)'),('#9F4576','Magenta haze'),('#9F8170','Beaver'),('#9FA91F','Citron'),('#A020F0','Purple (X11)'),('#A0D6B4','Turquoise green'),('#A17A74','Burnished brown'),('#A1CAF1','Baby blue eyes'),('#A2006D','Flirt'),('#A2A2D0','Blue bell'),('#A2ADD0','Wild blue yonder'),('#A3C1AD','Cambridge blue'),('#A45A52','Redwood'),('#A4C639','Android green'),('#A4DDED','Non-photo blue'),('#A50B5E','Jazzberry jam'),('#A52A2A','Auburn'),('#A55353','Middle red purple'),('#A57164','Blast-off bronze'),('#A57C00','Gold'),('#A63A79','Maximum red purple'),('#A67B5B','Café au lait'),('#A6A6A6','Quick Silver'),('#A75502','Windsor tan'),('#A7F432','Green Lizard'),('#A7FC00','Spring bud'),('#A81C07','Rufous'),('#A83731','Sweet Brown'),('#A8516E','China rose'),('#A8C3BC','Opal'),('#A8E4A0','Granny Smith apple'),('#A99A86','Grullo'),('#A9B2C3','Cadet blue (Crayola)'),('#A9BA9D','Laurel green'),('#AA381E','Chinese red'),('#AA98A9','Heliotrope gray'),('#AAA9AD','Silver (Metallic)'),('#AAF0D1','Magic mint'),('#AB274F','Amaranth purple'),('#AB4B52','English red'),('#AB4E52','Rose vale'),('#AB92B3','Glossy grape'),('#ACACAC','Silver chalice'),('#ACACE6','Maximum blue purple'),('#ACBF60','Middle green yellow'),('#ACE1AF','Celadon'),('#ACE5EE','Blizzard blue'),('#AD4379','Mystic maroon'),('#AD6F69','Copper penny'),('#ADD8E6','Light blue'),('#ADFF2F','Green-yellow'),('#AE2029','Upsdell red'),('#AE98AA','Lilac Luster'),('#AF4035','Medium carmine'),('#AF6E4D','Brown sugar'),('#AFDBF5','Uranian blue'),('#B03060','Maroon (X11)'),('#B0BF1A','Acid green'),('#B0C4DE','Light steel blue'),('#B0E0E6','Powder blue'),('#B22222','Firebrick'),('#B284BE','African violet'),('#B2BEB5','Ash gray'),('#B2EC5D','Inchworm'),('#B2FFFF','Celeste'),('#B31B1B','Carnelian'),('#B3446C','Irresistible'),('#B48395','English lavender'),('#B53389','Fandango'),('#B57EDC','Lavender (floral)'),('#B5B35C','Olive green'),('#B7410E','Rust'),('#B768A2','Pearly purple'),('#B784A7','Opera mauve'),('#B86D29','Liver (dogs)'),('#B87333','Copper'),('#B8860B','Dark goldenrod'),('#B94E48','Deep chestnut'),('#B9D9EB','Columbia Blue'),('#BA160C','International orange (engineering)'),('#BA55D3','Medium orchid'),('#BBB477','Misty moss'),('#BC8F8F','Rosy brown'),('#BCB88A','Sage'),('#BCD4E6','Beau blue'),('#BD33A4','Byzantine'),('#BDB76B','Dark khaki'),('#BDDA57','June bud'),('#BE4F62','Popstar'),('#BEBEBE','Gray (X11 gray)'),('#BF00FF','Electric purple'),('#BF4F51','Bittersweet shimmer'),('#BFAFB2','Black Shadows'),('#BFC1C2','Silver sand'),('#BFFF00','Bitter lime'),('#C0362C','International orange (Golden Gate Bridge)'),('#C04000','Mahogany'),('#C0448F','Red-violet (Crayola)'),('#C08081','Old rose'),('#C09999','Tuscany'),('#C0C0C0','Silver'),('#C154C1','Fuchsia (Crayola)'),('#C19A6B','Camel'),('#C21E56','Rose red'),('#C2B280','Ecru'),('#C30B4E','Pictorial carmine'),('#C32148','Bright maroon'),('#C3B091','Khaki (web)'),('#C3CDE6','Periwinkle (Crayola)'),('#C40233','Red (NCS)'),('#C41E3A','Cardinal'),('#C46210','Alloy orange'),('#C4AEAD','Silver pink'),('#C4C3D0','Lavender gray'),('#C54B8C','Mulberry'),('#C5B358','Vegas gold'),('#C5CBE1','Light periwinkle'),('#C5E384','Yellow-green (Crayola)'),('#C71585','Medium violet-red'),('#C72C48','French raspberry'),('#C74375','Fuchsia rose'),('#C80815','Venetian red'),('#C84186','Smitten'),('#C8509B','Mulberry (Crayola)'),('#C8A2C8','Lilac'),('#C8AD7F','Light French beige'),('#C95A49','Cedar Chest'),('#C9A0DC','Wisteria'),('#C9C0BB','Pale silver'),('#C9FFE5','Aero blue'),('#CA1F7B','Magenta (dye)'),('#CAE00D','Bitter lemon'),('#CB410B','Sinopia'),('#CB4154','Brick red'),('#CB6D51','Copper red'),('#CBA135','Satin sheen gold'),('#CC3333','Persian red'),('#CC3336','Madder Lake'),('#CC33CC','Steel pink'),('#CC397B','Fuchsia purple'),('#CC474B','English vermillion'),('#CC5500','Burnt orange'),('#CC7722','Ochre'),('#CC8899','Puce'),('#CCA01D','Lemon curry'),('#CCCCFF','Lavender blue'),('#CCFF00','Electric lime'),('#CD5700','Tenné (tawny)'),('#CD5C5C','Indian red'),('#CD607E','Cinnamon Satin'),('#CD7F32','Bronze'),('#CD9575','Antique brass'),('#CE2029','Fire engine red'),('#CE4676','Ruber'),('#CEFF00','Volt'),('#CF1020','Lava'),('#CF3476','Telemagenta'),('#CF6BA9','Super pink'),('#CF71AF','Sky magenta'),('#CFB53B','Old gold'),('#D0417E','Magenta (Pantone)'),('#D0F0C0','Tea green'),('#D0FF14','Arctic lime'),('#D10047','Spanish carmine'),('#D10056','Rubine red'),('#D1E231','Pear'),('#D2691E','Chocolate (web)'),('#D2B48C','Tan'),('#D3212D','Amaranth red'),('#D3AF37','Metallic gold'),('#D3D3D3','Light gray'),('#D40000','Rosso corsa'),('#D470A2','Wild orchid'),('#D473D4','French mauve'),('#D4AF37','Gold (metallic)'),('#D65282','Mystic'),('#D68A59','Raw Sienna'),('#D6CADD','Languid lavender'),('#D70040','Carmine (M&P)'),('#D71868','Dogwood rose'),('#D74894','Pink (Pantone)'),('#D7837F','New York pink'),('#D891EF','Bright lilac'),('#D8B2D1','Pink lavender'),('#D8BFD8','Thistle'),('#D9004C','UA red'),('#D92121','Maximum red'),('#D9381E','Vermilion'),('#D982B5','Middle purple'),('#D98695','Shimmering Blush'),('#D99058','Persian orange'),('#D99A6C','Tan (Crayola)'),('#D9E650','Maximum green yellow'),('#DA1884','Barbie Pink'),('#DA2C43','Rusty red'),('#DA3287','Deep cerise'),('#DA70D6','Orchid'),('#DA8A67','Copper (Crayola)'),('#DA9100','Harvest gold'),('#DAA520','Goldenrod'),('#DBD7D2','Timberwolf'),('#DC143C','Crimson'),('#DCDCDC','Gainsboro'),('#DDA0DD','Plum (web)'),('#DE3163','Cerise'),('#DE5285','Fandango pink'),('#DE5D83','Blush'),('#DE6FA1','China pink'),('#DEA5A4','Pastel pink'),('#DEAA88','Tumbleweed'),('#DEB887','Burlywood'),('#DF00FF','Phlox'),('#DF73FF','Heliotrope'),('#DFFF00','Chartreuse (traditional)'),('#E0115F','Ruby'),('#E03C31','CG red'),('#E0B0FF','Mauve'),('#E0FFFF','Light cyan'),('#E12C2C','Permanent Geranium Lake'),('#E1A95F','Earth yellow'),('#E2062C','Medium candy apple red'),('#E25822','Flame'),('#E2725B','Terra cotta'),('#E29CD2','Orchid (Crayola)'),('#E30022','Cadmium red'),('#E30B5D','Raspberry'),('#E3256B','Razzmatazz'),('#E32636','Rose madder'),('#E34234','Cinnabar'),('#E3A857','Indian yellow'),('#E3AB57','Sunray'),('#E3DAC9','Bone'),('#E3F988','Mindaro'),('#E40078','Red-purple'),('#E4007C','Mexican pink'),('#E4717A','Candy pink'),('#E48400','Fulvous'),('#E49B0F','Gamboge'),('#E4D00A','Citrine'),('#E4D96F','Straw'),('#E52B50','Amaranth'),('#E58E73','Middle red'),('#E5AA70','Fawn'),('#E5E4E2','Platinum'),('#E60026','Spanish red'),('#E63E62','Paradise pink'),('#E68FAC','Charm pink'),('#E6BE8A','Gold (Crayola)'),('#E6E6FA','Lavender (web)'),('#E79FC4','Kobi'),('#E86100','Spanish orange'),('#E8CCD7','Queen pink'),('#E8F48C','Key lime'),('#E936A7','Frostbite'),('#E95C4B','Fire opal'),('#E97451','Burnt sienna'),('#E9967A','Dark salmon'),('#E9D66B','Arylide yellow'),('#E9FFDB','Nyanza'),('#EAA221','Marigold'),('#EC5800','Persimmon'),('#ECB176','Middle yellow red'),('#ECEBBD','Pale spring bud'),('#ED1C24','Red (pigment)'),('#ED2939','Imperial red'),('#ED872D','Cadmium orange'),('#ED9121','Carrot orange'),('#EDC9AF','Desert sand'),('#EDEAE0','Alabaster'),('#EE204D','Red (Crayola)'),('#EE82EE','Violet (web)'),('#EED202','Safety yellow'),('#EEDC82','Flax'),('#EEE600','Titanium yellow'),('#EEED09','Xanthic'),('#EF98AA','Mauvelous'),('#EFBBCC','Cameo pink'),('#EFCC00','Yellow (Munsell)'),('#EFDECD','Almond'),('#EFDFBB','Dutch white'),('#F08080','Light coral'),('#F0DC82','Buff'),('#F0E68C','Khaki (X11) (Light khaki)'),('#F0E891','Green-yellow (Crayola)'),('#F0EAD6','Eggshell'),('#F0F8FF','Alice blue'),('#F0FFF0','Honeydew'),('#F0FFFF','Azure (X11/web color)'),('#F19CBB','Amaranth pink'),('#F1DDCF','Champagne pink'),('#F2003C','Red (Munsell)'),('#F28500','Tangerine'),('#F2BA49','Maximum yellow red'),('#F2BDCD','Orchid pink'),('#F2C649','Maize (Crayola)'),('#F37A48','Mandarin'),('#F38FA9','Vanilla ice'),('#F3E5AB','Medium champagne'),('#F400A1','Fashion fuchsia'),('#F4A460','Sandy brown'),('#F4C2C2','Baby pink'),('#F4C430','Saffron'),('#F4CA16','Jonquil'),('#F4F0EC','Isabelline'),('#F56FA1','Cyclamen'),('#F58025','Princeton orange'),('#F5BD1F','Orange-yellow'),('#F5DEB3','Wheat'),('#F5E050','Minion yellow'),('#F5F5DC','Beige'),('#F5F5F5','Cultured'),('#F5FFFA','Mint cream'),('#F64A8A','French rose'),('#F653A6','Magenta (Crayola)'),('#F6ADC6','Nadeshiko pink'),('#F6EABE','Lemon meringue'),('#F75394','Violet-red'),('#F77FBE','Persian pink'),('#F78FA7','Pink Sherbet'),('#F7BFBE','Spanish pink'),('#F7E7CE','Champagne'),('#F88379','Congo pink'),('#F8B878','Mellow apricot'),('#F8D568','Orange-yellow (Crayola)'),('#F8DE7E','Jasmine'),('#F8F4FF','Magnolia'),('#F8F8FF','Ghost white'),('#F9429E','Rose bonbon'),('#FA5B3D','Orange soda'),('#FA8072','Salmon'),('#FAD6A5','Deep champagne'),('#FADA5E','Naples yellow'),('#FADADD','Pale pink'),('#FAE6FA','Pale purple (Pantone)'),('#FAE7B5','Banana Mania'),('#FAEBD7','Antique white'),('#FAF0BE','Blond'),('#FAF0E6','Linen'),('#FAFA37','Maximum yellow'),('#FAFAD2','Light goldenrod yellow'),('#FB0081','Flickr Pink'),('#FB4D46','Tart Orange'),('#FB607F','Brink pink'),('#FBAB60','Rajah'),('#FBCEB1','Apricot'),('#FBEC5D','Corn'),('#FC0FC0','Shocking pink'),('#FC6C85','Ultra red'),('#FC74FD','Pink flamingo'),('#FC89AC','Tickle Me Pink'),('#FCC200','Golden poppy'),('#FCE883','Yellow (Crayola)'),('#FCF75E','Icterine'),('#FD3A4A','Red Salsa'),('#FD3F92','French fuchsia'),('#FD6C9E','French pink'),('#FDBE02','Mango'),('#FDDDE6','Piggy pink'),('#FDEE00','Aureolin'),('#FDF5E6','Old lace'),('#FDFF00','Lemon glacier'),('#FE2712','Red (RYB)'),('#FE28A2','Persian rose'),('#FE4EDA','Purple pizzazz'),('#FE6F5E','Bittersweet'),('#FEBAAD','Melon'),('#FED8B1','Light orange'),('#FEDF00','Yellow (Pantone)'),('#FEFE33','Yellow (RYB)'),('#FEFEFA','Baby powder'),('#FF0000','Red'),('#FF007C','Winter Sky'),('#FF007F','Rose'),('#FF0090','Magenta (process)'),('#FF00FF','Fuchsia'),('#FF0800','Candy apple red'),('#FF1493','Deep pink'),('#FF1DCE','Hot magenta'),('#FF2400','Scarlet'),('#FF33CC','Razzle dazzle rose'),('#FF355E','Radical Red'),('#FF3800','Coquelicot'),('#FF3855','Sizzling Red'),('#FF43A4','Wild Strawberry'),('#FF4500','Red-orange (Color wheel)'),('#FF4F00','International orange (aerospace)'),('#FF5349','Orange-red (Crayola)'),('#FF5470','Fiery rose'),('#FF55A3','Brilliant rose'),('#FF5800','Orange (Pantone)'),('#FF5A36','Portland Orange'),('#FF6347','Tomato'),('#FF66CC','Rose pink'),('#FF6700','Safety orange (blaze orange)'),('#FF681F','Orange-red'),('#FF69B4','Hot pink'),('#FF6E4A','Outrageous Orange'),('#FF6FFF','Shocking pink (Crayola)'),('#FF7518','Pumpkin'),('#FF7538','Orange (Crayola)'),('#FF7800','Safety orange'),('#FF7A00','Heat Wave'),('#FF7E00','Amber (SAE/ECE)'),('#FF7F00','Orange'),('#FF7F50','Coral'),('#FF8243','Mango Tango'),('#FF8C00','Dark orange'),('#FF91A4','Salmon pink'),('#FF91AF','Baker-Miller pink'),('#FF9505','Yellow Orange (Color Wheel)'),('#FF9933','Deep saffron'),('#FF9966','Atomic tangerine'),('#FF9F00','Orange peel'),('#FFA07A','Light salmon'),('#FFA089','Vivid tangerine'),('#FFA500','Orange (web)'),('#FFA6C9','Carnation pink'),('#FFA700','Chrome yellow'),('#FFAA1D','Bright yellow (Crayola)'),('#FFAE42','Yellow Orange'),('#FFB200','Chinese yellow'),('#FFB6C1','Light pink'),('#FFB7C5','Cherry blossom pink'),('#FFBA00','Selective yellow'),('#FFBCD9','Cotton candy'),('#FFBD88','Macaroni and Cheese'),('#FFBF00','Amber'),('#FFC0CB','Pink'),('#FFC40C','Mikado yellow'),('#FFCBA4','Peach (Crayola)'),('#FFCC33','Sunglow'),('#FFD300','Cyber yellow'),('#FFD700','Gold (web) (Golden)'),('#FFD800','School bus yellow'),('#FFDAB9','Peach puff'),('#FFDAE9','Mimi pink'),('#FFDB00','Sizzling Sunrise'),('#FFDB58','Mustard'),('#FFDDCA','Unbleached silk'),('#FFDDF4','Pink lace'),('#FFDEAD','Navajo white'),('#FFDF00','Golden yellow'),('#FFE4C4','Bisque'),('#FFE4E1','Misty rose'),('#FFE5B4','Peach'),('#FFEB00','Middle yellow'),('#FFEBCD','Blanched almond'),('#FFEF00','Canary yellow'),('#FFEFD5','Papaya whip'),('#FFF0F5','Lavender blush'),('#FFF44F','Lemon yellow'),('#FFF5EE','Seashell'),('#FFF600','Cadmium yellow'),('#FFF700','Lemon'),('#FFF8DC','Cornsilk'),('#FFF8E7','Cosmic latte'),('#FFFACD','Lemon chiffon'),('#FFFAF0','Floral white'),('#FFFAFA','Snow'),('#FFFDD0','Cream'),('#FFFF00','Yellow'),('#FFFF66','Laser lemon'),('#FFFF99','Canary'),('#FFFF9F','Lemon yellow (Crayola)'),('#FFFFE0','Light yellow'),('#FFFFF0','Ivory'),('#FFFFFF','White');
/*!40000 ALTER TABLE `color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cube`
--

DROP TABLE IF EXISTS `cube`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cube` (
  `CubeId` varchar(20) NOT NULL,
  `Password` varchar(256) DEFAULT NULL,
  `Username` varchar(45) DEFAULT NULL,
  `IsMain` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`CubeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cube`
--

LOCK TABLES `cube` WRITE;
/*!40000 ALTER TABLE `cube` DISABLE KEYS */;
INSERT INTO `cube` VALUES ('29F0889C','718fe6f27af07dd1f2ced7fc8078b575e631c8a396319eb929487aa5560eec2f','testuser',1),('E34F0FE7','a06132ca65ad6863e89363099df866ad32a1fc3be69bc0f5adb9a5aed3c1c348','testEsp',0);
/*!40000 ALTER TABLE `cube` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cubedevice`
--

DROP TABLE IF EXISTS `cubedevice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cubedevice` (
  `CubeDeviceId` int NOT NULL,
  `CubeId` varchar(20) NOT NULL,
  `DeviceId` int NOT NULL,
  `Function` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`CubeDeviceId`),
  KEY `fk_CubeDevice_Device1_idx` (`DeviceId`),
  CONSTRAINT `fk_CubeDevice_Device1` FOREIGN KEY (`DeviceId`) REFERENCES `device` (`DeviceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cubedevice`
--

LOCK TABLES `cubedevice` WRITE;
/*!40000 ALTER TABLE `cubedevice` DISABLE KEYS */;
INSERT INTO `cubedevice` VALUES (5,'2',1,'Choosing color/message'),(6,'2',2,'Vibrate'),(7,'2',3,'Detect movement'),(8,'2',4,'Display colors'),(9,'29F0889C',1,'Choosing color/message'),(10,'29F0889C',2,'Vibrate'),(11,'29F0889C',3,'Detecting movement'),(12,'29F0889C',4,'Display colors'),(13,'E34F0FE7',1,'Choosing color/message'),(14,'E34F0FE7',2,'Vibrate'),(15,'E34F0FE7',3,'Detect movement'),(16,'E34F0FE7',4,'Display colors'),(17,'29F0889C',5,'Detect clap/loud noise'),(18,'E34F0FE7',5,'Detect clap/loud noise');
/*!40000 ALTER TABLE `cubedevice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device` (
  `DeviceId` int NOT NULL,
  `Name` varchar(45) DEFAULT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `Cost` float DEFAULT NULL,
  `Type` varchar(45) DEFAULT NULL,
  `MeasureUnit` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`DeviceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
INSERT INTO `device` VALUES (1,'ttp223','Touch sensor',0.33,'Sensor',NULL),(2,'Dc-motor','motor',1.69,'Actuator',NULL),(3,'mpu6050','Gyroscope sensor',4.95,'Sensor','G'),(4,'Ledstrip',NULL,24.99,'Actuator',NULL),(5,'ky-038','Microphone module',1.99,'Sensor',NULL);
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `history` (
  `HistoryId` int NOT NULL AUTO_INCREMENT,
  `Time` datetime NOT NULL,
  `CubeDeviceId` int NOT NULL,
  `ActieId` int NOT NULL,
  `Value` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`HistoryId`),
  KEY `fk_ActionHistory_Action1_idx` (`ActieId`),
  KEY `fk_History_CubeDevice1_idx` (`CubeDeviceId`),
  CONSTRAINT `fk_ActionHistory_Action1` FOREIGN KEY (`ActieId`) REFERENCES `action` (`ActionId`),
  CONSTRAINT `fk_History_CubeDevice1` FOREIGN KEY (`CubeDeviceId`) REFERENCES `cubedevice` (`CubeDeviceId`)
) ENGINE=InnoDB AUTO_INCREMENT=262486 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES (262300,'2023-06-18 22:41:00',15,11,'-4.0'),(262301,'2023-06-18 22:41:00',16,9,NULL),(262302,'2023-06-18 22:41:11',15,11,'-4.0'),(262303,'2023-06-18 22:41:12',16,10,NULL),(262304,'2023-06-18 22:41:21',15,11,'-4.0'),(262305,'2023-06-18 22:41:21',16,9,NULL),(262306,'2023-06-18 22:54:01',12,4,'#0000CD'),(262307,'2023-06-18 22:56:12',16,4,'#0000CD'),(262308,'2023-06-18 22:56:29',12,7,'pulse'),(262309,'2023-06-18 22:56:57',12,7,'static'),(262310,'2023-06-18 22:57:58',12,7,'pulse'),(262311,'2023-06-18 22:57:58',12,7,'static'),(262312,'2023-06-18 23:08:36',11,11,'1.09'),(262313,'2023-06-18 23:08:36',12,9,NULL),(262314,'2023-06-18 23:20:59',11,11,'2.0'),(262315,'2023-06-18 23:20:59',12,10,NULL),(262316,'2023-06-18 23:21:49',12,8,NULL),(262317,'2023-06-18 23:21:49',12,1,NULL),(262318,'2023-06-18 23:21:49',12,8,NULL),(262319,'2023-06-18 23:21:49',12,1,NULL),(262320,'2023-06-18 23:22:01',12,8,NULL),(262321,'2023-06-18 23:22:01',12,1,NULL),(262322,'2023-06-18 23:22:01',12,8,NULL),(262323,'2023-06-18 23:22:01',12,1,NULL),(262324,'2023-06-18 23:22:01',12,8,NULL),(262325,'2023-06-18 23:22:01',12,1,NULL),(262326,'2023-06-18 23:22:01',12,8,NULL),(262327,'2023-06-18 23:22:01',12,1,NULL),(262328,'2023-06-18 23:22:01',12,8,NULL),(262329,'2023-06-18 23:22:01',12,1,NULL),(262330,'2023-06-18 23:22:01',12,8,NULL),(262331,'2023-06-18 23:22:01',12,1,NULL),(262332,'2023-06-18 23:22:01',12,8,NULL),(262333,'2023-06-18 23:22:01',12,1,NULL),(262334,'2023-06-18 23:22:01',12,8,NULL),(262335,'2023-06-18 23:22:01',12,1,NULL),(262336,'2023-06-18 23:22:01',12,8,NULL),(262337,'2023-06-18 23:22:01',12,1,NULL),(262338,'2023-06-18 23:22:01',12,8,NULL),(262339,'2023-06-18 23:22:01',12,1,NULL),(262340,'2023-06-18 23:22:01',12,8,NULL),(262341,'2023-06-18 23:22:01',12,1,NULL),(262342,'2023-06-18 23:22:01',12,8,NULL),(262343,'2023-06-18 23:22:01',12,1,NULL),(262344,'2023-06-18 23:22:01',12,8,NULL),(262345,'2023-06-18 23:22:01',12,1,NULL),(262346,'2023-06-18 23:22:01',12,8,NULL),(262347,'2023-06-18 23:22:01',12,1,NULL),(262348,'2023-06-18 23:22:01',12,8,NULL),(262349,'2023-06-18 23:22:01',12,1,NULL),(262350,'2023-06-18 23:22:01',12,8,NULL),(262351,'2023-06-18 23:22:01',12,1,NULL),(262352,'2023-06-18 23:22:01',12,8,NULL),(262353,'2023-06-18 23:22:01',12,1,NULL),(262354,'2023-06-18 23:22:01',12,8,NULL),(262355,'2023-06-18 23:22:01',12,1,NULL),(262356,'2023-06-18 23:34:28',11,11,'2.0'),(262357,'2023-06-18 23:34:28',12,9,NULL),(262358,'2023-06-18 23:37:32',16,4,'#000000'),(262359,'2023-06-18 23:38:09',11,11,'1.03'),(262360,'2023-06-18 23:38:09',12,10,NULL),(262361,'2023-06-18 23:38:12',11,11,'1.04'),(262362,'2023-06-18 23:38:12',12,9,NULL),(262363,'2023-06-18 23:38:38',11,11,'1.32'),(262364,'2023-06-18 23:38:38',12,10,NULL),(262365,'2023-06-18 23:53:45',11,11,'1.96'),(262366,'2023-06-18 23:53:45',12,9,NULL),(262367,'2023-06-18 23:53:51',12,8,NULL),(262368,'2023-06-18 23:53:53',11,11,'2.0'),(262369,'2023-06-18 23:53:53',12,10,NULL),(262370,'2023-06-19 08:38:39',16,4,'#000000'),(262371,'2023-06-19 08:41:13',16,4,'#1034A6'),(262372,'2023-06-19 08:41:52',12,7,'pulse'),(262373,'2023-06-19 08:42:16',12,7,'static'),(262374,'2023-06-19 08:43:10',16,4,'#007474'),(262375,'2023-06-19 08:43:16',12,7,'pulse'),(262376,'2023-06-19 08:43:17',12,7,'static'),(262377,'2023-06-19 08:43:58',16,7,'pulse'),(262378,'2023-06-19 08:43:58',16,7,'pulse'),(262379,'2023-06-19 08:44:28',16,7,'static'),(262380,'2023-06-19 08:44:28',16,7,'static'),(262381,'2023-06-19 08:45:04',16,4,'#0000FF'),(262382,'2023-06-19 08:45:07',11,11,'1.18'),(262383,'2023-06-19 08:45:07',12,9,NULL),(262384,'2023-06-19 08:45:35',11,11,'1.02'),(262385,'2023-06-19 08:45:35',12,10,NULL),(262386,'2023-06-19 08:45:40',12,4,'#0000FF'),(262387,'2023-06-19 08:45:47',12,7,'pulse'),(262388,'2023-06-19 08:45:47',12,7,'pulse'),(262389,'2023-06-19 10:37:39',11,11,'1.55'),(262390,'2023-06-19 10:37:39',12,9,NULL),(262391,'2023-06-19 10:37:41',12,8,NULL),(262392,'2023-06-19 10:37:43',11,11,'1.28'),(262393,'2023-06-19 10:37:43',12,10,NULL),(262394,'2023-06-19 10:37:44',12,1,NULL),(262395,'2023-06-19 10:37:44',12,8,NULL),(262396,'2023-06-19 10:37:47',11,11,'0.05'),(262397,'2023-06-19 10:37:47',12,9,NULL),(262398,'2023-06-19 10:37:55',11,11,'1.57'),(262399,'2023-06-19 10:37:55',12,10,NULL),(262400,'2023-06-19 10:37:58',12,1,NULL),(262401,'2023-06-19 10:39:02',16,4,'#EF98AA'),(262402,'2023-06-19 10:39:11',16,4,'#FF0000'),(262403,'2023-06-19 10:39:19',16,4,'#DEB887'),(262404,'2023-06-19 10:39:29',16,4,'#563C5C'),(262405,'2023-06-19 10:46:11',11,11,'1.08'),(262406,'2023-06-19 10:46:11',12,9,NULL),(262407,'2023-06-19 10:50:21',11,11,'1.68'),(262408,'2023-06-19 10:50:21',12,10,NULL),(262409,'2023-06-19 11:58:33',16,4,'#563C5C'),(262410,'2023-06-19 11:58:34',16,4,'#000000'),(262411,'2023-06-19 11:58:35',16,4,'#000F89'),(262412,'2023-06-19 11:58:36',16,4,'#000F89'),(262413,'2023-06-19 11:58:38',16,4,'#1034A6'),(262414,'2023-06-19 11:59:29',12,7,'pulse'),(262415,'2023-06-19 11:59:36',12,7,'static'),(262416,'2023-06-19 12:02:06',16,4,'#232B2B'),(262417,'2023-06-19 12:02:09',16,4,'#560000'),(262418,'2023-06-19 12:02:11',16,4,'#0C020F'),(262419,'2023-06-19 12:02:14',16,4,'#EF98AA'),(262420,'2023-06-19 12:02:16',18,12,NULL),(262421,'2023-06-19 12:02:16',16,8,NULL),(262422,'2023-06-19 12:02:37',16,4,'#FF0000'),(262423,'2023-06-19 12:04:43',16,4,'#EF98AA'),(262424,'2023-06-19 12:05:12',12,7,'pulse'),(262425,'2023-06-19 12:05:20',12,7,'static'),(262426,'2023-06-19 12:40:31',12,7,'pulse'),(262427,'2023-06-19 12:40:45',12,7,'static'),(262428,'2023-06-19 12:41:46',12,7,'pulse'),(262429,'2023-06-19 12:41:46',12,7,'static'),(262430,'2023-06-19 12:46:17',11,11,'1.16'),(262431,'2023-06-19 12:46:17',12,9,NULL),(262432,'2023-06-19 12:46:24',11,11,'1.04'),(262433,'2023-06-19 12:46:24',12,10,NULL),(262434,'2023-06-19 12:47:03',12,7,'pulse'),(262435,'2023-06-19 12:47:13',12,7,'static'),(262436,'2023-06-19 12:59:21',11,11,'1.03'),(262437,'2023-06-19 12:59:21',12,9,NULL),(262438,'2023-06-19 13:00:17',11,11,'1.03'),(262439,'2023-06-19 13:00:17',12,9,NULL),(262440,'2023-06-19 13:00:37',11,11,'1.06'),(262441,'2023-06-19 13:00:37',12,10,NULL),(262442,'2023-06-19 13:01:13',12,7,'pulse'),(262443,'2023-06-19 13:01:19',12,7,'static'),(262444,'2023-06-19 13:03:21',12,7,'pulse'),(262445,'2023-06-19 13:03:26',12,7,'static'),(262446,'2023-06-19 13:04:39',12,7,'pulse'),(262447,'2023-06-19 13:04:43',12,7,'static'),(262448,'2023-06-19 13:05:58',11,11,'1.05'),(262449,'2023-06-19 13:05:58',12,9,NULL),(262450,'2023-06-19 13:06:03',11,11,'-1.34'),(262451,'2023-06-19 13:06:03',12,10,NULL),(262452,'2023-06-19 13:06:22',12,7,'pulse'),(262453,'2023-06-19 13:06:25',12,7,'static'),(262454,'2023-06-19 13:08:35',12,7,'pulse'),(262455,'2023-06-19 13:08:39',12,7,'static'),(262456,'2023-06-19 13:08:44',12,7,'pulse'),(262457,'2023-06-19 13:08:44',12,7,'static'),(262458,'2023-06-19 13:09:23',12,7,'pulse'),(262459,'2023-06-19 13:11:55',12,7,'pulse'),(262460,'2023-06-19 13:13:48',12,7,'pulse'),(262461,'2023-06-19 13:15:36',16,4,'#000000'),(262462,'2023-06-19 13:15:38',16,4,'#1034A6'),(262463,'2023-06-19 13:15:42',16,4,'#232B2B'),(262464,'2023-06-19 13:15:43',16,4,'#560000'),(262465,'2023-06-19 13:15:49',16,4,'#0C020F'),(262466,'2023-06-19 13:15:58',16,4,'#DEB887'),(262467,'2023-06-19 13:16:02',12,7,'pulse'),(262468,'2023-06-19 13:17:43',12,7,'pulse'),(262469,'2023-06-19 14:13:26',16,4,'#232B2B'),(262470,'2023-06-19 14:13:34',16,4,'#560000'),(262471,'2023-06-19 14:13:43',16,4,'#0C020F'),(262472,'2023-06-19 14:13:56',16,4,'#DEB887'),(262473,'2023-06-19 14:14:05',16,4,'#EF98AA'),(262474,'2023-06-19 14:14:12',16,4,'#FF0000'),(262475,'2023-06-19 14:14:21',16,4,'#563C5C'),(262476,'2023-06-19 14:14:28',16,4,'#000000'),(262477,'2023-06-19 14:14:34',16,4,'#000F89'),(262478,'2023-06-19 14:14:43',16,4,'#000F89'),(262479,'2023-06-19 14:14:52',16,4,'#1034A6'),(262480,'2023-06-19 16:07:23',11,11,'1.03'),(262481,'2023-06-19 16:07:23',12,9,NULL),(262482,'2023-06-19 16:26:50',11,11,'1.05'),(262483,'2023-06-19 16:26:51',12,9,NULL),(262484,'2023-06-19 16:29:33',11,11,'1.24'),(262485,'2023-06-19 16:29:33',12,10,NULL);
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-19 17:21:39
