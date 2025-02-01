import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService'; // Assurez-vous du chemin correct
import { Parent } from 'src/app/model/Parent.model'; // Modèle Parent
import { Utilisateur } from 'src/app/model/Utilisateur.model';
/*
@Component({
  selector: 'app-formulaire-inscription',
  templateUrl: './formulaire-inscription.component.html',
  styleUrls: ['./formulaire-inscription.component.scss']
})
export class FormulaireInscriptionComponent {

@Component({
  selector: 'app-formulaire-inscription',
  templateUrl: './formulaire-inscription.component.html',
  styleUrls: ['./formulaire-inscription.component.scss'],
})
export class FormulaireInscriptionComponent {
  signupForm: FormGroup; // Formulaire réactif
  submitted = false; // État de soumission
  id_user!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private factureService: FactureService,
     private route: ActivatedRoute
  ) {
    // Initialisation du formulaire avec des validateurs
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      situation: ['', Validators.required], // Ajout du champ situation
    });
  }

  ngOnInit(): void {
    this.id_user = Number(this.route.snapshot.paramMap.get('id')); // Récupérer l'ID de l'user depuis l'URL
  }

  // Getter pour simplifier l'accès aux contrôles du formulaire
  get f() {
    return this.signupForm.controls;
  }

  generateRandomPassword(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  generateUsername(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName).toLowerCase();
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    this.submitted = true;

    // Si le formulaire est invalide, on arrête ici
    if (this.signupForm.invalid) {
      return;
    }

    // Création d'un objet Parent à partir des valeurs du formulaire
    const newParent: Parent = {
      nom: this.signupForm.value.lastName,
      prenom: this.signupForm.value.firstName,
      adresse: this.signupForm.value.address,
      adresseEmail: this.signupForm.value.email,
      statut: this.signupForm.value.situation,
    };

    const user : Utilisateur = { id : this.id_user};

    this.factureService.ajoutFamille(user).subscribe(
      (response) => {
        newParent.idFamille = response.idFamille;
      },
      (error) => {
        console.error('Erreur lors de la récupération de la famille :', error);
      }
    );

    // Appel du service pour créer un parent via l'API
    this.FactureService.creationParent(newParent).subscribe(
      (parentResponse) => {
        console.log('Parent créé avec succès :', parentResponse);

        const username = this.generateUsername(newParent.prenom, newParent.nom);
        const password = this.generateRandomPassword(10);

        const newUser: Utilisateur = {
          login: username,
          mdp: password,
          admin:false
        };

        this.FactureService.creationCompte(newUser).subscribe(
          (userResponse) => {
            console.log('Compte utilisateur créé avec succès :', userResponse);
            alert(`Compte créé avec succès !\nPseudo: ${username}\nMot de passe: ${password}`);
            this.router.navigate(['/formulaire-inscription-enfant']);
          },
          (error) => {
            console.error('Erreur lors de la création du compte utilisateur :', error);
            alert('Une erreur est survenue lors de la création du compte utilisateur.');
          }
        );
        // Redirection vers la page suivante
        this.router.navigate(['/formulaire-inscription-enfant']);
      },
      (error) => {
        console.error('Erreur lors de la création du parent :', error);
        alert('Une erreur est survenue lors de la création. Veuillez réessayer.');
      }
    );
  }



  // Méthode pour revenir à la liste des familles
  retour(): void {
    this.router.navigate(['/listeFamilles']); // Redirige vers la page des familles
  }
}