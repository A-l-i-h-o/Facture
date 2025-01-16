import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from '../model/Facture.model';
import { Famille } from '../model/Famille.model';

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

  getFactures(sessionId: string | null): Observable<Facture[]> {
    if(sessionId === null) {
      throw new Error('Session ID is null');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      sessionId: sessionId,
    };

    return this.http.request<any>('GET', `${this.apiUrl}factures`, { body, headers });
  }

  getFamilles(sessionId: string | null): Observable<any[]> {
    if(sessionId === null) {
      throw new Error('Session ID is null');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      sessionId: sessionId,
    };
    const params = new HttpParams().set('sessionId', sessionId);
    // var result = this.http.request<any[]>('GET', `${this.apiUrl}users/`, { params });
    var result = this.http.get<any[]>(`${this.apiUrl}users/`, { params });
    console.log(result);
    return result;
  }

  getService(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}services`);
  }

  //httpListeRecherchesJoueur(nomJoueur:string): Observable<any> {
  //   return this.fetchData(this.apiUrl+"listeRecherchesJoueur?nomJoueur=" + nomJoueur);
  // }
}