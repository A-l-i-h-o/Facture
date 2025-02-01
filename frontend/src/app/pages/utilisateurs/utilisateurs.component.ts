import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Utilisateur } from 'src/app/model/Utilisateur.model';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];

  afficherArchives: boolean = false;
  utilisateursFiltres: Utilisateur[] = [];

  constructor(private factureService: FactureService, private router: Router) {
    
   }

  ngOnInit(): void {
    this.actualise();
  }

  actualise(){
    this.factureService.listeUtilisateurs().subscribe((data: Utilisateur[]) => {
      this.utilisateurs = data;
      this.filtrerUtilisateurs(); // Filtrage initial
    });
  }

  // Fonction de filtrage dynamique des utilisateurs
  filtrerUtilisateurs(): void {
    this.utilisateursFiltres = this.utilisateurs.filter(u => this.afficherArchives ? u.archive : !u.archive);
  }

  // Fonction pour confirmer et effectuer l'archivage
  confirmerArchivage(utilisateur: Utilisateur): void {
    const confirmation = confirm(`Voulez-vous vraiment archiver ${utilisateur.login} ?`);
    if (confirmation) {
      this.factureService.archiverUtilisateur(utilisateur).subscribe((user:Utilisateur) => {
        this.actualise();
      });
    }
  }

  desarchiverUtilisateur(utilisateur: any) {
    const confirmation = confirm(`Voulez-vous vraiment désarchiver ${utilisateur.login} ?`);
    if (confirmation) {
      this.factureService.desarchiverUtilisateur(utilisateur).subscribe((user:Utilisateur) => {
        this.actualise();
      });
    }
  }

  // Fonction pour modifier un utilisateur
  modifierUtilisateur(utilisateur: Utilisateur): void {
    alert(`Modification de ${utilisateur.login}`);
  }

  // Fonction pour créer une famille pour un utilisateur sans ID famille
  creerFamille(utilisateur: Utilisateur): void {
    this.router.navigate(['/formulaire-inscription', utilisateur.id]);
  }

  // Fonction pour ajouter un nouvel utilisateur
  creationUtilisateur(): void {
    alert('Ajout d’un nouvel utilisateur');
  }

}
