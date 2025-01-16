from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from baseDeDonnees.MySqlDatabase import MySQLDatabase
from datetime import time
import httpx

# In-memory "database" for families
famille_db = {}

famille_router = APIRouter()

class LiaisonFamilleFacture(BaseModel):
    id_facture: int
    id_famille : int


class Reduction(BaseModel):
    id_reduction: int
    description_reduction: str
    montant_reduction : float
    pourcentage_reduction: float

    
class Parent(BaseModel):
    id_parent: int
    id_famille: int
    libelle_statut_parent : str
    nom: str
    prenom: str
    adresse_parent: str
    adresse_email_parent : str

    
class Enfant(BaseModel):
    id_famille: int
    nom: str
    prenom: str
    age: int
    liste_reduction: List[Reduction]
    

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


class Facture(BaseModel):

    id_facture: int
    periode: str
    etat_paiement: str
    description_facture: str
    creancier: str
    debiteur: str
    date_creation_facture: date
    date_paiment_total_facture: date
    date_echeance_facture: date
    liste_frais: List[Frais]
    liste_paiement: List[Paiement]
    

class Famille(BaseModel):
    liste_id_parents: List[Parent]
    liste_id_enfants: List[Enfant]
    liste_id_facture: List[Facture]
    liste_id_reduction: Liste[Reduction]



# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()

@famille_router.get("/{id_famille}", response_model=Famille)
async def get_famille(id_famille:int):

    famille = Famille()
    
    query = "SELECT id_parent FROM liste_parent WHERE id_famille=%d"
    result = mysql.fetch_query(query, (id_famille,))

    for id_parent in result.values():
        
        with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:4200/parent", params={"id_parent":id_parent})
            famille.liste_id_parents.append(response.values())

    query = "SELECT id_enfant FROM liste_enfant WHERE id_famille=%d"
    result = mysql.fetch_query(query, (id_famille,))

    for id_enfant in result.values():
        
        with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:4200/enfant", params={"id_enfant":id_enfant})
            famille.liste_id_enfants.append(response.values())

    query = "SELECT id_facture FROM historique_facture WHERE id_famille=%d"
    result = mysql.fetch_query(query, (id_famille,))

    for id_facture in result.values():
        
        with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:4200/facture", params={"id_facture":id_facture})
            famille.liste_id_facture.append(response.values())

    query = "SELECT id_reduction FROM liste_reduction_famille WHERE id_famille=%d"
    result = mysql.fetch_query(query, (id_famille,))

    for id_reduction_famille in result.values():
        
        with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:4200/reduction", params={"id_reduction":id_reduction_famille})
            famille.liste_id_reduction.append(response.values())
    
    return famille


@famille_router.get("/allIdFamille", response_model=List[int])
async def get_all_familles():
    query = "SELECT id_famille FROM famille"
    result = mysql.fetch_query(query, (user_login,))
    return list(mysql.values())


@famille_router.get("/famille", response_model=int)
async def get_family(user_id: int):
    _,id_famille = mysql.callproc("creation_utilisateur",(user_id,0))
    return id_famille


@famille_router.post("/liaison_famille_facture")
async def liaison_famille_facture(liaison: LiaisonFamilleFacture):
    mysql.callproc("liaison_famille_facture",(liaison.id_famille, liaison.id_facture))

