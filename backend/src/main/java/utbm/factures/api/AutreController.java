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
import utbm.factures.model.Utilisateur;
import utbm.factures.services.BDService;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

/**
 * C'est un contrôlleur Rest.
 * Il renvoie les données sous forme de JSON.
 */
@RestController
@RequestMapping(value = "", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class AutreController {

    private final BDService bdService;

    /**
     * Spring Boot s'occupe de lier les instances pour qu'elles soient utilisables n'importe où.
     */
    @Autowired
    public AutreController(BDService bdService) {
        this.bdService = bdService;
    }

    @PostMapping(value = "/etat_paiement")
    public JSONObject etat_paiement(@RequestParam(value = "id_etat_paiement") String id_etat_paiement) {

        String requete = "SELECT * FROM etat_paiement WHERE id_etat_paiement="+id_etat_paiement;
        String[] nomSorties = {"id","libelle"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("L'etat paiement n'existe pas.'");
        }
    }
    @PostMapping(value = "/etat_paiement/all")
    public JSONArray etat_paiement_all() {

        String requete = "SELECT * FROM id_etat_paiement";
        String[] nomSorties = {"id","libelle"};
        return this.bdService.select(requete, nomSorties);
    }

    @PostMapping(value = "/periode")
    public JSONObject periode(@RequestParam(value = "id_periode") String id_periode) {

        String requete = "SELECT * FROM periode WHERE id_periode="+id_periode;
        String[] nomSorties = {"id","idReduction","libelle"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("La periode n'existe pas.");
        }
    }
    @PostMapping(value = "/periode/all")
    public JSONArray periode_all() {

        String requete = "SELECT * FROM periode";
        String[] nomSorties = {"id","idReduction","libelle"};
        return this.bdService.select(requete, nomSorties);
    }

    @PostMapping(value = "/statut_parent")
    public JSONObject statut_parent(@RequestParam(value = "id_statut_parent") String id_statut_parent) {

        String requete = "SELECT * FROM statut_parent WHERE id_statut_parent="+id_statut_parent;
        String[] nomSorties = {"id","libelle"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("Le statut parent n'existe pas.");
        }
    }
    @PostMapping(value = "/statut_parent/all")
    public JSONArray statut_parent_all() {

        String requete = "SELECT * FROM statut_parent";
        String[] nomSorties = {"id","libelle"};
        return this.bdService.select(requete, nomSorties);
    }

    @PostMapping(value = "/type_frais")
    public JSONObject type_frais(@RequestParam(value = "id_type_frais") String id_type_frais) {

        String requete = "SELECT * FROM type_frais WHERE id_type_frais="+id_type_frais;
        String[] nomSorties = {"id","libelle"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("Le type frais n'existe pas.");
        }
    }
    @PostMapping(value = "/type_frais/all")
    public JSONArray type_frais_all() {

        String requete = "SELECT * FROM type_frais";
        String[] nomSorties = {"id","libelle"};
        return this.bdService.select(requete, nomSorties);
    }

    @PostMapping(value = "/type_paiement")
    public JSONObject type_paiement(@RequestParam(value = "id_type_paiement") String id_type_paiement) {

        String requete = "SELECT * FROM type_paiement WHERE id_type_paiement="+id_type_paiement;
        String[] nomSorties = {"id","libelle"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("Le type paiement n'existe pas.");
        }
    }
    @PostMapping(value = "/type_paiement/all")
    public JSONArray type_paiement_all() {

        String requete = "SELECT * FROM type_paiement";
        String[] nomSorties = {"id","libelle"};
        return this.bdService.select(requete, nomSorties);
    }

    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }
}


