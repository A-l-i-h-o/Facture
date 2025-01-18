export interface Utilisateur {
    id: number;
    login: string;
    mdp: string;
    newMdp: string;
    admin: boolean;
    idFamille: number;
    connexion:boolean;
}