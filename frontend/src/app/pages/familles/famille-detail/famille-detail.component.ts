import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Facture } from 'src/app/model/Facture.model';
import { Famille } from 'src/app/model/Famille.model';

@Component({
  selector: 'app-famille-detail',
  templateUrl: './famille-detail.component.html',
  styleUrls: ['./famille-detail.component.scss']
})
export class FamilleDetailComponent implements OnInit {
  famille: Famille | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturesService: FactureService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Récupérer l'ID de la famille depuis l'URL
    this.facturesService.getFamilleAllInfo(id).subscribe((famille) => {
      this.famille = famille;
    });
  }

  // Méthode pour revenir à la liste des familles
  retour(): void {
    this.router.navigate(['/listeFamilles']); // Redirige vers la page des familles
  }

  // Méthode pour calculer le montant total d'une facture
  calculMontantTotal(facture: Facture): number {
    return facture.listeFrais?.reduce((sum, frais) => sum + (frais.montant || 0), 0) || 0;
  }

  // Méthode pour afficher le détail d'une facture
  viewFactureDetail(id: number): void {
    this.router.navigate(['/facture', id]); // Navigue vers la page de détail de la facture
  }
}
