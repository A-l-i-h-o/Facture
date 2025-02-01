import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FactureService } from 'src/app/http/FactureService';
import { Reduction } from 'src/app/model/Reduction.model';

@Component({
  selector: 'app-creation-reduction',
  templateUrl: './creation-reduction.component.html',
  styleUrls: ['./creation-reduction.component.scss']
})
export class CreationReductionComponent implements OnInit {
  reductionForm!: FormGroup;
  submitted = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private factureService: FactureService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.reductionForm = this.formBuilder.group({
      idFamille: [null, Validators.required],
      idEnfant: [null],
      pourcentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      montant: [null, [Validators.required, Validators.min(0)]],
      description: [''],
      archive: [false]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.reductionForm.invalid) {
      return;
    }

    const reduction: Reduction = {
      ...this.reductionForm.value
    };

    this.factureService.creationReduction(reduction).subscribe({
      next: (createdReduction) => {
        console.log('Reduction created successfully', createdReduction);
        this.router.navigate(['/reductions']);
      },
      error: (err) => {
        this.error = 'Failed to create reduction. Please try again.';
        console.error('Error creating reduction', err);
      }
    });
  }

  get f() { return this.reductionForm.controls; }
}