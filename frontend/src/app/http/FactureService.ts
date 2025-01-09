import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FactureService {
  private apiUrl = 'facture/'; 

  constructor(private http: HttpClient) {}

  private fetchData(url: string): Observable<any> {
    return this.http.get(url, { observe: 'body', responseType: 'json'});
  }

  httpConnexion(login:string, mdp: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.apiUrl+"connexion?login="+login+"&mdp="+mdp, { headers: headers ,responseType: 'json'});
  }

  // httpListeRecherchesJoueur(nomJoueur:string): Observable<any> {
  //   return this.fetchData(this.apiUrl+"listeRecherchesJoueur?nomJoueur=" + nomJoueur);
  // }
}