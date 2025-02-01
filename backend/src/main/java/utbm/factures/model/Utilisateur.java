package utbm.factures.model;

import org.json.simple.JSONObject;

public class Utilisateur {
    Integer id;
    String login;
    String mdp;
    String newMdp;
    Boolean admin;
    Integer idFamille;
    Boolean archive;

    // Getters et setters
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getMdp() {
        return mdp;
    }

    public void setMdp(String mdp) {
        this.mdp = mdp;
    }

    public String getNewMdp() {
        return newMdp;
    }

    public void setNewMdp(String newMdp) {
        this.newMdp = newMdp;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdFamille() {
        return idFamille;
    }

    public void setIdFamille(Integer idFamille) {
        this.idFamille = idFamille;
    }

    public Boolean getArchive() {
        return archive;
    }

    public void setArchive(Boolean archive) {
        this.archive = archive;
    }

    public JSONObject toJSONObject() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
        jsonObject.put("login", login);
        jsonObject.put("mdp", mdp);
        jsonObject.put("newMdp", newMdp);
        jsonObject.put("admin", admin);
        jsonObject.put("idFamille", idFamille);
        jsonObject.put("archive", archive);
        return jsonObject;
    }
}
