SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Table `predefinedRoute`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `predefinedRoute` (
  `idpredefinedRoute` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `predefinedName` VARCHAR(50) NULL DEFAULT NULL ,
  `maxLatitude` FLOAT NULL DEFAULT NULL ,
  `maxLongitude` FLOAT NULL DEFAULT NULL ,
  `minLatitude` FLOAT NULL DEFAULT NULL ,
  `minLongitude` FLOAT NULL DEFAULT NULL ,
  PRIMARY KEY (`idpredefinedRoute`) );


-- -----------------------------------------------------
-- Table `routeStatus`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `routeStatus` (
  `idrouteStatus` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `description` VARCHAR(50) NULL DEFAULT NULL ,
  PRIMARY KEY (`idrouteStatus`) );


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `user` (
  `iduser` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `userName` VARCHAR(50) NULL DEFAULT NULL ,
  `userPwd` VARCHAR(50) NULL DEFAULT NULL ,
  `vorname` VARCHAR(50) NULL DEFAULT NULL ,
  `nachname` VARCHAR(50) NULL DEFAULT NULL ,
  `tel` INT UNSIGNED NULL DEFAULT NULL ,
  `strasse` VARCHAR(50) NULL DEFAULT NULL ,
  `hausnummer` VARCHAR(50) NULL DEFAULT NULL ,
  `plz` INT UNSIGNED NULL DEFAULT NULL ,
  `ort` VARCHAR(50) NULL DEFAULT NULL ,
  `land` VARCHAR(50) NULL DEFAULT NULL ,
  PRIMARY KEY (`iduser`) );


-- -----------------------------------------------------
-- Table `location`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `location` (
  `idlocation` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `latitude` FLOAT NULL DEFAULT NULL ,
  `longitude` FLOAT NULL DEFAULT NULL ,
  `accuracy` INT UNSIGNED NULL DEFAULT NULL ,
  `timestamp` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`idlocation`) );


-- -----------------------------------------------------
-- Table `route`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `route` (
  `idroute` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `user_iduser` INT UNSIGNED NOT NULL ,
  `routeName` VARCHAR(50) NULL DEFAULT NULL ,
  `routeInfo` TEXT NULL DEFAULT NULL ,
  `routeCode` INT UNSIGNED NULL DEFAULT NULL ,
  `predefinedRoute_idpredefinedRoute` INT UNSIGNED NULL ,
  PRIMARY KEY (`idroute`) ,
  INDEX `route_FKIndex1` (`user_iduser` ASC) ,
  INDEX `fk_route_predefinedRoute1_idx` (`predefinedRoute_idpredefinedRoute` ASC) ,
  CONSTRAINT `fk_{47890CB7-F710-40FA-87B3-28295E9567FE}`
    FOREIGN KEY (`user_iduser` )
    REFERENCES `user` (`iduser` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_route_predefinedRoute1`
    FOREIGN KEY (`predefinedRoute_idpredefinedRoute` )
    REFERENCES `predefinedRoute` (`idpredefinedRoute` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `notfallkontakt`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `notfallkontakt` (
  `idnotfallkontakt` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `user_iduser` INT UNSIGNED NOT NULL ,
  `notfallTel` INT UNSIGNED NULL DEFAULT NULL ,
  `notfallMail` VARCHAR(50) NULL DEFAULT NULL ,
  `notfallVorname` VARCHAR(50) NULL DEFAULT NULL ,
  `notfallNachname` VARCHAR(50) NULL DEFAULT NULL ,
  PRIMARY KEY (`idnotfallkontakt`) ,
  INDEX `notfallkontakt_FKIndex1` (`user_iduser` ASC) ,
  CONSTRAINT `fk_{CDEFC732-67D3-44A9-8268-6DE64E66C160}`
    FOREIGN KEY (`user_iduser` )
    REFERENCES `user` (`iduser` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `route_has_routeStatus`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `route_has_routeStatus` (
  `route_idroute` INT UNSIGNED NOT NULL ,
  `routeStatus_idrouteStatus` INT UNSIGNED NOT NULL ,
  `timestamp` DATETIME NULL DEFAULT NULL ,
  `user_iduser` INT UNSIGNED NOT NULL ,
  PRIMARY KEY (`route_idroute`, `routeStatus_idrouteStatus`) ,
  INDEX `route_has_routeStatus_FKIndex1` (`route_idroute` ASC) ,
  INDEX `route_has_routeStatus_FKIndex2` (`routeStatus_idrouteStatus` ASC) ,
  INDEX `fk_route_has_routeStatus_user1_idx` (`user_iduser` ASC) ,
  CONSTRAINT `fk_{C6D26D66-95D2-4638-BD73-B4A58C73A148}`
    FOREIGN KEY (`route_idroute` )
    REFERENCES `route` (`idroute` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_{FB68E619-26A2-4D5E-9372-DA0E96A79D31}`
    FOREIGN KEY (`routeStatus_idrouteStatus` )
    REFERENCES `routeStatus` (`idrouteStatus` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_route_has_routeStatus_user1`
    FOREIGN KEY (`user_iduser` )
    REFERENCES `user` (`iduser` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `predefinedPoint`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `predefinedPoint` (
  `idpredefinedPoint` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `location_idlocation` INT UNSIGNED NOT NULL ,
  `predefinedRoute_idpredefinedRoute` INT UNSIGNED NOT NULL ,
  `pointNr` INT NOT NULL ,
  PRIMARY KEY (`idpredefinedPoint`) ,
  INDEX `predefinedPoints_FKIndex1` (`predefinedRoute_idpredefinedRoute` ASC) ,
  INDEX `predefinedPoints_FKIndex2` (`location_idlocation` ASC) ,
  CONSTRAINT `fk_{5325FC39-15FE-43F0-A8C0-17C311E5B60F}`
    FOREIGN KEY (`predefinedRoute_idpredefinedRoute` )
    REFERENCES `predefinedRoute` (`idpredefinedRoute` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_{2385B322-65BA-4031-8A10-50312B62D25E}`
    FOREIGN KEY (`location_idlocation` )
    REFERENCES `location` (`idlocation` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `registeredRoute`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `registeredRoute` (
  `idregisteredRoute` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `idlocation` INT UNSIGNED NOT NULL ,
  `idroute` INT UNSIGNED NOT NULL ,
  `pointNr` INT UNSIGNED NULL DEFAULT NULL ,
  PRIMARY KEY (`idregisteredRoute`) ,
  INDEX `registeredRoute_FKIndex1` (`idroute` ASC) ,
  INDEX `registeredRoute_FKIndex2` (`idlocation` ASC) ,
  CONSTRAINT `fk_{B393B9F3-5C95-4152-9CB5-6E7BE261A5C3}`
    FOREIGN KEY (`idroute` )
    REFERENCES `route` (`idroute` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_{F1DF0E05-4EC3-4696-8CEC-7DC3EC835DE6}`
    FOREIGN KEY (`idlocation` )
    REFERENCES `location` (`idlocation` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `routeLoc`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `routeLoc` (
  `idrouteLoc` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `user_iduser` INT UNSIGNED NOT NULL ,
  `route_idroute` INT UNSIGNED NOT NULL ,
  `location_idlocation` INT UNSIGNED NOT NULL ,
  `battery` DECIMAL NULL DEFAULT NULL ,
  `signalStrength` DECIMAL NULL DEFAULT NULL ,
  PRIMARY KEY (`idrouteLoc`) ,
  INDEX `routeLoc_FKIndex1` (`location_idlocation` ASC) ,
  INDEX `routeLoc_FKIndex2` (`route_idroute` ASC) ,
  INDEX `routeLoc_FKIndex3` (`user_iduser` ASC) ,
  CONSTRAINT `fk_{79E0CE3E-45DD-4151-899D-CC0C45C23B7C}`
    FOREIGN KEY (`location_idlocation` )
    REFERENCES `location` (`idlocation` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_{5E6CE9B0-1931-4CD0-AD45-8F63F5B37198}`
    FOREIGN KEY (`route_idroute` )
    REFERENCES `route` (`idroute` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_{9FDE553F-216F-40E6-9B4A-481525FF6CE0}`
    FOREIGN KEY (`user_iduser` )
    REFERENCES `user` (`iduser` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
