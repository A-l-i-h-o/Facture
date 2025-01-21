package utbm.factures.services;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.annotation.PostConstruct;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import utbm.factures.utils.Json;
import utbm.factures.utils.Log;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BDService {

    private static final String URL = "jdbc:mysql://localhost:3306/facture"; // Correction de l'URL JDBC avec le port par défaut MySQL
    private static final String USER = "root";
    private static final String PASSWORD = "";
    private Connection connection;
    private int idUtilisateur;
    private Boolean admin;

    @PostConstruct
    public void init() {
        Log.info("BDService", "Connexion à la base de données...");
        this.connexion();
        this.idUtilisateur = -1;
        this.admin = false;
    }

    private void connexion() {
        while (true) {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                // En Java moderne, l'enregistrement manuel du driver n'est plus nécessaire
                this.connection = DriverManager.getConnection(URL, USER, PASSWORD);
                Log.info("BDService", "Connexion réussie à la base de données.");
                break; // Sort de la boucle après une connexion réussie
            } catch (SQLException e) {
                Log.error("BDService", "Erreur lors de la connexion : " + e.getMessage());
                Log.info("BDService", "Nouvelle tentative dans 1 seconde...");
                try {
                    Thread.sleep(1000); // Pause avant une nouvelle tentative
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt(); // Restaurer l'état d'interruption
                    Log.error("BDService", "Tentative de connexion interrompue.");
                    throw new RuntimeException("Tentative de connexion interrompue", ex);
                }
            } catch (ClassNotFoundException e) {
                throw new RuntimeException(e);
            }
        }
    }


    public JSONObject procedure(String procedureCall, Object[] entrees, int[] sorties, String[] nomSorties) {
        Map<String, Object> result = new HashMap<>();
        try (CallableStatement callableStatement = connection.prepareCall(procedureCall)) {
            // Assigner les paramètres IN
            int post = 1;

            for (Object obj : entrees) {
                callableStatement.setObject(post, obj);
                post++;
            }

            int startPostRetour = post;

            // Assigner les paramètres OUT
            int a = sorties.length;
            for (int i = 0; i < sorties.length; i++) {
                callableStatement.registerOutParameter(post, sorties[i]);
                post++;
            }

            // Exécuter la procédure stockée
            callableStatement.execute();

            // Récupérer les valeurs des paramètres OUT
            for (int i = 0; i < sorties.length; i++) {
                // Mettre dans le map avec le nom des paramètres de sortie
                result.put(nomSorties[i], callableStatement.getObject(startPostRetour + i));
            }

        } catch (SQLException e) {
            result.put("error", "Erreur lors de l'exécution de la procédure stockée : " + e.getMessage());
        }

        // Convertir le résultat en JSONObject
        return new JSONObject(result);
    }

    public JSONArray select(String requete, String[] nomSorties) {
        List<Map<String, Object>> resultList = new ArrayList<>();
        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(requete)) {

            // Traitement des résultats
            while (resultSet.next()) {
                Map<String, Object> result = new HashMap<>();
                for (int i = 0; i < nomSorties.length; i++) {
                    result.put(nomSorties[i], resultSet.getObject(i + 1));  // i + 1 car les index de ResultSet commencent à 1
                }
                resultList.add(result); // Ajouter chaque ligne dans la liste de résultats
            }

        } catch (SQLException e) {
            System.err.println("Erreur lors de l'exécution de la requête SELECT : " + e.getMessage());
        }

        JSONArray jsonArray = new JSONArray();

        // Ajouter chaque élément de la liste à JSONArray
        for (Map<String, Object> map : resultList) {
            JSONObject jsonObject = new JSONObject(map); // Convertir chaque Map en JSONObject
            jsonArray.add(jsonObject); // Ajouter au JSONArray
        }

        return jsonArray;
    }

    public Connection getConnection() {
        if (this.connection == null) {
            throw new IllegalStateException("Connexion à la base de données non initialisée.");
        }
        return this.connection;
    }

    public int getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(int idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }
}

