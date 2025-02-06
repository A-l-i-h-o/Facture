DROP DATABASE IF EXISTS Facture;
CREATE DATABASE Facture;
USE Facture;

-- ************************* DÉBUT - Gestion des comptes utilisateur ********************************* --
CREATE TABLE utilisateur(
	id_user int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	mdp VARCHAR(255) NOT NULL,
	login VARCHAR (255) NOT NULL,
	archive BOOLEAN DEFAULT FALSE,
	admin BOOLEAN DEFAULT NULL,
	UNIQUE(login)
);

INSERT INTO utilisateur(login,mdp,admin) VALUES ("admin","admin",true);
INSERT INTO utilisateur(login,mdp,admin) VALUES ("Jdupont","Jdupont",false);
INSERT INTO utilisateur(login,mdp,admin) VALUES ("Mdurand","Mdurand",false);

-- ************************** FIN - Gestion des comptes utilisateur ********************************* --
-- ************************** DÉBUT - Gestion des familles********* ********************************** --
CREATE TABLE famille(
	id_famille int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_user int(11) NOT NULL,
	archive BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (id_user) REFERENCES utilisateur(id_user),
	UNIQUE (id_user)
);

INSERT INTO famille(id_user) VALUES (2);
INSERT INTO famille(id_user) VALUES (3);

CREATE TABLE enfant(
	id_enfant int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	nom_enfant VARCHAR(255) NOT NULL,
	prenom_enfant VARCHAR(255) NOT NULL,
	age_enfant int NOT NULL,
	archive BOOLEAN DEFAULT FALSE
);

INSERT INTO enfant(nom_enfant, prenom_enfant, age_enfant) VALUES ("Dupont", "Jack", 10);
INSERT INTO enfant(nom_enfant, prenom_enfant, age_enfant) VALUES ("Durand", "Mathilde", 8);

CREATE TABLE liste_enfant(
	id_enfant int(11) NOT NULL,
	id_famille int(11) NOT NULL,
	FOREIGN KEY (id_famille) REFERENCES famille(id_famille),
	FOREIGN KEY (id_enfant) REFERENCES enfant(id_enfant),
	UNIQUE (id_enfant, id_famille)
);

INSERT INTO liste_enfant(id_enfant, id_famille) VALUES (1, 1);
INSERT INTO liste_enfant(id_enfant, id_famille) VALUES (2, 2);

CREATE TABLE statut_parent(
	id_statut_parent int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	libelle_statut_parent VARCHAR(255) NOT NULL
);

INSERT INTO statut_parent(libelle_statut_parent) VALUES ("Marié");
INSERT INTO statut_parent(libelle_statut_parent) VALUES ("Divorcé");
INSERT INTO statut_parent(libelle_statut_parent) VALUES ("Veuf");

CREATE TABLE parent(
	id_parent int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_statut_parent int(11) NOT NULL,
	nom_parent VARCHAR(255) NOT NULL,
	prenom_parent VARCHAR(255) NOT NULL,
	adresse_parent VARCHAR(255) NOT NULL,
	adresse_email_parent VARCHAR(255) NOT NULL,
	archive BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (id_statut_parent) REFERENCES statut_parent(id_statut_parent),
	UNIQUE(adresse_email_parent)
);

INSERT INTO parent(id_statut_parent, nom_parent, prenom_parent, adresse_parent, adresse_email_parent) VALUES (1, "Dupont", "Jean", "1 rue de la paix", "dupont.jean@gmail.com");
INSERT INTO parent(id_statut_parent, nom_parent, prenom_parent, adresse_parent, adresse_email_parent) VALUES (2, "Durand", "Marie", "2 rue de la liberté", "durand.marie@gmail.com");

CREATE TABLE liste_parent(
	id_parent int(11) NOT NULL,
	id_famille int(11) NOT NULL,
	FOREIGN KEY (id_parent) REFERENCES parent(id_parent),
	FOREIGN KEY (id_famille) REFERENCES famille(id_famille),
	UNIQUE (id_parent, id_famille)
);

INSERT INTO liste_parent(id_parent, id_famille) VALUES (1, 1);
INSERT INTO liste_parent(id_parent, id_famille) VALUES (2, 2);

CREATE TABLE reduction(
	id_reduction int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	description_reduction VARCHAR(2048) NOT NULL,
	montant_reduction FLOAT NOT NULL,
	archive BOOLEAN DEFAULT FALSE,
	pourcentage_reduction FLOAT NOT NULL
);

INSERT INTO reduction(description_reduction, montant_reduction, pourcentage_reduction) VALUES ("Pas de réduction", 0, 0);
INSERT INTO reduction(description_reduction, montant_reduction, pourcentage_reduction) VALUES ("Réduction pour les familles nombreuses", 0, 0.1);

CREATE TABLE liste_reduction_enfant(
	id_enfant int(11) DEFAULT NULL,
	id_reduction int(11) DEFAULT NULL,
	FOREIGN KEY (id_enfant) REFERENCES enfant (id_enfant),
	FOREIGN KEY (id_reduction) REFERENCES reduction (id_reduction),
	UNIQUE(id_enfant, id_reduction)
);

CREATE TABLE liste_reduction_famille(
	id_famille int(11) DEFAULT NULL,
	id_reduction int(11) DEFAULT NULL,
	FOREIGN KEY (id_famille) REFERENCES famille (id_famille),
	FOREIGN KEY (id_reduction) REFERENCES reduction (id_reduction),
	UNIQUE(id_famille, id_reduction)
);
-- ************************** FIN - Gestion des familles ******************************************* --
-- ************************** DÉBUT - Gestion des factures ******************************************* --
CREATE TABLE etat_paiement(
	id_etat_paiement int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	libelle_etat_paiement VARCHAR(255) NOT NULL
);

INSERT INTO etat_paiement(libelle_etat_paiement) VALUES ("Non payée");
INSERT INTO etat_paiement(libelle_etat_paiement) VALUES ("Partiellement payée");
INSERT INTO etat_paiement(libelle_etat_paiement) VALUES ("Payée");

CREATE TABLE periode(
	id_periode int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_reduction int(11) NOT NULL,
	libelle_periode VARCHAR(255) NOT NULL,
	FOREIGN KEY (id_reduction) REFERENCES reduction(id_reduction)
);

INSERT INTO periode(id_reduction, libelle_periode) VALUES (1, "1er trimestre");
INSERT INTO periode(id_reduction, libelle_periode) VALUES (1, "2ème trimestre");
INSERT INTO periode(id_reduction, libelle_periode) VALUES (1, "3ème trimestre");

CREATE TABLE facture(
	id_facture int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_periode int(11) NOT NULL,
	id_etat_paiement int (11) NOT NULL,
	description_facture VARCHAR(2048) NOT NULL,
	creancier VARCHAR(255) NOT NULL,
	debiteur VARCHAR(255) NOT NULL,
	date_creation_facture DATE NOT NULL,
	date_paiment_total_facture DATE DEFAULT NULL,
	date_echeance_facture DATE NOT NULL,
	archive BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (id_periode) REFERENCES periode(id_periode),
	FOREIGN KEY (id_etat_paiement) REFERENCES etat_paiement(id_etat_paiement)
);

INSERT INTO facture(id_periode, id_etat_paiement, description_facture, creancier, debiteur, date_creation_facture, date_echeance_facture) VALUES (1, 1, "Facture pour le 1er trimestre", "Cantine", "Famille", "2020-01-01", "2020-01-31");
INSERT INTO facture(id_periode, id_etat_paiement, description_facture, creancier, debiteur, date_creation_facture, date_echeance_facture) VALUES (2, 1, "Facture pour le 2ème trimestre", "Cantine", "Famille", "2020-04-01", "2020-04-30");
INSERT INTO facture(id_periode, id_etat_paiement, description_facture, creancier, debiteur, date_creation_facture, date_echeance_facture) VALUES (3, 1, "Facture pour le 3ème trimestre", "Cantine", "Famille", "2020-07-01", "2020-07-31");

CREATE TABLE historique_facture(
	id_facture int(11) NOT NULL,
	id_famille int(11) NOT NULL,
	FOREIGN KEY(id_facture) REFERENCES facture(id_facture),
	FOREIGN KEY(id_famille) REFERENCES famille(id_famille),
	UNIQUE(id_facture, id_famille)
);

INSERT INTO historique_facture(id_facture, id_famille) VALUES (1, 1);
INSERT INTO historique_facture(id_facture, id_famille) VALUES (2, 1);
INSERT INTO historique_facture(id_facture, id_famille) VALUES (3, 1);

CREATE TABLE type_frais(
	id_type_frais int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	libelle_type_frais VARCHAR(255) NOT NULL,
	UNIQUE(libelle_type_frais)
);

INSERT INTO type_frais(libelle_type_frais) VALUES ("Cantine");
INSERT INTO type_frais(libelle_type_frais) VALUES ("Garderie");

CREATE TABLE frais(
	id_frais int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_type_frais int(11) NOT NULL,
	id_reduction int(11) DEFAULT NULL,
	date_creation_frais DATE NOT NULL,
	montant_frais FLOAT NOT NULL,
	description_frais VARCHAR(2048) NOT NULL,
	archive BOOLEAN DEFAULT FALSE,
	FOREIGN KEY(id_type_frais) REFERENCES type_frais(id_type_frais),
	FOREIGN KEY(id_reduction) REFERENCES reduction(id_reduction)
);

INSERT INTO frais(id_type_frais, date_creation_frais, montant_frais, description_frais) VALUES (1, "2020-01-01", 100, "Frais de cantine pour le 1er trimestre");
INSERT INTO frais(id_type_frais, date_creation_frais, montant_frais, description_frais) VALUES (1, "2020-04-01", 100, "Frais de cantine pour le 2ème trimestre");
INSERT INTO frais(id_type_frais, date_creation_frais, montant_frais, description_frais) VALUES (1, "2020-07-01", 100, "Frais de cantine pour le 3ème trimestre");

CREATE TABLE liste_frais_facture(
	id_facture int(11) NOT NULL,
	id_frais int(11) NOT NULL,
	FOREIGN KEY (id_facture) REFERENCES facture(id_facture),
	FOREIGN KEY (id_frais) REFERENCES frais(id_frais),
	UNIQUE(id_facture, id_frais)
);

INSERT INTO liste_frais_facture(id_facture, id_frais) VALUES (1, 1);
INSERT INTO liste_frais_facture(id_facture, id_frais) VALUES (2, 2);
INSERT INTO liste_frais_facture(id_facture, id_frais) VALUES (3, 3);

CREATE TABLE type_paiement(
	id_type_paiement int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	libelle_type_paiement VARCHAR(255)
);

INSERT INTO type_paiement(libelle_type_paiement) VALUES ("Espèces");
INSERT INTO type_paiement(libelle_type_paiement) VALUES ("Chèque");
INSERT INTO type_paiement(libelle_type_paiement) VALUES ("Carte bancaire");

CREATE TABLE paiement(
	id_paiement int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_type_paiement int(11) NOT NULL,
	date_paiement DATE NOT NULL,
	montant_paiement FLOAT NOT NULL,
	description_paiement VARCHAR(2048) NOT NULL,
	archive BOOLEAN DEFAULT FALSE,
	FOREIGN KEY(id_type_paiement) REFERENCES type_paiement(id_type_paiement)
);

CREATE TABLE liste_paiement_facture(
	id_facture int(11) NOT NULL,
	id_paiement int(11) NOT NULL,
	FOREIGN KEY(id_facture) REFERENCES facture(id_facture),
	FOREIGN KEY(id_paiement) REFERENCES paiement(id_paiement),
	UNIQUE(id_facture, id_paiement) 
);
-- ************************** FIN  Gestion des factures ******************************************* --