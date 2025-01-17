/**
 * Classe UsersController : Elle fait partie de l'api. Elle permet de réceptionner les requêtes, de les traîter et de renvoyer des informations.
 * Elle traîte toutes les requêtes liées au jeu.
 */

package utbm.factures.api;

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
 * Cet observeur réceptionne les requêtes GET, avec comme entête de requête "jeu/*".
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

    @PostMapping(value = "/connexion")
    public JSONObject connexion(@RequestBody Utilisateur utilisateur) {

        String procedureCall = "{CALL connexion(?, ?, ?, ?, ?)}";
        Object[] entrees = {utilisateur.getLogin(), utilisateur.getMdp()};
        int[] sorties = {Types.BOOLEAN, Types.INTEGER, Types.BOOLEAN};
        String[] nomSorties = {"connexion", "id_utilisateur", "admin"};

        JSONObject result = this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
        try {
            this.bdService.setIdUtilisateur((Integer) result.get("id_utilisateur"));
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
        String[] nomSorties = {"id_utilisateur"};

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
        String[] nomSorties = {"id_utilisateur"};

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
        String[] nomSorties = {"id_famille"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }

//
//
//    @GetMapping(value = "joueur")
//    public JSONObject getPartie(@RequestParam(value = "civilisation") String civilisation, @RequestParam(value = "environnement") String environnement) {
//        return Json.objectToJsonObject(this.dbService.getJeu().startPartie(civilisation, environnement).toMap());
//    }
//
//
//    @GetMapping(value = "checkRecherche")
//    public boolean getSiRechercheRecherchable(@RequestParam(value = "nomJoueur") String nomJoueur, @RequestParam(value = "recherche") String nomRecherche) {
//        return this.dbService.getJeu().getJoueur(nomJoueur).checkRecherche(nomRecherche);
//    }
}


