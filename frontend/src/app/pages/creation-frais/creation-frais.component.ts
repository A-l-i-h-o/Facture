import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Frais } from 'src/app/model/Frais.model';

@Component({
  selector: 'app-creation-frais',
  templateUrl: './creation-frais.component.html',
  styleUrls: ['./creation-frais.component.scss']
})
export class CreationFraisComponent implements OnInit {
  fraisForm!: FormGroup;
  submitted = false;
  error: string | null = null;
  idFacture!: number;

  constructor(
    private formBuilder: FormBuilder,
    private factureService: FactureService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idFacture = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
  }

  initForm(): void {
    this.fraisForm = this.formBuilder.group({
      montant: [null, Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      dateCreation: [null, Validators.required],
      idReduction: [null]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.fraisForm.invalid) {
      return;
    }

    const newFrais: Frais = {
      ...this.fraisForm.value,
      idFacture: this.idFacture
    };

    this.factureService.creationFrais(newFrais).subscribe({
      next: (createdFrais) => {
        console.log('Frais created successfully', createdFrais);
        this.router.navigate(['/listeFactures']);
      },
      error: (err) => { 
        this.error = 'Failed to create frais. Please try again.';
        console.error('Error creating frais', err);
      }
    });
  }

  get f() { return this.fraisForm.controls; }
}
