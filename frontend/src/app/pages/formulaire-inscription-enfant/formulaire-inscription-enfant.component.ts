import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureService } from 'src/app/http/FactureService';
import { Enfant } from 'src/app/model/Enfant.model'; // Modèle Enfant
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulaire-inscription-enfant',
  templateUrl: './formulaire-inscription-enfant.component.html',
  styleUrls: ['./formulaire-inscription-enfant.component.scss']
})
export class FormulaireInscriptionEnfantComponent {

  signupForm: FormGroup;
  submitted = false;
  idFamille: number | undefined;
  
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private FactureService: FactureService
    ) {
      this.signupForm = this.fb.group(
        {
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          age: ['', [Validators.required]],
        }
      );
    }
  
    // Getter for easy access to form fields
    get f() {
      return this.signupForm.controls;
    }
/*  
    onSubmit() {
      this.submitted = true;
  
      if (this.signupForm.invalid) {
        return;
      }
  
      console.log('Formulaire soumis avec succès', this.signupForm.value);
    }
  
    mustMatch(controlName: string, matchingControlName: string) {
      return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
  
        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
          return;
        }
  
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }
      };
    }
*/

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
      age: this.signupForm.value.age,
    };

    // Appel du service pour créer un parent via l'API
    this.FactureService.creationEnfant(newEnfant).subscribe(
      (response) => {
        console.log('Enfant créé avec succès :', response);

        // Affichage de l'ID de la famille dans la console
      if (response.idFamille) {
        console.log('ID Famille associé :', response.idFamille);
        alert(`Enfant créé avec succès. ID Famille associé : ${response.idFamille}`);
      }

      this.idFamille = response.idFamille;

        // Redirection vers la page suivante
        //this.router.navigate(['/formulaire-inscription-enfant']); A décommenter
      },
      (error) => {
        console.error("Erreur lors de la création de l'enfant :", error);
        alert('Une erreur est survenue lors de la création. Veuillez réessayer.');
      }
    );
  }

}
