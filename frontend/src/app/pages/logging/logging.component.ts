import { Component } from '@angular/core';
import { Person } from '../../model/formulaire/Person.model';
import { GenericFormComponent } from "../../components/generic-form/generic-form.component";

@Component({
  selector: 'app-logging',
  imports: [GenericFormComponent],
  templateUrl: './logging.component.html',
  styleUrl: './logging.component.scss'
})
export class LoggingComponent {

  person: Person = new Person('Dupont', 'Jean');
}
