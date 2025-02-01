import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureService } from 'src/app/http/FactureService';
import { Enfant } from 'src/app/model/Enfant.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formulaire-inscription-enfant',
  templateUrl: './formulaire-inscription-enfant.component.html',
  styleUrls: ['./formulaire-inscription-enfant.component.scss']
})
export class FormulaireInscriptionEnfantComponent implements OnInit {
  
  signupForm: FormGroup;
  submitted = false;
  idFamille!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private factureService: FactureService,
    private route: ActivatedRoute
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0), Validators.max(18)]]
    });
  }

  ngOnInit(): void {
    this.idFamille = Number(this.route.snapshot.paramMap.get('id')) || 0;
  }

  // Getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    this.submitted = true;

    // Si le formulaire est invalide, on arrête ici
    if (this.signupForm.invalid) {
      return;
    }

    // Création d'un objet Enfant à partir des valeurs du formulaire
    const newEnfant: Enfant = {
      nom: this.signupForm.value.lastName,
      prenom: this.signupForm.value.firstName,
      age: Number(this.signupForm.value.age),
      idFamille: this.idFamille,
      archive: false
    };

    // Appel du service pour créer un enfant via l'API
    this.factureService.creationEnfant(newEnfant).subscribe(
      (response) => {
        console.log('Enfant créé avec succès :', response);

        if (this.idFamille) {
          console.log('ID Famille associé :', this.idFamille);
        }

        this.router.navigate(['/famille', this.idFamille]);
      },
      (error) => {
        console.error("Erreur lors de la création de l'enfant :", error);
        alert("Une erreur est survenue lors de la création de l'enfant. Veuillez réessayer.");
      }
    );
  }
}
