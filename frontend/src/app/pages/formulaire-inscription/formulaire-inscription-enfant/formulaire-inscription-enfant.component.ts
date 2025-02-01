import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formulaire-inscription-enfant',
  templateUrl: './formulaire-inscription-enfant.component.html',
  styleUrls: ['./formulaire-inscription-enfant.component.scss']
})
export class FormulaireInscriptionEnfantComponent {

  signupForm: FormGroup;
    submitted = false;
    id_famille ?: number;
  
    constructor(private formBuilder: FormBuilder,
         private route: ActivatedRoute) {
      this.signupForm = this.formBuilder.group(
        {
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          address: ['', Validators.required]
        }
      );
    }

    ngOnInit(): void {
      this.id_famille = Number(this.route.snapshot.paramMap.get('id')); // Récupérer l'ID de l'user depuis l'URL
    }
  
    // Getter for easy access to form fields
    get f() {
      return this.signupForm.controls;
    }
  
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
}
