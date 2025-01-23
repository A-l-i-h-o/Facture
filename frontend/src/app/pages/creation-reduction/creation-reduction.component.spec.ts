import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreationReductionComponent } from './creation-reduction.component';

@NgModule({
  declarations: [CreationReductionComponent],
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class CreationReductionModule { }