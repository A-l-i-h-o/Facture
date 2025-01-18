export interface Paiement {
    id:number;
    idFacture:number;
    idType:number;
    type:string;
    dateCreation:Date;
    montant:number;
    description:string;
    archive:boolean;
}