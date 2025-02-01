import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class UtilisateurService {
    nomJoueur: string = '';

    setNomJoueur(nomJoueur: string): void {
        this.nomJoueur = nomJoueur;
      }
    
      getNomJoueur(): string | null {
        return this.nomJoueur;
      }
}