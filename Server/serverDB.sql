

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `location`
--

CREATE TABLE IF NOT EXISTS `location` (
  `idlocation` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `accuracy` int(10) unsigned DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`idlocation`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `notfallkontakt`
--

CREATE TABLE IF NOT EXISTS `notfallkontakt` (
  `idnotfallkontakt` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_iduser` int(10) unsigned NOT NULL,
  `notfallTel` int(10) unsigned DEFAULT NULL,
  `notfallMail` varchar(50) DEFAULT NULL,
  `notfallVorname` varchar(50) DEFAULT NULL,
  `notfallNachname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idnotfallkontakt`),
  KEY `notfallkontakt_FKIndex1` (`user_iduser`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `predefinedpoint`
--

CREATE TABLE IF NOT EXISTS `predefinedpoint` (
  `idpredefinedPoint` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `location_idlocation` int(10) unsigned NOT NULL,
  `predefinedRoute_idpredefinedRoute` int(10) unsigned NOT NULL,
  PRIMARY KEY (`idpredefinedPoint`),
  KEY `predefinedPoints_FKIndex1` (`predefinedRoute_idpredefinedRoute`),
  KEY `predefinedPoints_FKIndex2` (`location_idlocation`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `predefinedroute`
--

CREATE TABLE IF NOT EXISTS `predefinedroute` (
  `idpredefinedRoute` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `predefinedName` varchar(50) DEFAULT NULL,
  `maxLatitude` float DEFAULT NULL,
  `maxLongitude` float DEFAULT NULL,
  `minLatitude` float DEFAULT NULL,
  `minLongitude` float DEFAULT NULL,
  PRIMARY KEY (`idpredefinedRoute`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `registeredroute`
--

CREATE TABLE IF NOT EXISTS `registeredroute` (
  `idregisteredRoute` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idlocation` int(10) unsigned NOT NULL,
  `idroute` int(10) unsigned NOT NULL,
  `pointNr` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`idregisteredRoute`),
  KEY `registeredRoute_FKIndex1` (`idroute`),
  KEY `registeredRoute_FKIndex2` (`idlocation`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `route`
--

CREATE TABLE IF NOT EXISTS `route` (
  `idroute` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_iduser` int(10) unsigned NOT NULL,
  `routeName` varchar(50) DEFAULT NULL,
  `routeInfo` text,
  `routeCode` int(10) unsigned DEFAULT NULL,
  `predefinedRoute_idpredefinedRoute` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`idroute`),
  KEY `route_FKIndex1` (`user_iduser`),
  KEY `fk_route_predefinedRoute1_idx` (`predefinedRoute_idpredefinedRoute`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `routeloc`
--

CREATE TABLE IF NOT EXISTS `routeloc` (
  `idrouteLoc` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_iduser` int(10) unsigned NOT NULL,
  `route_idroute` int(10) unsigned NOT NULL,
  `location_idlocation` int(10) unsigned NOT NULL,
  `battery` decimal(10,0) DEFAULT NULL,
  `signalStrength` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`idrouteLoc`),
  KEY `routeLoc_FKIndex1` (`location_idlocation`),
  KEY `routeLoc_FKIndex2` (`route_idroute`),
  KEY `routeLoc_FKIndex3` (`user_iduser`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `routestatus`
--

CREATE TABLE IF NOT EXISTS `routestatus` (
  `idrouteStatus` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idrouteStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `route_has_routestatus`
--

CREATE TABLE IF NOT EXISTS `route_has_routestatus` (
  `route_idroute` int(10) unsigned NOT NULL,
  `routeStatus_idrouteStatus` int(10) unsigned NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`route_idroute`,`routeStatus_idrouteStatus`),
  KEY `route_has_routeStatus_FKIndex1` (`route_idroute`),
  KEY `route_has_routeStatus_FKIndex2` (`routeStatus_idrouteStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `iduser` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(50) DEFAULT NULL,
  `userPwd` varchar(50) DEFAULT NULL,
  `vorname` varchar(50) DEFAULT NULL,
  `nachname` varchar(50) DEFAULT NULL,
  `tel` int(10) unsigned DEFAULT NULL,
  `strasse` varchar(50) DEFAULT NULL,
  `hausnummer` varchar(50) DEFAULT NULL,
  `plz` int(10) unsigned DEFAULT NULL,
  `ort` varchar(50) DEFAULT NULL,
  `land` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `notfallkontakt`
--
ALTER TABLE `notfallkontakt`
  ADD CONSTRAINT `fk_{CDEFC732-67D3-44A9-8268-6DE64E66C160}` FOREIGN KEY (`user_iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `predefinedpoint`
--
ALTER TABLE `predefinedpoint`
  ADD CONSTRAINT `fk_{5325FC39-15FE-43F0-A8C0-17C311E5B60F}` FOREIGN KEY (`predefinedRoute_idpredefinedRoute`) REFERENCES `predefinedroute` (`idpredefinedRoute`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_{2385B322-65BA-4031-8A10-50312B62D25E}` FOREIGN KEY (`location_idlocation`) REFERENCES `location` (`idlocation`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `registeredroute`
--
ALTER TABLE `registeredroute`
  ADD CONSTRAINT `fk_{B393B9F3-5C95-4152-9CB5-6E7BE261A5C3}` FOREIGN KEY (`idroute`) REFERENCES `route` (`idroute`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_{F1DF0E05-4EC3-4696-8CEC-7DC3EC835DE6}` FOREIGN KEY (`idlocation`) REFERENCES `location` (`idlocation`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `fk_{47890CB7-F710-40FA-87B3-28295E9567FE}` FOREIGN KEY (`user_iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_route_predefinedRoute1` FOREIGN KEY (`predefinedRoute_idpredefinedRoute`) REFERENCES `predefinedroute` (`idpredefinedRoute`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `routeloc`
--
ALTER TABLE `routeloc`
  ADD CONSTRAINT `fk_{79E0CE3E-45DD-4151-899D-CC0C45C23B7C}` FOREIGN KEY (`location_idlocation`) REFERENCES `location` (`idlocation`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_{5E6CE9B0-1931-4CD0-AD45-8F63F5B37198}` FOREIGN KEY (`route_idroute`) REFERENCES `route` (`idroute`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_{9FDE553F-216F-40E6-9B4A-481525FF6CE0}` FOREIGN KEY (`user_iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `route_has_routestatus`
--
ALTER TABLE `route_has_routestatus`
  ADD CONSTRAINT `fk_{C6D26D66-95D2-4638-BD73-B4A58C73A148}` FOREIGN KEY (`route_idroute`) REFERENCES `route` (`idroute`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_{FB68E619-26A2-4D5E-9372-DA0E96A79D31}` FOREIGN KEY (`routeStatus_idrouteStatus`) REFERENCES `routestatus` (`idrouteStatus`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
