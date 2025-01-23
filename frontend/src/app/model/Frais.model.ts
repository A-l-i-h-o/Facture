export interface Frais {
    id:number;
    montant?: number;
    description?: string;
    idType?:number;
    type?:string;
    dateCreation?:number;
    archive?:boolean;
    idReduction?:number;
    idFacture?:number;
}