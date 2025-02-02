import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ListeFamillesComponent } from './pages/familles/listeFamilles.component';
import { ListeServicesComponent } from './pages/services/listeServices.component';
import { ListeFacturesComponent } from './pages/factures/listeFactures.component';
import { ListeReductionsComponent } from './pages/reductions/listeReductions.component';
import { CreationFactureComponent } from './pages/creation-facture/creation-facture.component';
import { CreationReductionComponent } from './pages/creation-reduction/creation-reduction.component';
import { CreationUtilisateurComponent } from './pages/creation-utilisateur/creation-utilisateur.component';
import { FormulaireInscriptionEnfantComponent } from './pages/formulaire-inscription/formulaire-inscription-enfant/formulaire-inscription-enfant.component';
import { FormulaireInscriptionComponent } from './pages/formulaire-inscription/formulaire-inscription/formulaire-inscription.component';

import { FactureDetailComponent } from './pages/factures/facture-detail/facture-detail.component';
import { FamilleDetailComponent } from './pages/familles/famille-detail/famille-detail.component';
import { EnteteComponent } from './pages/entete/entete.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';


@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    AccueilComponent,
    ListeFacturesComponent,
    ListeFamillesComponent,
    ListeServicesComponent,
    ListeReductionsComponent,
    CreationFactureComponent,
    CreationReductionComponent,
    CreationUtilisateurComponent,
    FormulaireInscriptionComponent,
    FormulaireInscriptionEnfantComponent,
    FactureDetailComponent,
    FamilleDetailComponent,
    EnteteComponent,
    UtilisateursComponent
    
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
