package utbm.factures.model;

import java.util.Date;

public class Facture {
    int id;
    int idPeriode;
    int idEtatPaiement;
    int idReduction;
    int idFamille;
    String etatPaiement;
    String periode;
    String description;
    String creancier;
    String debiteur;
    Boolean archive;
    Date dateCreation;
    Date datePaiementTotal;
    Date dateEcheance;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPeriode() {
        return periode;
    }

    public void setPeriode(String periode) {
        this.periode = periode;
    }

    public int getIdPeriode() {
        return idPeriode;
    }

    public void setIdPeriode(int idPeriode) {
        this.idPeriode = idPeriode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreancier() {
        return creancier;
    }

    public void setCreancier(String creancier) {
        this.creancier = creancier;
    }

    public String getDebiteur() {
        return debiteur;
    }

    public void setDebiteur(String debiteur) {
        this.debiteur = debiteur;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Date getDatePaiementTotal() {
        return datePaiementTotal;
    }

    public void setDatePaiementTotal(Date datePaiementTotal) {
        this.datePaiementTotal = datePaiementTotal;
    }

    public Date getDateEcheance() {
        return dateEcheance;
    }

    public void setDateEcheance(Date dateEcheance) {
        this.dateEcheance = dateEcheance;
    }

    public Boolean getArchive() {
        return archive;
    }

    public void setArchive(Boolean archive) {
        this.archive = archive;
    }

    public Integer getIdReduction() {
        return idReduction;
    }

    public void setIdReduction(Integer idReduction) {
        this.idReduction = idReduction;
    }

    public int getIdEtatPaiement() {
        return idEtatPaiement;
    }

    public void setIdEtatPaiement(int idEtatPaiement) {
        this.idEtatPaiement = idEtatPaiement;
    }

    public String getEtatPaiement() {
        return etatPaiement;
    }

    public void setEtatPaiement(String etatPaiement) {
        this.etatPaiement = etatPaiement;
    }

    public int getIdFamille() {
        return idFamille;
    }

    public void setIdFamille(int idFamille) {
        this.idFamille = idFamille;
    }
}
