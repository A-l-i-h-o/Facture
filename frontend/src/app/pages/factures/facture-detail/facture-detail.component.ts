import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Facture } from 'src/app/model/Facture.model';

@Component({
  selector: 'app-facture-detail',
  templateUrl: './facture-detail.component.html',
  styleUrls: ['./facture-detail.component.scss']
})
export class FactureDetailComponent implements OnInit {
  facture: Facture | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Récupérer l'ID de la facture depuis l'URL
    this.factureService.getFactureAllInfo(id).subscribe((facture) => {
      this.facture = facture;
    });
  }

  // Méthode pour revenir à la liste des factures
  retour(): void {
    this.router.navigate(['/listeFactures']); // Redirige vers la route des factures (vous pouvez remplacer '/' si nécessaire)
  }
}
