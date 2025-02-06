import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Enfant } from 'src/app/model/Enfant.model';
import { Parent } from 'src/app/model/Parent.model';
import { FactureService } from 'src/app/http/FactureService';
import { Observable } from 'rxjs';
import { Famille } from 'src/app/model/Famille.model';

@Component({
  selector: 'app-famille-edit',
  templateUrl: './famille-edit.component.html',
  styleUrls: ['./famille-edit.component.scss']
})
export class FamilleEditComponent implements OnInit {
  familleForm!: FormGroup;
  familleId!: number;
  famille!: Famille;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private factureService: FactureService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.familleId = Number(this.route.snapshot.paramMap.get('id'));
    this.familleForm = this.fb.group({
      parents: this.fb.array([]),
      enfants: this.fb.array([])
    });

    this.loadExistingData();
  }

  get parents(): FormArray {
    return this.familleForm.get('parents') as FormArray;
  }

  get enfants(): FormArray {
    return this.familleForm.get('enfants') as FormArray;
  }

  get statut(): FormArray{
    return this.familleForm.get('statut') as FormArray;
  }

  loadExistingData(): void {
    this.factureService.getFamilleAllInfo(this.familleId).subscribe(famille => {
      if (famille.listeParent) {
        famille.listeParent.forEach(parent => this.addParent(parent));
      }
      if (famille.listeEnfant) {
        famille.listeEnfant.forEach(enfant => this.addEnfant(enfant));
      }
    });
  }

  addParent(parent: Parent): void {
    this.parents.push(this.fb.group({
      id: [parent.id],
      idFamille: [parent.idFamille],
      nom: [parent.nom, Validators.required],
      prenom: [parent.prenom, Validators.required],
      adresse: [parent.adresse],
      adresseEmail: [parent.adresseEmail, [Validators.email]],
      statut: [parent.statut],
      idStatut: [parent.idStatut],
      archive: [parent.archive]
    }));
  }

  addEnfant(enfant: Enfant): void {
    this.enfants.push(this.fb.group({
      id: [enfant.id],
      idFamille: [enfant.idFamille],
      nom: [enfant.nom, Validators.required],
      prenom: [enfant.prenom, Validators.required],
      age: [enfant.age, [Validators.min(0)]],
      archive: [enfant.archive],
      listeReduction: [enfant.listeReduction]
    }));
  }
/*
  submit(): void {
    if (this.familleForm.valid) {
      console.log('Données envoyées:', this.familleForm.value);
      this.factureService.updateFamille(this.familleId, this.familleForm.value).subscribe(
        (response : Famille) => {
          console.log('Famille mise à jour avec succès:', response);
          this.router.navigate(['/famille']); // Redirection après la mise à jour
        },
        (error : HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour de la famille:', error);
        }
      );
    }
  }
*/

submit(): void {
  if (this.familleForm.valid) {
    console.log('Données envoyées:', this.familleForm.value);

    const parents = this.familleForm.value.parents;
    const enfants = this.familleForm.value.enfants;

    //let observables: Observable<any>[] = [];

    parents.forEach((parent: Parent) => {
      parent.idFamille = this.familleId;
      this.factureService.modificationParent(parent).subscribe(
        response => console.log('Parent mis à jour:', response),
        error => console.error('Erreur lors de la mise à jour du parent:', error)
      );
      //observables.push(this.factureService.modificationParent(parent));
    });

    enfants.forEach((enfant: Enfant) => {
      if (!enfant.idFamille) {
        enfant.idFamille = this.familleId; // Assurer que l'ID famille est bien défini
      }
      this.factureService.modificationEnfant(enfant).subscribe(
        response => console.log('Enfant mis à jour:', response),
        error => console.error('Erreur lors de la mise à jour de l’enfant:', error)
      );
      //observables.push(this.factureService.modificationEnfant(enfant));
    });
  }
}

  /*modifierFamille(famille: Famille): void {
    this.router.navigate(['/famille-edit', famille.id]);
  }*/
}