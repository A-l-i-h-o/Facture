import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../model/Utilisateur.model';
import { Enfant } from '../model/Enfant.model';
import { Parent } from '../model/Parent.model';
import { Reduction } from '../model/Reduction.model';
import { Paiement } from '../model/Paiement.model';
import { Frais } from '../model/Frais.model';
import { Facture } from '../model/Facture.model';
import { Famille } from '../model/Famille.model';


@Injectable({
  providedIn: 'root',
})
export class FactureService {
  private apiUrl = 'http://localhost:9392/'; 

  constructor(private http: HttpClient) {}

  // UTILISATEUR //

  connexion(utilisateur:Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}utilisateur/connexion`, utilisateur,{ observe: 'body'});
  }

  deconnexion(): Observable<any> {
    return this.http.get(`${this.apiUrl}utilisateur/deconnexion`);
  }

  creationCompte(utilisateur:Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}utilisateur/creation`,utilisateur,{ observe: 'body'});
  }

  modificationCompte(utilisateur:Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}utilisateur/modification`,utilisateur,{ observe: 'body'});
  }

  ajoutFamille(utilisateur:Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}utilisateur/ajout_famille`,utilisateur,{ observe: 'body'});
  }

  ///////////

  // Enfant //

  creationEnfant(enfant:Enfant): Observable<Enfant> {
    return this.http.post<Enfant>(`${this.apiUrl}enfant/creation`,enfant,{ observe: 'body'});
  }

  modificationEnfant(enfant:Enfant): Observable<Enfant> {
    return this.http.post<Enfant>(`${this.apiUrl}enfant/modification`,enfant,{ observe: 'body'});
  }

  getEnfant(id:number): Observable<Enfant> {
    return this.http.get<Enfant>(`${this.apiUrl}enfant/?id_enfant=${id}`);
  }

  getAllEnfant(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(`${this.apiUrl}enfant/all`);
  }

  getDetailEnfant(id:number): Observable<Enfant> {
    return this.http.get<Enfant>(`${this.apiUrl}enfant/all_info?id_enfant=${id}`);
  }

  ///////////

  // Parent //

  creationParent(parent:Parent): Observable<Parent> {
    return this.http.post<Parent>(`${this.apiUrl}parent/creation`,parent,{ observe: 'body'});
  }

  modificationParent(parent:Parent): Observable<Parent> {
    return this.http.post<Parent>(`${this.apiUrl}parent/modification`,parent,{ observe: 'body'});
  }

  getParent(id:number): Observable<Parent> {
    return this.http.get<Parent>(`${this.apiUrl}parent/?id_parent=${id}`);
  }

  getAllParent(): Observable<Parent[]> {
    return this.http.get<Parent[]>(`${this.apiUrl}parent/all`);
  }

  ///////////

  // Reduction //

  creationReduction(reduction:Reduction): Observable<Reduction> {
    return this.http.post<Reduction>(`${this.apiUrl}reduction/creation`,reduction,{ observe: 'body'});
  }

  liaisonReductionFamille(reduction:Reduction): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}reduction/liaison_reduction_famille`,reduction,{ observe: 'body'});
  }

  liaisonReductionEnfant(reduction:Reduction): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}reduction/liaison_reduction_enfant`,reduction,{ observe: 'body'});
  }

  getReduction(id:number): Observable<Reduction> {
    return this.http.get<Reduction>(`${this.apiUrl}reduction/?id_reduction=${id}`);
  }

  getAllReduction(): Observable<Reduction[]> {
    return this.http.get<Reduction[]>(`${this.apiUrl}reduction/all`);
  }

  ///////////


  // Paiement //

  creationPaiement(paiement:Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}paiement/creation`,paiement,{ observe: 'body'});
  }

  getPaiement(id:number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}paiement/?id_paiement=${id}`);
  }

  getAllPaiement(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}paiement/all`);
  }

  ///////////


  // Frais //

  creationFrais(frais:Frais): Observable<Frais> {
    return this.http.post<Frais>(`${this.apiUrl}frais/creation`,frais,{ observe: 'body'});
  }
  
  getFrais(id:number): Observable<Frais> {
    return this.http.get<Frais>(`${this.apiUrl}frais/?id_frais=${id}`);
  }
  
  getAllFrais(): Observable<Frais[]> {
    return this.http.get<Frais[]>(`${this.apiUrl}frais/all`);
  }  
  
  liaisonFraisFacture(frais:Frais): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}frais/liaison_facture`,frais,{ observe: 'body'});
  }
  
  ///////////

  // Facture //

  creationFacture(facture:Facture): Observable<Facture> {
    return this.http.post<Facture>(`${this.apiUrl}facture/creation`,facture,{ observe: 'body'});
  }
    
  getFacture(id:number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}facture/?id_facture=${id}`);
  }
    
  getAllFacture(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}facture/all`);
  }   
  
  getFactureAllInfo(id:number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}facture/all_info?id_facture=${id}`);
  } 
    
  liaisonFamilleFacture(facture:Facture): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}facture/liaison_facture`,facture,{ observe: 'body'});
  }
    
  ///////////

  // Famille //

  getFamilleAllInfo(id:number): Observable<Famille> {
    return this.http.get<Famille>(`${this.apiUrl}famille/all_info?id_famille=${id}`);
  } 

  ///////////
}