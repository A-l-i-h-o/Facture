import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAccueilComponent } from './pages/page-accueil/page-accueil.component';
import { FormulaireInscriptionComponent } from './pages/formulaire-inscription/formulaire-inscription/formulaire-inscription.component';
import { FormulaireInscriptionEnfantComponent } from './pages/formulaire-inscription-enfant/formulaire-inscription-enfant.component';

const routes: Routes = [
  { path: '', component: PageAccueilComponent },
  { path: 'formulaire-inscription', component: FormulaireInscriptionComponent},
  { path: 'formulaire-inscription-enfant', component: FormulaireInscriptionEnfantComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
