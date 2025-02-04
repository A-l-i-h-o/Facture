import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Utilisateur } from 'src/app/model/Utilisateur.model';

@Component({
  selector: 'app-creation-utilisateur',
  templateUrl: './creation-utilisateur.component.html',
  styleUrls: ['./creation-utilisateur.component.scss']
})
export class CreationUtilisateurComponent implements OnInit {
  utilisateurForm!: FormGroup;
  submitted = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private factureService: FactureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.utilisateurForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.utilisateurForm.invalid) return;

    const utilisateur: Utilisateur = this.utilisateurForm.value;

    this.factureService.creationCompte(utilisateur).subscribe({
      next: () => this.router.navigate(['/listeUtilisateurs']),
      error: (err) => {
        this.error = 'Failed to create user. Please try again.';
        console.error('Error creating user', err);
      }
    });
  }

  get f() { return this.utilisateurForm.controls; }
}
