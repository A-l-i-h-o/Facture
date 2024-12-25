import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour le pipe titlecase
import { ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Ajouter CommonModule ici
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent implements OnInit {
  @Input() model: any; // Le modèle à passer (par exemple Person)
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Créer le formulaire en fonction des propriétés du modèle
    this.form = this.fb.group({});
    this.createForm(this.model);
  }

  // Créer dynamiquement le formulaire
  createForm(model: any): void {
    Object.keys(model).forEach(key => {
      this.form.addControl(key, this.fb.control(model[key]));
    });
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    console.log(this.form.value);
  }
}
