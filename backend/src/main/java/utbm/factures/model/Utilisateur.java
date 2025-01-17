package utbm.factures.model;

public class Utilisateur {
    private String login;
    private String mdp;
    private String newMdp;
    private Boolean admin;
    private Integer id;

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
}
