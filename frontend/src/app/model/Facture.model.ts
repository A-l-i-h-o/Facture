import { Frai } from './Frai.model';
import { Paiement } from './Paiement.model';

export interface Facture {
    idFacture: number;
    idPeriode: number;
    idEtatPaiement: number;
    description: string;
    creancier: string;
    debiteur: string;
    dateCreation: string;
    datePayementTotal: string;
    dateEcheance: string;
    listeFrais: Frai[];
    listePaiements: Paiement[];
}