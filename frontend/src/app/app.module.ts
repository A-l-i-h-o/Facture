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


@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    AccueilComponent,
    ListeFacturesComponent,
    ListeFamillesComponent,
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
