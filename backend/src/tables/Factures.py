from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from baseDeDonnees.MySqlDatabase import MySQLDatabase

from datetime import date

facture_db = {}

facture_router = APIRouter()

class Reduction(BaseModel):
    id_reduction: int
    description_reduction: str
    montant_reduction : float
    pourcentage_reduction: float

class Paiement(BaseModel):
    id_facture: int
    libelle_type_paiement: str
    date_paiement: date
    montant_paiement: float
    description_paiement: str
    

class Frais(BaseModel):
    description_type:str
    description_reduction:str
    montant_reduction:float
    pourcentage_reduction:float
    date_creation_frais:date
    montant_frais:float
    description_frais:str

class FactureEntree(BaseModel):
    
    libelle_periode: str
    id_reduction: int,
    libelle_etat_paiement: str
    description_facture: str
    creancier: str
    debiteur: str
    date_creation_facture: date
    date_paiment_total_facture: date
    date_echeance_facture: date
    
class Facture(BaseModel):
    
    id_facture: int
    libelle_periode: str
    reduction: Reduction,
    libelle_etat_paiement: str
    description_facture: str
    creancier: str
    debiteur: str
    date_creation_facture: date
    date_paiment_total_facture: date
    date_echeance_facture: date
    liste_frais: List[Frais]
    liste_paiement: List[Paiement]


# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()

@facture_router.get("/creation", response_model=int)
async def creation_facture(facture: Facture):
    _,_,_,_,_,_,_,_,_,id_facture = mysql.callproc("creation_facture",(
        facture.libelle_periode,facture.id_reduction, facture.libelle_etat_paiement,
        facture.description_facture,facture.creancier,facture.debiteur,
        facture.date_creation_facture,facture.date_paiment_total_facture,facture.date_echeance_facture
    ,0))
    return id_facture

@facture_router.get("/{id_facture}", response_model=Facture)
async def creation_facture(id_facture: int):
    
    facture = Facture()
    
    _,libelle_periode,id_reduction,libelle_etat_paiement,description_facture,creancier,debiteur,date_creation_facture,date_paiment_total_facture,date_echeance_facture = mysql.callproc("get_facture",(id_facture,0,0,0,0,0,0,0,0,0))
    
    facture.id_facture=id_facture
    facture.libelle_periode=libelle_periode
    facture.libelle_etat_paiement=libelle_etat_paiement
    facture.description_facture=description_facture
    facture.creancier=creancier
    facture.debiteur=debiteur
    facture.date_creation_facture=date_creation_facture
    facture.date_paiment_total_facture=date_paiment_total_facture
    facture.date_echeance_facture=date_echeance_facture
    
    
    with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:4200/reduction", params={"id_reduction":id_reduction_famille})
        facture.reduction=response.values()
    
    
    query = "SELECT id_frais FROM liste_frais_facture WHERE id_facture=%d"
    result = mysql.fetch_query(query, (id_facture,))

    for id_frais in result.values():
        
        with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:4200/frais", params={"id_frais":id_frais})
            facture.liste_frais.append(response.values())
            
    
    query = "SELECT id_paiement FROM liste_paiement_facture WHERE id_facture=%d"
    result = mysql.fetch_query(query, (id_facture,))

    for id_paiement in result.values():
        
        with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:4200/paiement", params={"id_paiement":id_paiement})
            facture.liste_paiement.append(response.values())
    
    
    return id_facture
