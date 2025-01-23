import { Component, OnInit } from '@angular/core';
import { FactureService } from 'src/app/http/FactureService'; // Import du service
import { Observable } from 'rxjs';
import { Facture } from 'src/app/model/Facture.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liste-facture',
  templateUrl: './listeFactures.component.html',
  styleUrls: ['./listeFactures.component.scss']
})
export class ListeFacturesComponent implements OnInit {

  factures: Facture[] = []; // Liste des factures récupérées depuis l'API

  constructor(private factureService: FactureService,private router: Router) { }

  ngOnInit(): void {
    this.factureService.getAllFacture().subscribe(
      (data) => {

        data.forEach(info=>{
          var id:number = +info["id"];

          this.factureService.getFactureAllInfo(id).subscribe(
            (data2) => {
              data2["id"] = id;
              data2["idFamille"] = id;
              this.factures.push(data2);
            },
            (error) => {
              console.error('Erreur lors de la récupération des factures', error);
            }
          );
        });
        
      },
      (error) => {
        console.error('Erreur lors de la récupération des factures', error);
      }
    );
  }

  calculMontantTotal(facture:Facture){
    var somme = 0;
    facture.listeFrais?.forEach(frais=>{
      somme+=frais.montant!=undefined?frais.montant:0;
    });
    return somme;
  }

  calculMontantRestant(facture:Facture){

    var valAPayer = this.calculMontantTotal(facture);
    facture.listePaiement?.forEach(paiement=>{
      valAPayer-=paiement.montant!=undefined?paiement.montant:0;
    });
    return valAPayer;
  }
  retour(){
    this.router.navigate(["accueil"]);
  }
  archiver(){
    
  }

  creation(){
    
  }
}
