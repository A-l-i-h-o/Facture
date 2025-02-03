// creation-facture.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Facture } from 'src/app/model/Facture.model';

@Component({
  selector: 'app-creation-facture',
  templateUrl: './creation-facture.component.html',
  styleUrls: ['./creation-facture.component.scss']
})
export class CreationFactureComponent implements OnInit {
  factureForm!: FormGroup;
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

  initForm(): void {
    this.factureForm = this.formBuilder.group({
      description: ['', Validators.required],
      creancier: ['', Validators.required],
      dateCreation: ['', Validators.required],
      periode: ['', Validators.required],
      debiteur: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      etatPaiement: ['', Validators.required],
      idReduction: [null, Validators.required],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.factureForm.invalid) {
      return;
    }

    const newFacture: Facture = {
      ...this.factureForm.value
    };

    this.factureService.creationFacture(newFacture).subscribe({
      next: (createdFacture) => {
        console.log('Facture created successfully', createdFacture);
        this.router.navigate(['/listeFactures']);
      },
      error: (err) => { 
        this.error = 'Failed to create facture. Please try again.';
        console.error('Error creating facture', err);
      }
    });
  }

  get f() { return this.factureForm.controls; }
}
