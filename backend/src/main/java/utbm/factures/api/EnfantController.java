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
import utbm.factures.model.Enfant;
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
@RequestMapping(value = "enfant/*", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class EnfantController {

    private final BDService bdService;

    /**
     * Spring Boot s'occupe de lier les instances pour qu'elles soient utilisables n'importe où.
     */
    @Autowired
    public EnfantController(BDService bdService) {
        this.bdService = bdService;
    }

    @PostMapping(value = "/creation")
    public JSONObject creation(@RequestBody Enfant enfant) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la création d'un enfant.");
        }

        String procedureCall = "{CALL recuperation_id_enfant(?, ?, ?, ?, ?)}";
        Object[] entrees = {enfant.getIdFamille(), enfant.getNom(), enfant.getPrenom(), enfant.getAge()};
        int[] sorties = {Types.INTEGER};
        String[] nomSorties = {"id_enfant"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/modification")
    public JSONObject modification(@RequestBody Enfant enfant) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la modification d'un enfant.");
        }

        String procedureCall = "{CALL modification_enfant(?, ?)}";
        Object[] entrees = {enfant.getId(), enfant.getAge()};
        int[] sorties = {};
        String[] nomSorties = {};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/")
    public JSONObject get(@RequestParam(value = "id_enfant") String id_enfant) {

        String requete = "SELECT * FROM enfant WHERE id_enfant="+id_enfant;
        String[] nomSorties = {"id_enfant","nom_enfant","prenom_enfant","age_enfant","archive"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("L'enfant n'existe pas.");
        }
    }

    @PostMapping(value = "/all")
    public JSONArray get() {

        String requete = "SELECT * FROM enfant";
        String[] nomSorties = {"id_enfant","nom_enfant","prenom_enfant","age_enfant","archive"};
        return this.bdService.select(requete, nomSorties);
    }

    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }
}


