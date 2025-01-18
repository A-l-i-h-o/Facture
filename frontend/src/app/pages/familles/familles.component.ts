import { Component, OnInit } from '@angular/core';
import { FactureService } from 'src/app/http/FactureService'; // Import du service
import { Observable } from 'rxjs';

@Component({
  selector: 'app-famille',
  templateUrl: './familles.component.html',
  styleUrls: ['./familles.component.scss']
})
export class FamillesComponent implements OnInit {

  familles: any[] = []; // Liste des familles récupérées depuis l'API
  filteredFamilles: any[] = []; // Familles filtrées selon la recherche
  searchTerm: string = ''; // Terme de recherche pour filtrer les familles

  constructor(private factureService: FactureService) { }

  ngOnInit(): void {
    // // Récupération des familles depuis l'API au chargement du composant
    // this.factureService.().subscribe(
    //   (data) => {
    //     this.familles = data;
    //     this.filteredFamilles = data; // Initialement, toutes les familles sont affichées
    //   },
    //   (error) => {
    //     console.error('Erreur lors de la récupération des familles', error);
    //   }
    // );
  }

  // Filtrage des familles en fonction du terme de recherche dans le nom, prénom ou mail
  onSearchChange(): void {
    if (this.searchTerm.trim()) {
      this.filteredFamilles = this.familles.filter(famille =>
        famille.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        famille.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        famille.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        famille.enfants.some((enfant: { nom: string; })=>
          enfant.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    } else {
      this.filteredFamilles = this.familles; // Si la recherche est vide, afficher toutes les familles
    }
  }
}
