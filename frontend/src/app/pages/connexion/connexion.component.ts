import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureService } from 'src/app/http/FactureService';
import { Router } from '@angular/router'; // Importez Router

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private factureService: FactureService,
    private router: Router // Ajoutez Router dans le constructeur
  ) {
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

          // Supposons que la clé retournée se trouve dans `response.token`
          const session_id = response.session_id;

          if (session_id) {
            // Sauvegardez le token dans le stockage local ou sessionStorage si nécessaire
            localStorage.setItem('session_id', session_id);

            // Rediriger vers une autre route après la connexion réussie
            this.router.navigate(['/accueil']); // Modifiez '/dashboard' selon votre route cible
          } else {
            this.errorMessage = 'Le session_id n\'a pas été trouvé dans la réponse.';
          }
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
