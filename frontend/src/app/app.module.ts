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
import { FacturesComponent } from './pages/factures/factures.component';
import { FamillesComponent } from './pages/familles/familles.component';
import { ServicesComponent } from './pages/services/services.component';
import { ReductionsComponent } from './pages/reductions/reductions.component';
import { CreationReductionComponent } from './pages/creation-reduction/creation-reduction.component';
import { FormulaireInscriptionComponent } from './pages/formulaire-inscription/formulaire-inscription/formulaire-inscription.component';
import { FormulaireInscriptionEnfantComponent } from './pages/formulaire-inscription-enfant/formulaire-inscription-enfant.component';


@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    AccueilComponent,
    FacturesComponent,
    FamillesComponent,
    ServicesComponent,
    ReductionsComponent,
    CreationReductionComponent,
    FormulaireInscriptionComponent,
    FormulaireInscriptionEnfantComponent
    
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
