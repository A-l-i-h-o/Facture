package utbm.factures.api;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
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
@RequestMapping(value = "parent/*", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class ParentController {

    private final BDService bdService;

    /**
     * Spring Boot s'occupe de lier les instances pour qu'elles soient utilisables n'importe où.
     */
    @Autowired
    public ParentController(BDService bdService) {
        this.bdService = bdService;
    }

    @PostMapping(value = "/creation")
    public JSONObject creation(@RequestBody Parent parent) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la création d'un parent.");
        }

        String procedureCall = "{CALL recuperation_id_parent(?, ?, ?, ?, ?, ?, ?)}";
        Object[] entrees = {parent.getIdFamille(), parent.getStatut(), parent.getNom(), parent.getPrenom(), parent.getAdresse(), parent.getAdresseEmail()};
        int[] sorties = {Types.INTEGER};
        String[] nomSorties = {"id"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/modification")
    public JSONObject modification(@RequestBody Parent parent) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la modification d'un parent.");
        }

        String procedureCall = "{CALL modification_parent(?,?,?,?,?,?)}";
        Object[] entrees = {parent.getId(), parent.getStatut(), parent.getNom(), parent.getPrenom(),parent.getAdresse(), parent.getAdresseEmail()};
        int[] sorties = {};
        String[] nomSorties = {};
        JSONObject retour = this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);

        try{
            return this.get(""+parent.getId());
        }catch (Exception e){
            return retour;
        }
    }

    @PostMapping(value = "/")
    public JSONObject get(@RequestParam(value = "id_parent") String id_parent) {

        String requete = "SELECT * FROM parent WHERE id_parent="+id_parent;
        String[] nomSorties = {"id","idStatut","nom","prenom","adresse","adresseEmail","archive"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("Le parent n'existe pas.");
        }
    }

    @PostMapping(value = "/all")
    public JSONArray get() {

        String requete = "SELECT * FROM parent";
        String[] nomSorties = {"id","idStatut","nom","prenom","adresse","adresseEmail","archive"};
        return this.bdService.select(requete, nomSorties);
    }

    @PostMapping(value = "/archiver")
    public JSONObject archiver(@RequestParam(value = "id_parent") String id_parent) {

        String requete = "UPDATE parent SET archive=1 WHERE id_parent=?";
        Object[] params = {id_parent};
        try {
            this.bdService.update(requete, params);
            return this.get(id_parent);
        }catch (Exception e){
            return messageErreurRetour("Le parent n'existe pas.");
        }
    }

    @PostMapping(value = "/desarchiver")
    public JSONObject desarchiver(@RequestParam(value = "id_parent") String id_parent) {

        String requete = "UPDATE parent SET archive=0 WHERE id_parent=?";
        Object[] params = {id_parent};
        try {
            this.bdService.update(requete, params);
            return this.get(id_parent);
        }catch (Exception e){
            return messageErreurRetour("Le parent n'existe pas.");
        }
    }

    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }
}


