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
import utbm.factures.model.Frais;
import utbm.factures.model.Parent;
import utbm.factures.services.BDService;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

/**
 * C'est un contrôlleur Rest.
 * Il renvoie les données sous forme de JSON.
 */
@RestController
@RequestMapping(value = "frais/*", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class FraisController {

    private final BDService bdService;

    /**
     * Spring Boot s'occupe de lier les instances pour qu'elles soient utilisables n'importe où.
     */
    @Autowired
    public FraisController(BDService bdService) {
        this.bdService = bdService;
    }

    @PostMapping(value = "/creation")
    public JSONObject creation(@RequestBody Frais frais) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la création d'un frais.");
        }

        String procedureCall = "{CALL creation_frais(?, ?, ?, ?, ?, ?)}";
        Object[] entrees = {frais.getType(), frais.getIdReduction(), frais.getDateCreation(), frais.getMontant(), frais.getDescription()};
        int[] sorties = {Types.INTEGER};
        String[] nomSorties = {"id_frais"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/liaison_facture")
    public JSONObject liaison_facture(@RequestBody Frais frais) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la liaison d'un frais à une facture.");
        }

        String procedureCall = "{CALL liaison_frais_facture(?, ?)}";
        Object[] entrees = {frais.getIdFacture(), frais.getId()};
        int[] sorties = {};
        String[] nomSorties = {};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/")
    public JSONObject get(@RequestParam(value = "id_frais") String id_frais) {

        String requete = "SELECT * FROM frais WHERE id_frais="+id_frais;
        String[] nomSorties = {"id_frais","id_type_frais","id_reduction","date_creation_frais","montant_frais","description_frais","archive"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("Le frais n'existe pas.");
        }
    }

    @PostMapping(value = "/all")
    public JSONArray get() {

        String requete = "SELECT * FROM frais";
        String[] nomSorties = {"id_frais","id_type_frais","id_reduction","date_creation_frais","montant_frais","description_frais","archive"};
        return this.bdService.select(requete, nomSorties);
    }

    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }
}


