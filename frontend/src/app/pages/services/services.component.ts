import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent  implements OnInit {

  listeServices: any[] = [];

  constructor(private factureService: FactureService,private router: Router) { }
  ngOnInit(): void {
    // Récupération des familles depuis l'API au chargement du composant
    this.factureService.getAllTypeFrais().subscribe(
      (data) => {
        this.listeServices = data;
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
