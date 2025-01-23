import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { CreationReductionComponent } from './pages/creation-reduction/creation-reduction.component';
import { FormulaireInscriptionComponent } from './pages/formulaire-inscription/formulaire-inscription/formulaire-inscription.component';
import { FormulaireInscriptionEnfantComponent } from './pages/formulaire-inscription-enfant/formulaire-inscription-enfant.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { FacturesComponent } from './pages/factures/factures.component';
import { FamillesComponent } from './pages/familles/familles.component';
import { ServicesComponent } from './pages/services/services.component';
import { ReductionsComponent } from './pages/reductions/reductions.component';

const routes: Routes = [
  { path: '', component: ConnexionComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'factures', component: FacturesComponent },
  { path: 'familles', component: FamillesComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'reductions', component: ReductionsComponent },
  { path: 'creation-reduction', component: CreationReductionComponent },
  { path: 'formulaire-inscription', component: FormulaireInscriptionComponent},
  { path: 'formulaire-inscription-enfant', component: FormulaireInscriptionEnfantComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
