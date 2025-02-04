import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Parent } from 'src/app/model/Parent.model';
import { Famille } from 'src/app/model/Famille.model';
import { Utilisateur } from 'src/app/model/Utilisateur.model';
import { switchMap } from 'rxjs/operators';
import { Input } from '@angular/core';

@Component({
  selector: 'app-formulaire-inscription',
  templateUrl: './formulaire-inscription.component.html',
  styleUrls: ['./formulaire-inscription.component.scss'],
})
export class FormulaireInscriptionComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;
  id_user!: number;
  newUser!: Utilisateur;
  @Input() famille: Famille | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private factureService: FactureService,
    private route: ActivatedRoute
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      situation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id_user = Number(this.route.snapshot.paramMap.get('id')) || 0;
  }

  get f() {
    return this.signupForm.controls;
  }

  generateRandomPassword(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }

  generateUsername(firstName: string, lastName: string): string {
    return ((firstName ? firstName.charAt(0) : '') + (lastName || '')).toLowerCase();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    const newParent: Parent = {
      nom: this.signupForm.value.lastName,
      prenom: this.signupForm.value.firstName,
      adresse: this.signupForm.value.address,
      adresseEmail: this.signupForm.value.email,
      statut: this.signupForm.value.situation,
      archive: false,
    };

    if (this.id_user === 0) {
      const username = this.generateUsername(newParent.prenom, newParent.nom);
      const password = this.generateRandomPassword(10);

      this.newUser = {
        login: username,
        mdp: password,
        admin: false,
      };

      this.factureService.creationCompte(this.newUser)
        .pipe(
          switchMap((userResponse) => {
            console.log('Compte utilisateur créé avec succès :', userResponse);
            this.newUser = userResponse;
            return this.factureService.ajoutFamille(this.newUser);
          }),
          switchMap((response) => {
            console.log('Famille ajoutée avec succès :', response);
            this.newUser.idFamille = response.id;
            newParent.idFamille = response.id;
            return this.factureService.creationParent(newParent);
          })
        )
        .subscribe(
          (parentResponse) => {
            console.log('Parent créé avec succès :', parentResponse);
            this.router.navigate(['/formulaire-inscription-enfant', this.newUser.idFamille]);
          },
          (error) => {
            console.error('Erreur lors du processus d’inscription :', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
          }
        );
    } else {
      this.newUser = { id: this.id_user } as Utilisateur;
      this.factureService.ajoutFamille(this.newUser)
        .pipe(
          switchMap((response) => {
            console.log('Famille récupérée :', response);
            this.newUser.idFamille = response.id;
            newParent.idFamille = response.id;
            return this.factureService.creationParent(newParent);
          })
        )
        .subscribe(
          (parentResponse) => {
            console.log('Parent ajouté avec succès :', parentResponse);
            this.router.navigate(['/formulaire-inscription-enfant', this.newUser.idFamille]);
          },
          (error) => {
            console.error('Erreur lors de la création du parent :', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
          }
        );
    }
  }

  retour(): void {
    this.router.navigate(['/listeFamilles']);
  }
}
