import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { CreationReductionComponent } from './pages/creation-reduction/creation-reduction.component';
import { FormulaireInscriptionComponent } from './pages/formulaire-inscription/formulaire-inscription/formulaire-inscription.component';
import { FormulaireInscriptionEnfantComponent } from './pages/formulaire-inscription-enfant/formulaire-inscription-enfant.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { ListeFamillesComponent } from './pages/familles/listeFamilles.component';
import { ListeServicesComponent } from './pages/services/listeServices.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ListeFacturesComponent } from './pages/factures/listeFactures.component';
import { ListeReductionsComponent } from './pages/reductions/listeReductions.component';

const routes: Routes = [
  { path: '', component: ConnexionComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'listeFactures', component: ListeFacturesComponent },
  { path: 'listeFamilles', component: ListeFamillesComponent },
  { path: 'listeServices', component: ListeServicesComponent },
  { path: 'listeReductions', component: ListeReductionsComponent },
  { path: 'creation-reduction', component: CreationReductionComponent },
  { path: 'formulaire-inscription', component: FormulaireInscriptionComponent},
  { path: 'formulaire-inscription-enfant', component: FormulaireInscriptionEnfantComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
