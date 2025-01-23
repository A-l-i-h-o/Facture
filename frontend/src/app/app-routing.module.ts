import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
