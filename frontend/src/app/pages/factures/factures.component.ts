import { Component, OnInit } from '@angular/core';
import { FactureService } from 'src/app/http/FactureService'; // Import du service
import { Observable } from 'rxjs';

@Component({
  selector: 'app-facture',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit {

  factures: any[] = []; // Liste des factures récupérées depuis l'API
  filteredFactures: any[] = []; // Factures filtrées selon la recherche
  searchTerm: string = ''; // Terme de recherche pour filtrer les descriptions

  constructor(private factureService: FactureService) { }

  ngOnInit(): void {
    // Récupération des factures depuis l'API au chargement du composant
    this.factureService.getFactures().subscribe(
      (data) => {
        this.factures = data;
        this.filteredFactures = data; // Initialement, toutes les factures sont affichées
      },
      (error) => {
        console.error('Erreur lors de la récupération des factures', error);
      }
    );
  }

  // Filtrage des factures en fonction du terme de recherche dans les descriptions
  onSearchChange(): void {
    if (this.searchTerm.trim()) {
      this.filteredFactures = this.factures.filter(facture =>
        facture.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredFactures = this.factures; // Si la recherche est vide, afficher toutes les factures
    }
  }
}
