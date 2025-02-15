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
@RequestMapping(value = "facture/*", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class FactureController {

    private final BDService bdService;
    private final RestTemplate restTemplate;

    /**
     * Spring Boot s'occupe de lier les instances pour qu'elles soient utilisables n'importe où.
     */
    @Autowired
    public FactureController(BDService bdService,RestTemplate restTemplate) {
        this.bdService = bdService;
        this.restTemplate = restTemplate;
    }

    @PostMapping(value = "/creation")
    public JSONObject creation(@RequestBody Facture facture) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la création d'une facture.");
        }

        String procedureCall = "{CALL creation_facture(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";
        Object[] entrees = {facture.getPeriode(), facture.getIdReduction(), facture.getEtatPaiement(), facture.getDescription(), facture.getCreancier(), facture.getDebiteur(), facture.getDateCreation(), facture.getDatePaiementTotal(), facture.getDateEcheance()};
        int[] sorties = {Types.INTEGER};
        String[] nomSorties = {"id"};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/liaison_famille")
    public JSONObject liaison_facture(@RequestBody Facture facture) {

        if (!this.bdService.getAdmin()) {
            return messageErreurRetour("Un accès administrateur est nécessaire pour la liaison d'une facture à une famille.");
        }

        String procedureCall = "{CALL liaison_famille_facture(?, ?)}";
        Object[] entrees = {facture.getIdFamille(), facture.getId()};
        int[] sorties = {};
        String[] nomSorties = {};

        return this.bdService.procedure(procedureCall, entrees, sorties, nomSorties);
    }

    @PostMapping(value = "/")
    public JSONObject get(@RequestParam(value = "id_facture") String id_facture) {

        String requete = "SELECT * FROM facture WHERE id_facture="+id_facture;
        String[] nomSorties = {"id","idPeriode","idEtatPaiement","description","creancier","debiteur","dateCreation","datePaiementTotal","dateEcheance","archive"};
        try {
            return new JSONObject((Map) this.bdService.select(requete, nomSorties).get(0));
        }catch (Exception e){
            return messageErreurRetour("La facture n'existe pas.");
        }
    }

    @PostMapping(value = "/all")
    public JSONArray get() {

        String requete = "SELECT " +
                "f.id_facture AS id, " +
                "h.id_Famille AS idFamille, " +
                "f.id_periode AS idPeriode, " +
                "f.id_etat_paiement AS idEtatPaiement, " +
                "f.description_facture AS description, " +
                "f.creancier AS creancier, " +
                "f.debiteur AS debiteur, " +
                "f.date_creation_facture AS dateCreation, " +
                "f.date_paiment_total_facture AS datePaiementTotal, " +
                "f.date_echeance_facture AS dateEcheance, " +
                "f.archive AS archive " + // Ajout d'un espace ici
                "FROM facture AS f " + // Ajout d'un espace après le mot "facture"
                "JOIN historique_facture AS h " + // Utilisation de JOIN au lieu de la virgule
                "ON f.id_facture = h.id_facture"; // Correction du nom de colonne pour la correspondance


        String[] nomSorties = {"id","idFamille","idPeriode","idEtatPaiement","description","creancier","debiteur","dateCreation","datePaiementTotal","dateEcheance","archive"};
        return this.bdService.select(requete, nomSorties);
    }

    @PostMapping(value = "/all_info")
    public JSONObject getAllInfo(@RequestParam(value = "id_facture") String id_facture) {

        JSONObject facture = get(id_facture);

        String requeteFrais = "SELECT id_frais FROM liste_frais_facture WHERE id_facture="+id_facture;
        String[] nomSortiesFrais  = {"id"};
        JSONArray listeIdFrais =  this.bdService.select(requeteFrais , nomSortiesFrais);

        JSONArray listeFrais = new JSONArray();

        for (int i = 0; i < listeIdFrais.size(); i++) {
            JSONObject frais = (JSONObject) listeIdFrais.get(i);
            int idFrais = (int) frais.get("id");

            String url = "http://localhost:9392/frais/?id_frais=" + idFrais;
            listeFrais.add(restTemplate.getForObject(url, JSONObject.class));
        }

        facture.put("listeFrais", listeFrais);

        String requetePaiement = "SELECT id_paiement FROM liste_paiement_facture WHERE id_facture="+id_facture;
        String[] nomSortiesPaiement = {"id"};
        JSONArray listeIdPaiement =  this.bdService.select(requetePaiement, nomSortiesPaiement);

        JSONArray listePaiement = new JSONArray();

        for (int i = 0; i < listeIdPaiement.size(); i++) {
            JSONObject paiement = (JSONObject) listeIdPaiement.get(i);
            int idPaiement = (int) paiement.get("id");

            String url = "http://localhost:9392/paiement/?id_paiement=" + idPaiement;
            listePaiement.add(restTemplate.getForObject(url, JSONObject.class));
        }

        facture.put("listePaiement", listePaiement);
        return facture;
    }

    @PostMapping(value = "/payer")
    public JSONObject payer(@RequestParam(value = "id_facture") String id_facture) {

        String requete = "UPDATE facture SET id_etat_paiement=3 WHERE id_facture=?";
        Object[] params = {id_facture};
        try {
            this.bdService.update(requete, params);
            return this.get(id_facture);
        }catch (Exception e){
            return messageErreurRetour("La facture n'existe pas.");
        }
    }

    @PostMapping(value = "/archiver")
    public JSONObject archiver(@RequestParam(value = "id_facture") String id_facture) {

        String requete = "UPDATE facture SET archive=1 WHERE id_facture=?";
        Object[] params = {id_facture};
        try {
            this.bdService.update(requete, params);
            return this.get(id_facture);
        }catch (Exception e){
            return messageErreurRetour("La facture n'existe pas.");
        }
    }

    @PostMapping(value = "/desarchiver")
    public JSONObject desarchiver(@RequestParam(value = "id_facture") String id_facture) {

        String requete = "UPDATE facture SET archive=0 WHERE id_facture=?";
        Object[] params = {id_facture};
        try {
            this.bdService.update(requete, params);
            return this.get(id_facture);
        }catch (Exception e){
            return messageErreurRetour("La facture n'existe pas.");
        }
    }

    private JSONObject messageErreurRetour(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", message);
        return new JSONObject(result);
    }
}


