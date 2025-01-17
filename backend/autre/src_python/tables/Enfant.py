from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from baseDeDonnees.MySqlDatabase import MySQLDatabase

enfant_db = {}

enfant_router = APIRouter()

class Reduction(BaseModel):
    id_reduction: int
    description_reduction: str
    montant_reduction : float
    pourcentage_reduction: float


class Enfant(BaseModel):
    id_famille: int
    nom: str
    prenom: str
    age: int
    liste_reduction: List[Reduction]


# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()


@enfant_router.post("/{id_enfant}", response_model=Enfant)
async def recuperation_enfant(id_enfant: int):
    
    query = "SELECT * FROM enfant WHERE id_enfant=%q"
    result = mysql.fetch_query(query)
    enfant = mysql.values()
    
    
    query = "SELECT id_reduction FROM liste_reduction_enfant WHERE id_enfant=%d"
    result = mysql.fetch_query(query, (id_enfant,))

    for id_reduction_enfant in result.values():
        
        with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:4200/reduction", params={"id_reduction":id_reduction_enfant})
            enfant.liste_reduction.append(response.values())
            
            
    return enfant


@enfant_router.post("/creation", response_model=int)
async def creation_enfant(enfant: Enfant):
    _,_,_,id_enfant= mysql.callproc("recuperation_id_enfant",(enfant.id_famille, enfant.nom, enfant.prenom, enfant.age, 0))
    return id_enfant


