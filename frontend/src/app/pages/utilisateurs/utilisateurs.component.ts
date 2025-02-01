import { Component, OnInit } from '@angular/core';
import { FactureService } from 'src/app/http/FactureService';
import { Utilisateur } from 'src/app/model/Utilisateur.model';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];

  constructor(private factureService: FactureService) { }

  ngOnInit(): void {
    this.factureService.listeUtilisateurs().subscribe((data: Utilisateur[]) => {
      this.utilisateurs = data;
    });
  }

  creationUtilisateur(){

  }

  modifierUtilisateur(utilisateur: Utilisateur) {
    console.log('Modifier utilisateur:', utilisateur);
  }

  archiverUtilisateur(utilisateur: Utilisateur) {
    console.log('Archiver utilisateur:', utilisateur);
  }

}
