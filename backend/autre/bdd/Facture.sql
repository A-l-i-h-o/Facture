DROP DATABASE IF EXISTS Facture;
CREATE DATABASE Facture;
USE Facture;

-- ************************* DÉBUT - Gestion des comptes utilisateur ********************************* --
CREATE TABLE utilisateur(
	id_user int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	mdp VARCHAR(255) NOT NULL,
	login VARCHAR (255) NOT NULL,
	archive BOOL DEFAULT FALSE,
	admin BOOLEAN DEFAULT NULL,
	UNIQUE(login)
);

INSERT INTO utilisateur(login,mdp,admin) VALUES ("admin","admin",true);
-- ************************** FIN - Gestion des comptes utilisateur ********************************* --
-- ************************** DÉBUT - Gestion des familles********* ********************************** --
CREATE TABLE famille(
	id_famille int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_user int(11) NOT NULL,
	archive BOOL DEFAULT FALSE,
	FOREIGN KEY (id_user) REFERENCES utilisateur(id_user),
	UNIQUE (id_user)
);

CREATE TABLE enfant(
	id_enfant int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	nom_enfant VARCHAR(255) NOT NULL,
	prenom_enfant VARCHAR(255) NOT NULL,
	age_enfant int NOT NULL,
	archive BOOL DEFAULT FALSE
);

CREATE TABLE liste_enfant(
	id_enfant int(11) NOT NULL,
	id_famille int(11) NOT NULL,
	FOREIGN KEY (id_famille) REFERENCES famille(id_famille),
	FOREIGN KEY (id_enfant) REFERENCES enfant(id_enfant),
	UNIQUE (id_enfant, id_famille)
);

CREATE TABLE statut_parent(
	id_statut_parent int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	libelle_statut_parent VARCHAR(255) NOT NULL
);

CREATE TABLE parent(
	id_parent int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_statut_parent int(11) NOT NULL,
	nom_parent VARCHAR(255) NOT NULL,
	prenom_parent VARCHAR(255) NOT NULL,
	adresse_parent VARCHAR(255) NOT NULL,
	adresse_email_parent VARCHAR(255) NOT NULL,
	archive BOOL DEFAULT FALSE,
	FOREIGN KEY (id_statut_parent) REFERENCES statut_parent(id_statut_parent),
	UNIQUE(adresse_email_parent)
);

CREATE TABLE liste_parent(
	id_parent int(11) NOT NULL,
	id_famille int(11) NOT NULL,
	FOREIGN KEY (id_parent) REFERENCES parent(id_parent),
	FOREIGN KEY (id_famille) REFERENCES famille(id_famille),
	UNIQUE (id_parent, id_famille)
);

CREATE TABLE reduction(
	id_reduction int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	description_reduction VARCHAR(2048) NOT NULL,
	montant_reduction FLOAT NOT NULL,
	archive BOOL DEFAULT FALSE,
	pourcentage_reduction FLOAT NOT NULL
);

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

CREATE TABLE periode(
	id_periode int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_reduction int(11) NOT NULL,
	libelle_periode VARCHAR(255) NOT NULL,
	FOREIGN KEY (id_reduction) REFERENCES reduction(id_reduction)
);

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
	archive BOOL DEFAULT FALSE,
	FOREIGN KEY (id_periode) REFERENCES periode(id_periode),
	FOREIGN KEY (id_etat_paiement) REFERENCES etat_paiement(id_etat_paiement)
);

CREATE TABLE historique_facture(
	id_facture int(11) NOT NULL,
	id_famille int(11) NOT NULL,
	FOREIGN KEY(id_facture) REFERENCES facture(id_facture),
	FOREIGN KEY(id_famille) REFERENCES famille(id_famille),
	UNIQUE(id_facture, id_famille)
);

CREATE TABLE type_frais(
	id_type_frais int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	libelle_type_frais VARCHAR(255) NOT NULL,
	UNIQUE(libelle_type_frais)
);

CREATE TABLE frais(
	id_frais int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_type_frais int(11) NOT NULL,
	id_reduction int(11) DEFAULT NULL,
	date_creation_frais DATE NOT NULL,
	montant_frais FLOAT NOT NULL,
	description_frais VARCHAR(2048) NOT NULL,
	archive BOOL DEFAULT FALSE,
	FOREIGN KEY(id_type_frais) REFERENCES type_frais(id_type_frais),
	FOREIGN KEY(id_reduction) REFERENCES reduction(id_reduction)
);

CREATE TABLE liste_frais_facture(
	id_facture int(11) NOT NULL,
	id_frais int(11) NOT NULL,
	FOREIGN KEY (id_facture) REFERENCES facture(id_facture),
	FOREIGN KEY (id_frais) REFERENCES frais(id_frais),
	UNIQUE(id_facture, id_frais)
);

CREATE TABLE type_paiement(
	id_type_paiement int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	libelle_type_paiement VARCHAR(255)
);

CREATE TABLE paiement(
	id_paiement int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_type_paiement int(11) NOT NULL,
	date_paiement DATE NOT NULL,
	montant_paiement FLOAT NOT NULL,
	description_paiement VARCHAR(2048) NOT NULL,
	archive BOOL DEFAULT FALSE,
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