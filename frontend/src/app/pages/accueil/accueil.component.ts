import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {

  currentDate: string;
  nomPrenom: string;

  constructor(private router: Router) {
    // Initialisez la date au format voulu
    this.currentDate = new Date().toLocaleDateString();
    // Initialisez le nom et prénom de manière statique ou récupérez-le si nécessaire
    this.nomPrenom = "Jean Dupont"; // Vous pouvez le récupérer dynamiquement
  }

  // Fonction pour rediriger vers les pages
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
