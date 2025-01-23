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

  constructor(private factureService: FactureService,private router: Router) { }
  ngOnInit(): void {
    // Récupération des familles depuis l'API au chargement du composant
    this.factureService.getAllReduction().subscribe(
      (data) => {
        this.listeReductions = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des familles', error);
      }
    );
  }

  retour(){
    this.router.navigate(["accueil"]);
  }

  archiver(){
    
  }
}
