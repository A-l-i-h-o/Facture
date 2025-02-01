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

  listeFamilles: any[] = []; // Liste des familles récupérées depuis l'API

  constructor(private factureService: FactureService,private router: Router) { }

  ngOnInit(): void {
    // Récupération des familles depuis l'API au chargement du composant
    this.factureService.getAllFamille().subscribe(
      (data) => {

        data.forEach(info=>{
          var id:number = +info["id"];
          this.factureService.getFamilleAllInfo(id).subscribe(
            (data2) => {
              data2["id"] = id;
              this.listeFamilles.push(data2);
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

  retour(){
    this.router.navigate(["accueil"]);
  }

  // Créer une nouvelle famille
  creation(): void {
    this.router.navigate(['/famille/creation']);
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
    
  }
}
