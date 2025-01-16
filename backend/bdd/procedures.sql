DROP PROCEDURE IF EXISTS connexion;

DELIMITER //

CREATE PROCEDURE connexion(
    IN v_login VARCHAR(255),
    IN v_mdp VARCHAR(255) ,
    OUT v_connexion BOOLEAN,
    OUT v_id_user INT,
    OUT v_admin BOOLEAN
)
BEGIN
    -- Initialisation des valeurs de sortie
    SET v_connexion = FALSE;
    SET v_id_user = NULL;
    SET v_admin = FALSE;

    -- Vérification des informations de connexion
    IF EXISTS (
        SELECT 1 
        FROM utilisateur 
        WHERE login = v_login AND mdp = v_mdp
    ) THEN
        SET v_connexion = TRUE;
        
        -- Récupération des informations de l'utilisateur
        SELECT id_user, admin 
        INTO v_id_user, v_admin
        FROM utilisateur
        WHERE login = v_login AND mdp = v_mdp;
    END IF;
END //

DELIMITER ;


DROP PROCEDURE IF EXISTS creation_utilisateur;

DELIMITER //
CREATE PROCEDURE creation_utilisateur(
    IN v_login VARCHAR(255) ,
    IN v_mdp VARCHAR(255) ,
    IN v_admin BOOLEAN ,
    OUT v_id_user INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM utilisateur WHERE mdp = v_mdp AND login = v_login) THEN
       INSERT INTO utilisateur(mdp, login, admin) VALUES (v_mdp, v_login, v_admin);
    END IF;
    SELECT id_user INTO v_id_user 
    FROM utilisateur 
    WHERE mdp = v_mdp AND login = v_login;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS modification_utilisateur;

DELIMITER //
CREATE PROCEDURE modification_utilisateur(
    IN v_login VARCHAR(255) ,
    IN v_mdp_old VARCHAR(255) ,
    IN v_mdp_new VARCHAR(255) ,
    OUT v_id_user INT
)
BEGIN
    IF EXISTS (SELECT 1 FROM utilisateur WHERE mdp = v_mdp_old AND login = v_login) THEN
        UPDATE utilisateur 
        SET mdp = v_mdp_new 
        WHERE mdp = v_mdp_old AND login = v_login;

        SELECT id_user INTO v_id_user 
        FROM utilisateur 
        WHERE mdp = v_mdp_new AND login = v_login;
    END IF;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS recuperation_id_famille;

DELIMITER //
CREATE PROCEDURE recuperation_id_famille(
    IN v_id_user INT ,
    OUT v_id_famille INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM famille WHERE id_user = v_id_user) THEN
       INSERT INTO famille(id_user) VALUES (v_id_user);
    END IF;
    SELECT id_famille INTO v_id_famille 
    FROM famille 
    WHERE id_user = v_id_user;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS recuperation_id_enfant;

DELIMITER //
CREATE PROCEDURE recuperation_id_enfant(
    IN v_id_famille INT ,
    IN v_nom VARCHAR(255) ,
    IN v_prenom VARCHAR(255) ,
    IN v_age INT ,
    OUT v_id_enfant INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM enfant WHERE nom_enfant = v_nom AND prenom_enfant = v_prenom AND age_enfant = v_age) THEN
       INSERT INTO enfant(nom_enfant, prenom_enfant, age_enfant) 
       VALUES (v_nom, v_prenom, v_age);
    END IF;
    SELECT id_enfant INTO v_id_enfant 
    FROM enfant 
    WHERE nom_enfant = v_nom AND prenom_enfant = v_prenom AND age_enfant = v_age;

    IF NOT EXISTS (SELECT 1 FROM liste_enfant WHERE id_enfant = v_id_enfant AND id_famille = v_id_famille) THEN
       INSERT INTO liste_enfant(id_enfant, id_famille) 
       VALUES (v_id_enfant, v_id_famille);
    END IF;    
END //
DELIMITER ;
DROP PROCEDURE IF EXISTS recuperation_id_parent;

DELIMITER //
CREATE PROCEDURE recuperation_id_parent(
    IN v_id_famille INT ,
    IN v_libelle_statut_parent VARCHAR(255) ,
    IN v_nom_parent VARCHAR(255) ,
    IN v_prenom_parent VARCHAR(255) ,
    IN v_adresse_parent VARCHAR(255) ,
    IN v_adresse_email_parent VARCHAR(255) ,
    OUT v_id_parent INT
)
BEGIN
    DECLARE v_id_statut_parent INT;

    IF NOT EXISTS (SELECT 1 FROM statut_parent WHERE libelle_statut_parent = v_libelle_statut_parent) THEN
       INSERT INTO statut_parent(libelle_statut_parent) VALUES (v_libelle_statut_parent);
    END IF;
    SELECT id_statut_parent INTO v_id_statut_parent 
    FROM statut_parent 
    WHERE libelle_statut_parent = v_libelle_statut_parent;

    IF NOT EXISTS (SELECT 1 FROM parent 
                   WHERE nom_parent = v_nom_parent AND prenom_parent = v_prenom_parent AND adresse_email_parent = v_adresse_email_parent) THEN
       INSERT INTO parent(id_statut_parent, nom_parent, prenom_parent, adresse_parent, adresse_email_parent) 
       VALUES (v_id_statut_parent, v_nom_parent, v_prenom_parent, v_adresse_parent, v_adresse_email_parent);
    END IF;
    SELECT id_parent INTO v_id_parent 
    FROM parent 
    WHERE nom_parent = v_nom_parent AND prenom_parent = v_prenom_parent AND adresse_email_parent = v_adresse_email_parent;

    IF NOT EXISTS (SELECT 1 FROM liste_parent WHERE id_parent = v_id_parent AND id_famille = v_id_famille) THEN
       INSERT INTO liste_parent(id_parent, id_famille) 
       VALUES (v_id_parent, v_id_famille);
    END IF;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS creation_frais;

DELIMITER //
CREATE PROCEDURE creation_frais(
    IN v_libelle_type_frais VARCHAR(255) ,
    IN v_id_reduction INT ,
    IN v_date_creation_frais DATE ,
    IN v_montant_frais FLOAT ,
    IN v_description_frais VARCHAR(2048) ,
    OUT v_id_frais INT
)
BEGIN
    DECLARE v_id_type_frais INT;

    IF NOT EXISTS (SELECT 1 FROM type_frais WHERE libelle_type_frais = v_libelle_type_frais) THEN
       INSERT INTO type_frais(libelle_type_frais) VALUES (v_libelle_type_frais);
    END IF;
    SELECT id_type_frais INTO v_id_type_frais 
    FROM type_frais 
    WHERE libelle_type_frais = v_libelle_type_frais;

    INSERT INTO frais(id_type_frais, id_reduction, date_creation_frais, montant_frais, description_frais) 
    VALUES (v_id_type_frais, v_id_reduction, v_date_creation_frais, v_montant_frais, v_description_frais);

    SET v_id_frais = LAST_INSERT_ID();
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS liaison_frais_facture;

DELIMITER //
CREATE PROCEDURE liaison_frais_facture(
    IN v_id_facture INT ,
    IN v_id_frais INT 
)
BEGIN    
    IF NOT EXISTS (SELECT 1 FROM liste_frais_facture WHERE id_facture = v_id_facture AND id_frais = v_id_frais) THEN
       INSERT INTO liste_frais_facture(id_facture, id_frais) 
       VALUES (v_id_facture, v_id_frais);
    END IF;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS creation_facture;

DELIMITER //
CREATE PROCEDURE creation_facture(
    IN v_libelle_periode VARCHAR(255) ,
    IN v_id_reduction INT ,
    IN v_libelle_etat_paiement VARCHAR(255) ,
    IN v_description_facture VARCHAR(2048) ,
    IN v_creancier VARCHAR(255) ,
    IN v_debiteur VARCHAR(255) ,
    IN v_date_creation_facture DATE ,
    IN v_date_paiment_total_facture DATE ,
    IN v_date_echeance_facture DATE ,
    OUT v_id_facture INT
)
BEGIN
    DECLARE v_id_etat_paiement INT;
    DECLARE v_id_periode INT;

    IF NOT EXISTS (SELECT 1 FROM etat_paiement WHERE libelle_etat_paiement = v_libelle_etat_paiement) THEN
       INSERT INTO etat_paiement(libelle_etat_paiement) VALUES (v_libelle_etat_paiement);
    END IF;
    SELECT id_etat_paiement INTO v_id_etat_paiement 
    FROM etat_paiement 
    WHERE libelle_etat_paiement = v_libelle_etat_paiement;

    IF NOT EXISTS (SELECT 1 FROM periode WHERE id_reduction = v_id_reduction AND libelle_periode = v_libelle_periode) THEN
       INSERT INTO periode(id_reduction, libelle_periode) VALUES (v_id_reduction, v_libelle_periode);
    END IF;
    SELECT id_periode INTO v_id_periode 
    FROM periode 
    WHERE id_reduction = v_id_reduction AND libelle_periode = v_libelle_periode;

    INSERT INTO facture(id_periode, id_etat_paiement, description_facture, creancier, debiteur, date_creation_facture, date_paiment_total_facture, date_echeance_facture) 
    VALUES (v_id_periode, v_id_etat_paiement, v_description_facture, v_creancier, v_debiteur, v_date_creation_facture, v_date_paiment_total_facture, v_date_echeance_facture);

    SET v_id_facture = LAST_INSERT_ID();
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS liaison_famille_facture;

DELIMITER //
CREATE PROCEDURE liaison_famille_facture(
    IN v_id_famille INT ,
    IN v_id_facture INT 
)
BEGIN    
    IF NOT EXISTS (SELECT 1 FROM historique_facture WHERE id_famille = v_id_famille AND id_facture = v_id_facture) THEN
       INSERT INTO historique_facture(id_famille, id_facture) 
       VALUES (v_id_famille, v_id_facture);
    END IF;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS paiement;

DELIMITER //
CREATE PROCEDURE paiement(
    IN v_id_facture INT ,
    IN v_libelle_type_paiement VARCHAR(255),
    IN v_date_paiement DATE ,
    IN v_montant_paiement FLOAT ,
    IN v_description_paiement VARCHAR(2048) 
)
BEGIN    
    DECLARE v_id_type_paiement INT;
    DECLARE v_id_paiement INT;

    IF NOT EXISTS (SELECT 1 FROM type_paiement WHERE libelle_type_paiement = v_libelle_type_paiement) THEN
       INSERT INTO type_paiement(libelle_type_paiement) VALUES (v_libelle_type_paiement);
    END IF;
    SELECT id_type_paiement INTO v_id_type_paiement 
    FROM type_paiement 
    WHERE libelle_type_paiement = v_libelle_type_paiement;

    INSERT INTO paiement(id_type_paiement, date_paiement, montant_paiement, description_paiement) 
    VALUES (v_id_type_paiement, v_date_paiement, v_montant_paiement, v_description_paiement);

    SET v_id_paiement = LAST_INSERT_ID();

    INSERT INTO liste_paiement_facture(id_facture, id_paiement) 
    VALUES (v_id_facture, v_id_paiement);
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS ajout_reduction;

DELIMITER //
CREATE PROCEDURE ajout_reduction(
    IN v_description_reduction VARCHAR(2048) ,
    IN v_montant_reduction FLOAT ,
    IN v_pourcentage_reduction FLOAT ,
    OUT v_id_reduction INT
)
BEGIN    
    IF NOT EXISTS (SELECT 1 FROM reduction 
                   WHERE description_reduction = v_description_reduction AND montant_reduction = v_montant_reduction AND pourcentage_reduction = v_pourcentage_reduction) THEN
       INSERT INTO reduction(description_reduction, montant_reduction, pourcentage_reduction) 
       VALUES (v_description_reduction, v_montant_reduction, v_pourcentage_reduction);
    END IF;
    SELECT id_reduction INTO v_id_reduction 
    FROM reduction 
    WHERE description_reduction = v_description_reduction AND montant_reduction = v_montant_reduction AND pourcentage_reduction = v_pourcentage_reduction;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS liaison_reduction_famille;

DELIMITER //
CREATE PROCEDURE liaison_reduction_famille(
    IN v_id_famille INT ,
    IN v_id_reduction INT 
)
BEGIN    
    IF NOT EXISTS (SELECT 1 FROM liste_reduction_famille WHERE id_famille = v_id_famille AND id_reduction = v_id_reduction) THEN
       INSERT INTO liste_reduction_famille(id_famille, id_reduction) 
       VALUES (v_id_famille, v_id_reduction);
    END IF;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS liaison_reduction_enfant;

DELIMITER //
CREATE PROCEDURE liaison_reduction_enfant(
    IN v_id_enfant INT ,
    IN v_id_reduction INT 
)
BEGIN    
    IF NOT EXISTS (SELECT 1 FROM liste_reduction_enfant WHERE id_enfant = v_id_enfant AND id_reduction = v_id_reduction) THEN
       INSERT INTO liste_reduction_enfant(id_enfant, id_reduction) 
       VALUES (v_id_enfant, v_id_reduction);
    END IF;
END //
DELIMITER ;
