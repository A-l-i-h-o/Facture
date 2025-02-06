import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Utilisateur } from 'src/app/model/Utilisateur.model';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})


export class AccueilComponent implements OnInit {
  utilisateur!: Utilisateur | null;

  constructor(private router: Router, private factureService: FactureService) {}

  ngOnInit(): void {
    this.getUtilisateurConnecte();
    console.log("Utilisateur connecté :", this.utilisateur);
  }

  getUtilisateurConnecte(): void {
  const userData = localStorage.getItem('utilisateur');
  this.utilisateur = userData ? JSON.parse(userData) : { admin: false }; // Si pas d'utilisateur, admin = false
  console.log("Utilisateur connecté :", this.utilisateur);
}
  

  // Fonction pour rediriger vers les pages
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}