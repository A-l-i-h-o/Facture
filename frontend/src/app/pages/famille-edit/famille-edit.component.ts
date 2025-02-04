/*import { Component } from '@angular/core';

@Component({
  selector: 'app-famille-edit',
  templateUrl: './famille-edit.component.html',
  styleUrls: ['./famille-edit.component.scss']
})
export class FamilleEditComponent {

}*/
/*
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Famille } from 'src/app/model/Famille.model';

@Component({
  selector: 'app-famille-edit',
  templateUrl: './famille-edit.component.html',
  styleUrls: ['./famille-edit.component.scss']
})
export class FamilleEditComponent implements OnInit {
  
  familleForm: FormGroup;
  famille!: Famille;
  familleId!:number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService
  ) {
    this.familleForm = this.fb.group({
      parents: this.fb.array([]),
      enfants: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.familleId = Number(this.route.snapshot.paramMap.get('id'));

    this.factureService.getFamilleAllInfo(this.familleId).subscribe(famille => {
      this.initForm(famille);
    });
  }

  initForm(famille: Famille) {
    this.familleForm = this.fb.group({
      parents: this.fb.array((famille.listeParent ?? []).map(parent =>
        this.fb.group({
          nom: [parent.nom || ''],
          prenom: [parent.prenom || '']
        })
      )),
      enfants: this.fb.array((famille.listeEnfant ?? []).map(enfant =>
        this.fb.group({
          nom: [enfant.nom || ''],
          prenom: [enfant.prenom || '']
        })
      ))
    });
  }

  get parents(): FormArray {
    return this.familleForm.get('parents') as FormArray;
  }

  get enfants(): FormArray {
    return this.familleForm.get('enfants') as FormArray;
  }

  onSubmit() {
    if (this.familleForm.valid) {
      const familleModifiee: Famille = {
          id: this.famille.id,  // Assure-toi que `id` est bien défini
          listeParent: this.famille.listeParent ?? [], 
          listeEnfant: this.famille.listeEnfant ?? [], 
          archive: this.famille.archive ?? false, 
      };

      this.factureService.modifierFamille(familleModifiee).subscribe(() => {
        this.router.navigate(['/familles']);
      });
    }
  }
}*/
/*
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Famille } from 'src/app/model/Famille.model';
import { Parent } from 'src/app/model/Parent.model';
import { Enfant } from 'src/app/model/Enfant.model'; 

@Component({
  selector: 'app-famille-edit',
  templateUrl: './famille-edit.component.html',
  styleUrls: ['./famille-edit.component.scss']
})
export class FamilleEditComponent implements OnInit {
  famille!: Famille;
  parents!: Parent[];
  enfants!: Enfant[];

  constructor(private factureService: FactureService, private router: Router) {}

  ngOnInit(): void {
    // On récupère l'état de la navigation et on s'assure de travailler avec une seule famille
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['famille']) {
      this.famille = navigationState['famille'];
      this.parents = this.famille.listeParent || [];
      this.enfants = this.famille.listeEnfant || [];
    } else {
      // Si aucune famille n'est trouvée, rediriger ou afficher un message d'erreur
      this.router.navigate(['/listeFamille']);
    }
  }

  modifierParent(parent: Parent): void {
    this.factureService.modificationParent(parent).subscribe(updatedParent => {
      const index = this.parents.findIndex(p => p.id === updatedParent.id);
      if (index !== -1) {
        this.parents[index] = updatedParent;
      }
    });
  }

  modifierEnfant(enfant: Enfant): void {
    this.factureService.modificationEnfant(enfant).subscribe(updatedEnfant => {
      const index = this.enfants.findIndex(e => e.id === updatedEnfant.id);
      if (index !== -1) {
        this.enfants[index] = updatedEnfant;
      }
    });
  }

  enregistrerFamille(): void {
    this.famille.listeParent = this.parents;
    this.famille.listeEnfant = this.enfants;
    this.factureService.modifierFamille(this.famille).subscribe(updatedFamille => {
      // Traite la réponse si nécessaire
      this.router.navigate(['/listeFamille']); // Redirige vers la liste des familles après modification
    });
  }
    */
/*
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Parent } from 'src/app/model/Parent.model';
import { Enfant } from 'src/app/model/Enfant.model';
import { Famille } from 'src/app/model/Famille.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-famille-edit',
  templateUrl: './famille-edit.component.html',
  styleUrls: ['./famille-edit.component.scss'],
})
export class FamilleEditComponent implements OnInit {
  familleForm: FormGroup;
  famille!: Famille;
  idFamille!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private factureService: FactureService,
    private route: ActivatedRoute
  ) {
    this.familleForm = this.fb.group({
      listeParent: this.fb.array([]),
      listeEnfant: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.idFamille = Number(this.route.snapshot.paramMap.get('id')) || 0;
    if (this.idFamille) {
      this.factureService.getFamilleAllInfo(this.idFamille).subscribe((data: Famille) => {
        this.famille = data;
        this.familleForm.patchValue({
          listeParent: this.famille.listeParent || [],
          listeEnfant: this.famille.listeEnfant || []
        });
      });
    }
  }

  onSubmit(): void {
    if (this.familleForm.invalid) {
      return;
    }

    const updatedFamille: Famille = {
      id: this.idFamille,
      listeParent: this.familleForm.value.listeParent,
      listeEnfant: this.familleForm.value.listeEnfant,
      archive: this.famille.archive // Ajout de l'archive pour éviter l'erreur
    };    

    this.factureService.modifierFamille(updatedFamille).subscribe(
      (response: Famille) => {
        console.log('Famille mise à jour avec succès :', response);
        this.router.navigate(['/listeFamilles']);
      },
      (error: any) => {
        console.error('Erreur lors de la mise à jour de la famille :', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    );
  }

  retour(): void {
    this.router.navigate(['/listeFamilles']);
  }
}
*/

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
      console.log('Données parent envoyées:', parent); // Debug
      parent.idFamille = this.familleId;
      this.factureService.modificationParent(parent).subscribe(
        response => console.log('Parent mis à jour:', response),
        error => console.error('Erreur lors de la mise à jour du parent:', error)
      );
      //observables.push(this.factureService.modificationParent(parent));
    });

    enfants.forEach((enfant: Enfant) => {
      console.log('Données enfant envoyées:', enfant); // Debug
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