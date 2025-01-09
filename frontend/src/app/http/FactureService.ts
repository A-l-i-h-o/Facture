import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FactureService {
  private apiUrl = 'http://localhost:9392/'; 

  constructor(private http: HttpClient) {}

  private fetchData(url: string): Observable<any> {
    return this.http.get(url, { observe: 'body', responseType: 'json'});
  }

  httpLogin(login: string, mdp: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    const body = {
      login: login,
      mdp: mdp,
    };
  
    return this.http.post<any>(`${this.apiUrl}users/connect`, body, { headers });
  }
  

  //httpListeRecherchesJoueur(nomJoueur:string): Observable<any> {
  //   return this.fetchData(this.apiUrl+"listeRecherchesJoueur?nomJoueur=" + nomJoueur);
  // }
}