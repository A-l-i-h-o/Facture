import { Enfant } from "./Enfant.model";
import { Facture } from "./Facture.model";
import { Parent } from "./Parent.model";
import { Reduction } from "./Reduction.model";

export interface Famille {
    id:number;
    idUtilisateur?:number;
    listeParent?:Parent[];
    listeEnfant?:Enfant[];
    listeReduction?:Reduction[];
    listeFacture?:Facture[];
}