package utbm.factures.model;

public class Reduction {
    String description;
    String montant;
    String pourcentage;
    Integer id;
    Integer idFamille;
    Integer idEnfant;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMontant() {
        return montant;
    }

    public void setMontant(String montant) {
        this.montant = montant;
    }

    public String getPourcentage() {
        return pourcentage;
    }

    public void setPourcentage(String pourcentage) {
        this.pourcentage = pourcentage;
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

    public Integer getIdEnfant() {
        return idEnfant;
    }

    public void setIdEnfant(Integer idEnfant) {
        this.idEnfant = idEnfant;
    }
}
