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
@RequestMapping(value = "utilisateur/*", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class UtilisateurController {

    private final BDService bdService;

    /**
     * Spring Boot s'occupe de lier les instances pour qu'elles soient utilisables n'importe où.
     */
    @Autowired
    public UtilisateurController(BDService bdService) {
        this.bdService = bdService;
    }

    @GetMapping(value = "/all")
    public JSONArray getAll() {

        String requete = "SELECT u.id_user AS id, u.login AS login, u.admin AS admin, u.archive AS archive, lf.id_famille AS idfamille FROM utilisateur AS u LEFT JOIN famille AS lf ON u.id_user = lf.id_user";
        String[] nomSorties = {"id","login","admin","archive","idFamille"};
        return this.bdService.select(requete, nomSorties);
    }

    @PostMapping(value = "/connexion")
    public JSONObject connexion(@RequestBody Utilisateur utilisateur) {

        String procedureCall = "{CALL connexion(?, ?, ?, ?, ?)}";
        Object[] entrees = {utilisateur.getLogin(), utilisateur.getMdp()};
        int[] sorties = {Types.BOOLEAN, Types.INTEGER, Types.BOOLEAN};
        String[] nomSorties = {"connexion", "id", "admin"};

        JSONObject result = this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
        try {
            this.bdService.setIdUtilisateur((Integer) result.get("id"));
            this.bdService.setAdmin((Boolean) result.get("admin"));
        } catch (Exception e) {
        }

        return result;
    }

    @PostMapping(value = "/deconnexion")
    public void deconnexion() {
        this.bdService.setIdUtilisateur(-1);
        this.bdService.setAdmin(false);
    }

    @PostMapping(value = "/creation")
    public JSONObject creation(@RequestBody Utilisateur utilisateur) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la création d'un compte utilisateur");
        }

        String procedureCall = "{CALL creation_utilisateur(?, ?, ?, ?)}";
        Object[] entrees = {utilisateur.getLogin(), utilisateur.getMdp(), utilisateur.getAdmin()};
        int[] sorties = {Types.INTEGER};
        String[] nomSorties = {"id"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/modification")
    public JSONObject modification(@RequestBody Utilisateur utilisateur) {

        if (this.bdService.getIdUtilisateur() != utilisateur.getId()) {
            return messageErreurRetour("Vous pouvez changer que les informations de votre propre compte.");
        }

        String procedureCall = "{CALL modification_utilisateur(?, ?, ?, ?)}";
        Object[] entrees = {utilisateur.getLogin(), utilisateur.getMdp(), utilisateur.getNewMdp()};
        int[] sorties = {Types.INTEGER};
        String[] nomSorties = {"id"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/ajout_famille")
    public JSONObject ajout_famille(@RequestBody Utilisateur utilisateur) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la création d'une famille.");
        }

        String procedureCall = "{CALL recuperation_id_famille(?, ?)}";
        Object[] entrees = {utilisateur.getId()};
        int[] sorties = {Types.INTEGER};
        String[] nomSorties = {"id"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/archiver")
    public JSONObject archiver(@RequestBody Utilisateur utilisateur) {

        String requete = "UPDATE utilisateur SET archive=1 WHERE id_user=?";
        Object[] params = {utilisateur.getId()};
        try {
            this.bdService.update(requete, params);
            utilisateur.setArchive(true);
            return utilisateur.toJSONObject();
        }catch (Exception e){
            return messageErreurRetour("L'utilisateur n'existe pas.");
        }
    }

    @PostMapping(value = "/desarchiver")
    public JSONObject desarchiver(@RequestBody Utilisateur utilisateur) {

        String requete = "UPDATE utilisateur SET archive=0 WHERE id_user=?";
        Object[] params = {utilisateur.getId()};
        try {
            this.bdService.update(requete, params);
            utilisateur.setArchive(false);
            return utilisateur.toJSONObject();
        }catch (Exception e){
            return messageErreurRetour("L'utilisateur n'existe pas.");
        }
    }

    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }
}


