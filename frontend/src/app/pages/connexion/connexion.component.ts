import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureService } from 'src/app/http/FactureService';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private factureService: FactureService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.factureService.httpLogin(username, password).subscribe(
        (response) => {
          console.log('Connexion réussie', response);
          // Ajouter la logique de redirection ici
        },
        (error) => {
          console.error('Erreur lors de la connexion', error);
          this.errorMessage = 'Login ou mot de passe incorrect.';
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs.';
    }
  }
}
