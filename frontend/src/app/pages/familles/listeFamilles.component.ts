import { Component, OnInit } from '@angular/core';
import { FactureService } from 'src/app/http/FactureService'; // Import du service
import { Router } from '@angular/router';
import { Famille } from 'src/app/model/Famille.model';

@Component({
  selector: 'app-liste-famille',
  templateUrl: './listeFamilles.component.html',
  styleUrls: ['./listeFamilles.component.scss']
})
export class ListeFamillesComponent implements OnInit {

  listeFamilles: Famille[] = []; // Liste des familles récupérées depuis l'API
  listeFamillesFiltres: Famille[] = []; // Liste filtrée selon l'archivage

  constructor(private factureService: FactureService, private router: Router) { }

  ngOnInit(): void {
    // Récupération des familles depuis l'API au chargement du composant
    this.actualise();
  }

  actualise(){
    this.factureService.getAllFamille().subscribe(
      (data) => {
        this.listeFamilles = []; // Liste des familles récupérées depuis l'API
        this.listeFamillesFiltres = []; // Liste filtrée selon l'archivage
        data.forEach(info => {
          var id: number = +info["id"];
          var archiveEtat: boolean = info["archive"];
          this.factureService.getFamilleAllInfo(id).subscribe(
            (data2) => {
              data2["id"] = id;
              data2["archive"] = archiveEtat;
              this.listeFamilles.push(data2);
              this.listeFamillesFiltres = [...this.listeFamilles]; // Par défaut, on affiche toutes les familles
            },
            (error) => {
              console.error('Erreur lors de la récupération des familles', error);
            }
          );
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des familles', error);
      }
    );
  }

  retour() {
    this.router.navigate(["accueil"]);
  }

  // Créer une nouvelle famille
  creation(): void {
    this.router.navigate(['/formulaire-inscription']);
  }

  // Sélectionner une famille pour voir ses détails
  selectionnerFamille(famille: Famille): void {
    this.router.navigate(['/famille', famille.id]);
  }

  // Modifier les informations d'une famille
  modifierFamille(famille: Famille): void {
    this.router.navigate(['/famille/modifier', famille.id]);
  }

  // Archiver une famille
  archiverFamille(famille: Famille): void {
    // Logique pour envoyer la mise à jour au backend (optionnel, selon votre API)
    this.factureService.archiverFamille(famille.id).subscribe(
      (response) => {
        this.actualise();
        console.log('Famille archivée', response);
      },
      (error) => {
        console.error('Erreur lors de l\'archivage de la famille', error);
      }
    );
  }

  // Désarchiver une famille
  desarchiverFamille(famille: Famille): void {
    // Logique pour envoyer la mise à jour au backend (optionnel, selon votre API)
    this.factureService.desarchiverFamille(famille.id).subscribe(
      (response) => {
        this.actualise();
        console.log('Famille désarchivée', response);
      },
      (error) => {
        console.error('Erreur lors de la désarchivage de la famille', error);
      }
    );
  }

  // Filtrer les familles selon leur statut (archivées ou non)
  filtrerFamilles(archived: boolean | null = null): void {
    if (archived === null) {
      // Si aucun filtre, afficher toutes les familles
      this.listeFamillesFiltres = [...this.listeFamilles];
    } else {
      // Sinon, filtrer les familles en fonction de leur statut d'archivage
      this.listeFamillesFiltres = this.listeFamilles.filter(famille => famille.archive === archived);
    }
  }
}
