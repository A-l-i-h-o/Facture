import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreationUtilisateurComponent } from './creation-utilisateur.component';

@NgModule({
  declarations: [CreationUtilisateurComponent],
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class CreationUtilisateurModule { }