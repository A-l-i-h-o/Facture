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
  listeFacturesFiltres: Facture[] = []; 
  constructor(private factureService: FactureService,private router: Router) { }

  ngOnInit(): void {
    this.actualise();
  }

  actualise(){
    this.factureService.getAllFacture().subscribe(
      (data) => {
        this.factures = [];
        this.listeFacturesFiltres = [];
        data.forEach(info=>{
          var id:number = +info["id"];
          var archiveEtat: boolean = info["archive"];
          this.factureService.getFactureAllInfo(id).subscribe(
            (data2) => {
              data2["id"] = id;
              data2["idFamille"] = id;
              data2["archive"] = archiveEtat;
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

  // Fonction pour afficher les détails d'une facture
  afficherDetail(id: number): void {
    this.router.navigate(['/facture', id]); // Navigue vers la page de détail en passant l'ID de la facture
  }
  

  // Archiver une facture
  archiverFacture(facture: Facture): void {
    
    this.factureService.archiverFacture(facture.id).subscribe(
      (response) => {
        this.actualise();
        console.log('Facture archivée', response);
      },
      (error) => {
        console.error('Erreur lors de l\'archivage de la facture', error);
      }
    );
  }
  
  // Désarchiver une facture
  desarchiverFacture(facture: Facture): void {
    this.factureService.desarchiverFacture(facture.id).subscribe(
      (response) => {
        this.actualise();
        console.log('Facture désarchivée', response);
      },
      (error) => {
        console.error('Erreur lors de la désarchivage de la facture', error);
      }
    );
  }

  filtrerFactures(archived: boolean | null = null): void {
    if (archived === null) {
      this.listeFacturesFiltres = [...this.factures];
    } else {
      this.listeFacturesFiltres = this.factures.filter(facture => facture.archive === archived);
    }
  }

  creation(){}
}
