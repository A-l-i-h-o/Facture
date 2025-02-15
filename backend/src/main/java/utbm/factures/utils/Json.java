/**
 * Classe Json : Gère les fichiers Json du projet.
 */


package utbm.factures.utils;

import com.google.gson.GsonBuilder;
import org.apache.tomcat.util.json.JSONParser;
import org.apache.tomcat.util.json.ParseException;
import org.json.simple.JSONObject;

import java.io.*;
import java.util.Map;

public class Json {

    /**
     * Lit un fichier json et le converti en objet json exploitable.
     * @param src Chemin du fichier.
     * @return L'objet json généré.
     */
    public static JSONObject read(InputStream src) {

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(src))) {
                StringBuilder jsonStr = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonStr.append(line);
                }
            return new JSONObject((Map) new JSONParser(jsonStr.toString()).parse());
        } catch (Exception e) {
            Log.error("Json", "Problème de lecture du fichier : " + src);
            e.printStackTrace();
        }
        return null;
    }

    public static String jsonToString(Object jsonObject) {
        return (new GsonBuilder().setPrettyPrinting().create()).toJson(jsonObject);
    }

    public static JSONObject stringToJsonObject(String text) {
        try {
            return new JSONObject((Map) new JSONParser(text).parse());
        } catch (ParseException e) {
            Log.error("Json", "Problème stringToJsonObject : " + text);
            return null;
        }
    }

    public static JSONObject objectToJsonObject(Map map) {
        return new JSONObject(map);
    }

    /**
     * Enregistre les données jsons dans un fichier json.
     */
    public static void saveMap(String path, Map<Object, Object> data) {
        save(path, new JSONObject(data));
    }
    public static void save(String path, JSONObject data) {
        try {
            FileWriter file = new FileWriter(path);
            file.write(jsonToString(data));
            file.close();
        } catch (IOException e) {
            Log.error("Json", "Problème d'écriture du fichier : " + path);
            e.printStackTrace();
        }
    }
}
