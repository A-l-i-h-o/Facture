/**
 * Classe UsersController : Elle fait partie de l'api. Elle permet de réceptionner les requêtes, de les traîter et de renvoyer des informations.
 * Elle traîte toutes les requêtes liées au jeu.
 */

package utbm.factures.api;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import utbm.factures.model.Facture;
import utbm.factures.services.BDService;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

/**
 * C'est un contrôlleur Rest.
 * Il renvoie les données sous forme de JSON.
 */
@RestController
@RequestMapping(value = "famille/*", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class FamilleController {

    private final BDService bdService;
    private final RestTemplate restTemplate;

    /**
     * Spring Boot s'occupe de lier les instances pour qu'elles soient utilisables n'importe où.
     */
    @Autowired
    public FamilleController(BDService bdService, RestTemplate restTemplate) {
        this.bdService = bdService;
        this.restTemplate = restTemplate;
    }


    @PostMapping(value = "/all_info")
    public JSONObject getAllInfo(@RequestParam(value = "id_famille") String id_famille) {

        JSONObject famille = new JSONObject();

        String requeteParent = "SELECT id_parent FROM liste_parent WHERE id_famille="+id_famille;
        String[] nomSortiesParent  = {"id"};
        JSONArray listeIdParent=  this.bdService.select(requeteParent , nomSortiesParent);

        JSONArray listeParent = new JSONArray();

        for (int i = 0; i < listeIdParent.size(); i++) {
            JSONObject parent = (JSONObject) listeIdParent.get(i);
            int idParent = (int) parent.get("id");

            String url = "http://localhost:9392/parent/?id_parent=" + idParent;
            listeParent.add(restTemplate.getForObject(url, JSONObject.class));
        }

        famille.put("listeParent", listeParent);

        String requeteEnfant = "SELECT id_enfant FROM liste_enfant WHERE id_famille="+id_famille;
        String[] nomSortiesEnfant = {"id"};
        JSONArray listeIdEnfant =  this.bdService.select(requeteEnfant, nomSortiesEnfant);

        JSONArray listeEnfant = new JSONArray();

        for (int i = 0; i < listeIdEnfant.size(); i++) {
            JSONObject enfant = (JSONObject) listeIdEnfant.get(i);
            int idEnfant = (int) enfant.get("id");

            String url = "http://localhost:9392/enfant/all_info?id_enfant=" + idEnfant;
            listeEnfant.add(restTemplate.getForObject(url, JSONObject.class));
        }

        famille.put("listeEnfant", listeEnfant);


        String requeteReduction = "SELECT id_reduction FROM liste_reduction_famille WHERE id_famille="+id_famille;
        String[] nomSortiesReduction = {"id"};
        JSONArray listeIdReduction =  this.bdService.select(requeteReduction, nomSortiesReduction);

        JSONArray listeReduction = new JSONArray();

        for (int i = 0; i < listeIdReduction.size(); i++) {
            JSONObject reduction = (JSONObject) listeIdReduction.get(i);
            int idReduction = (int) reduction.get("id");

            String url = "http://localhost:9392/reduction/?id_reduction=" + idReduction;
            listeReduction.add(restTemplate.getForObject(url, JSONObject.class));
        }

        famille.put("listeReduction", listeReduction);


        String requeteFacture = "SELECT id_facture FROM historique_facture WHERE id_famille="+id_famille;
        String[] nomSortiesFacture= {"id"};
        JSONArray listeIdFacture =  this.bdService.select(requeteFacture, nomSortiesFacture);

        JSONArray listeFacture= new JSONArray();

        for (int i = 0; i < listeIdFacture.size(); i++) {
            JSONObject facture = (JSONObject) listeIdFacture.get(i);
            int idFacture = (int) facture.get("id");

            String url = "http://localhost:9392/facture/all_info?id_facture=" + idFacture;
            listeFacture.add(restTemplate.getForObject(url, JSONObject.class));
        }

        famille.put("listeFacture", listeFacture);

        return famille;
    }

    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }
}


