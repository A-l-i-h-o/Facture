import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';

@Component({
  selector: 'app-liste-reductions',
  templateUrl: './listeReductions.component.html',
  styleUrls: ['./listeReductions.component.scss']
})
export class ListeReductionsComponent implements OnInit {

  listeReductions: any[] = [];
  listeReductionsFiltres: any[] = []; // Liste filtrée
  afficherArchives: boolean = false; // Contrôle du filtre archivées

  constructor(private factureService: FactureService, private router: Router) { }

  ngOnInit(): void {
    // Récupération des réductions depuis l'API au chargement du composant
    this.actualise();
  }

  actualise(){
    this.factureService.getAllReduction().subscribe(
      (data) => {
        this.listeReductions = data;
        this.filtrerReductions(); // Filtrage initial
      },
      (error) => {
        console.error('Erreur lors de la récupération des réductions', error);
      }
    );
  }

  // Fonction pour archiver une réduction
  archiver(reduction: any): void {
    const confirmation = confirm(`Voulez-vous vraiment archiver cette réduction : ${reduction.id} ?`);
    if (confirmation) {
      reduction.archive = true;  // Marquer comme archivée
      this.factureService.archiverReduction(reduction.id).subscribe(
        () => {
          // Mettre à jour la liste après archivage
          this.actualise();
        },
        (error) => {
          console.error('Erreur lors de l\'archivage de la réduction', error);
        }
      );
    }
  }

  // Fonction pour désarchiver une réduction
  desarchiver(reduction: any): void {
    const confirmation = confirm(`Voulez-vous vraiment désarchiver cette réduction : ${reduction.id} ?`);
    if (confirmation) {
      reduction.archive = false;  // Marquer comme non archivée
      this.factureService.desarchiverReduction(reduction.id).subscribe(
        () => {
          // Mettre à jour la liste après désarchivage
          this.actualise();
        },
        (error) => {
          console.error('Erreur lors du désarchivage de la réduction', error);
        }
      );
    }
  }

  // Fonction pour filtrer les réductions archivées/non archivées
  filtrerReductions(): void {
    if (this.afficherArchives) {
      this.listeReductionsFiltres = this.listeReductions.filter(r => r.archive);
    } else {
      this.listeReductionsFiltres = this.listeReductions.filter(r => !r.archive);
    }
  }

  // Fonction pour créer une réduction
  creation(): void {
    this.router.navigate(["creation-reduction"]);
  }
}
