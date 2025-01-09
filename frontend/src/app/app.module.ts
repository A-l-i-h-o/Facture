import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DragAndDropModule } from 'angular-draggable-droppable';

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


@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    AccueilComponent,
    FacturesComponent,
    FamillesComponent,
    ServicesComponent,
    ReductionsComponent
    
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DragAndDropModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
