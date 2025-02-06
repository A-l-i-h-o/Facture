package utbm.factures.api;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
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
@RequestMapping(value = "reduction/*", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class ReductionController {

    private final BDService bdService;

    /**
     * Spring Boot s'occupe de lier les instances pour qu'elles soient utilisables n'importe où.
     */
    @Autowired
    public ReductionController(BDService bdService) {
        this.bdService = bdService;
    }

    @PostMapping(value = "/creation")
    public JSONObject creation(@RequestBody Reduction reduction) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la création d'une réduction.");
        }

        String procedureCall = "{CALL ajout_reduction(?, ?, ?, ?)}";
        Object[] entrees = {reduction.getDescription(), reduction.getMontant(), reduction.getPourcentage()};
        int[] sorties = {Types.INTEGER};
        String[] nomSorties = {"id"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/liaison_reduction_famille")
    public JSONObject liaison_reduction_famille(@RequestBody Reduction reduction) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la liaison d'une réduction à une famille.");
        }

        String procedureCall = "{CALL liaison_reduction_famille(?, ?)}";
        Object[] entrees = {reduction.getIdFamille(), reduction.getId()};
        int[] sorties = {};
        String[] nomSorties = {};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/liaison_reduction_enfant")
    public JSONObject liaison_reduction_enfant(@RequestBody Reduction reduction) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la liaison d'une réduction à un enfant.");
        }

        String procedureCall = "{CALL liaison_reduction_enfant(?, ?)}";
        Object[] entrees = {reduction.getIdEnfant(), reduction.getId()};
        int[] sorties = {};
        String[] nomSorties = {};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/")
    public JSONObject get(@RequestParam(value = "id_reduction") String id_reduction) {

        String requete = "SELECT * FROM reduction WHERE id_reduction="+id_reduction;
        String[] nomSorties = {"id","description","montant","archive","pourcentage"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("La réduction n'existe pas.");
        }
    }

    @PostMapping(value = "/all")
    public JSONArray get() {

        String requete = "SELECT * FROM reduction";
        String[] nomSorties = {"id","description","montant","archive","pourcentage"};
        return this.bdService.select(requete, nomSorties);
    }
    @PostMapping(value = "/archiver")
    public JSONObject archiver(@RequestParam(value = "id_reduction") String id_reduction) {

        String requete = "UPDATE reduction SET archive=1 WHERE id_reduction=?";
        Object[] params = {id_reduction};
        try {
            this.bdService.update(requete, params);
            return this.get(id_reduction);
        }catch (Exception e){
            return messageErreurRetour("La réduction n'existe pas.");
        }
    }

    @PostMapping(value = "/desarchiver")
    public JSONObject desarchiver(@RequestParam(value = "id_reduction") String id_reduction) {

        String requete = "UPDATE reduction SET archive=0 WHERE id_reduction=?";
        Object[] params = {id_reduction};
        try {
            this.bdService.update(requete, params);
            return this.get(id_reduction);
        }catch (Exception e){
            return messageErreurRetour("La réduction n'existe pas.");
        }
    }


    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }
}


