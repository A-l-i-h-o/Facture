import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule
import { LoggingComponent } from './pages/logging/logging.component';
import { HeaderComponent } from './components/header/header.component';
import { GenericFormComponent } from './components/generic-form/generic-form.component'; // Importer le composant générique

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoggingComponent,
    HeaderComponent,
    ReactiveFormsModule, // Ajouter ReactiveFormsModule ici
    GenericFormComponent // Ajouter le composant générique
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  // Exemple de modèle Person
  person = {
    nom: 'Dupont',
    prenom: 'Jean'
  };
}
