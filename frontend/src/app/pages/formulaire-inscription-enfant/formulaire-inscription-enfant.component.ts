import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulaire-inscription-enfant',
  templateUrl: './formulaire-inscription-enfant.component.html',
  styleUrls: ['./formulaire-inscription-enfant.component.scss']
})
export class FormulaireInscriptionEnfantComponent {

  signupForm: FormGroup;
    submitted = false;
  
    constructor(private formBuilder: FormBuilder) {
      this.signupForm = this.formBuilder.group(
        {
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          address: ['', Validators.required]
        }
      );
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
