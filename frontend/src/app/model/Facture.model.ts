import { Frais } from "./Frais.model";
import { Paiement } from "./Paiement.model";

export interface Facture {
    id:number;
    datePaimentTotal?: Date;
    description?: string;
    creancier?:string;
    dateCreation?: Date;
    idPeriode?:number;
    periode?:string;
    debiteur?:string;
    archive?:boolean;
    listeFrais?:Frais[];
    dateEcheance?:Date;
    listePaiement?:Paiement[];
    idEtatPaiement?:number;
    idFamille?:number;
    etatPaiement?:string;
    idReduction?:number;
}