import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { FacturesComponent } from './pages/factures/factures.component';
import { ListeFamillesComponent } from './pages/familles/listeFamilles.component';
import { ServicesComponent } from './pages/services/services.component';
import { ReductionsComponent } from './pages/reductions/reductions.component';
import { AccueilComponent } from './pages/accueil/accueil.component';

const routes: Routes = [
  { path: '', component: ConnexionComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'factures', component: FacturesComponent },
  { path: 'listeFamilles', component: ListeFamillesComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'reductions', component: ReductionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
