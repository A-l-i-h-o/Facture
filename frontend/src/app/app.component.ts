import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoggingComponent } from "./pages/logging/logging.component";
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoggingComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
