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
import utbm.factures.model.Paiement;
import utbm.factures.model.Reduction;
import utbm.factures.services.BDService;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

/**
 * C'est un contrôlleur Rest.
 * Il renvoie les données sous forme de JSON.
 */
@RestController
@RequestMapping(value = "paiement/*", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class PaiementController {

    private final BDService bdService;

    /**
     * Spring Boot s'occupe de lier les instances pour qu'elles soient utilisables n'importe où.
     */
    @Autowired
    public PaiementController(BDService bdService) {
        this.bdService = bdService;
    }

    @PostMapping(value = "/creation")
    public JSONObject creation(@RequestBody Paiement paiement) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la création d'un paiement.");
        }

        String procedureCall = "{CALL creation_paiement(?, ?, ?, ?, ?, ?)}";
        Object[] entrees = {paiement.getIdFacture(), paiement.getType(), paiement.getDate(),paiement.getMontant(),paiement.getDescription()};
        int[] sorties = {Types.INTEGER};
        String[] nomSorties = {"id_paiement"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/")
    public JSONObject get(@RequestParam(value = "id_paiement") String id_paiement) {

        String requete = "SELECT * FROM paiement WHERE id_paiement="+id_paiement;
        String[] nomSorties = {"id_paiement", "id_type_paiement","date_paiement","montant_paiement","description_paiement","archive"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("Le paiement n'existe pas.");
        }
    }

    @PostMapping(value = "/all")
    public JSONArray get() {

        String requete = "SELECT * FROM paiement";
        String[] nomSorties = {"id_paiement", "id_type_paiement","date_paiement","montant_paiement","description_paiement","archive"};
        return this.bdService.select(requete, nomSorties);
    }

    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }
}


