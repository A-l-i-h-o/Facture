import { Component, OnInit } from '@angular/core';
import { FactureService } from 'src/app/http/FactureService'; // Import du service

import { Router } from '@angular/router';

@Component({
  selector: 'app-famille',
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

  choisir(){
    this.router.navigate(["AfficherFamille"]);
  }

  modifier(){
    this.router.navigate(["ModifierFamille"]);
  }

  archiver(){
    
  }
}
