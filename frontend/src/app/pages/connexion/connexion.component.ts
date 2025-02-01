import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureService } from 'src/app/http/FactureService';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/app/model/Utilisateur.model';

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
    private router: Router
  ) {
    // Initialisation du formulaire de connexion
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Récupérer les valeurs du formulaire
      const { username, password } = this.loginForm.value;

      // Créer une instance de l'objet Utilisateur
      const utilisateur: Utilisateur = {
        login: username,
        mdp: password,
      };

      // Appeler le service pour la connexion
      this.factureService.connexion(utilisateur).subscribe(
        (response: any) => { // Remplacez `any` par un type défini si possible
          console.log('Connexion réussie', response);

          // Supposons que `response.id` contient le session_id
          const session_id = response.id;

          if (session_id) {
            // Sauvegarder le session_id dans localStorage
            localStorage.setItem('session_id', session_id);

            // Redirection vers la page d'accueil
            this.router.navigate(['/accueil']);
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
