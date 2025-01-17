from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from datetime import date

from baseDeDonnees.MySqlDatabase import MySQLDatabase

paiement_db = {}

paiement_router = APIRouter()

class Paiement(BaseModel):
    id_facture: int
    libelle_type_paiement: str
    date_paiement: date
    montant_paiement: float
    description_paiement: str



# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()


@paiement_router.get("/type_paiement", response_model=List[str])
async def get_all_type_paiement():
    query = "SELECT libelle_type_paiement FROM type_paiement"
    result = mysql.fetch_query(query)
    return list(mysql.values())

@paiement_router.post("/ajout", response_model=int)
async def ajout_paiement(paiement: Paiement):
    mysql.callproc("paiement",(paiement.id_facture, paiement.libelle_type_paiement, paiement.date_paiement, paiement.montant_paiement, paiement.description_paiement))
