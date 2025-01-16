from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from datetime import datetime

from baseDeDonnees.MySqlDatabase import MySQLDatabase

frais_db = {}

frais_router = APIRouter()

class Frais(BaseModel):
    libelle_type_frais: str
    id_reduction : int
    montant_frais: float
    description_frais: str

class LiaisonFraisFacture(BaseModel):
    id_facture: int
    id_frais : int

# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()



@frais_router.post("/creation", response_model=int)
async def creation_frais(frais: Frais):
    _,_,_,_,_,_,id_frais= mysql.callproc("creation_frais",(frais.libelle_type_frais, frais.id_reduction, datetime.now(), frais.montant_frais, frais.description_frais, 0))
    return id_frais


@frais_router.post("/liaison_frais_facture")
async def liaison_frais_facture(liaison: LiaisonFraisFacture):
    mysql.callproc("liaison_frais_facture",(liaison.id_facture, liaison.id_frais))



