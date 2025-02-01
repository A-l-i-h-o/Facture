import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showEntete: boolean = true;  // Déclare une variable pour afficher ou non <app-entete>

  constructor(private router: Router) {}

  ngOnInit() {
    // Écoute les changements de route pour mettre à jour showEntete
    this.router.events.subscribe(() => {
      this.checkUrl();
    });
    // Vérifier la route au démarrage de l'application
    this.checkUrl();
  }

  checkUrl() {
    // Vérifier si l'URL est la racine
    if (this.router.url === '/') {
      this.showEntete = false;  // Ne pas afficher l'en-tête si on est à la racine
    } else {
      this.showEntete = true;  // Afficher l'en-tête si on est ailleurs
    }
  }
}
