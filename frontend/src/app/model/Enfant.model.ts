import { Reduction } from "./Reduction.model";

export interface Enfant {
    id:number;
    nom: string;
    prenom: string;
    age:number;
    idFamille:number;
    archive:boolean;
    listeReduction:Reduction[];
}