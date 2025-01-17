from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from datetime import datetime, date

from baseDeDonnees.MySqlDatabase import MySQLDatabase

frais_db = {}

frais_router = APIRouter()

class Frais(BaseModel):
    libelle_type_frais: str
    id_reduction : int
    montant_frais: float
    description_frais: str

class FraisAllInfo(BaseModel):
    description_type:str
    description_reduction:str
    montant_reduction:float
    pourcentage_reduction:float
    date_creation_frais:date
    montant_frais:float
    description_frais:str

class LiaisonFraisFacture(BaseModel):
    id_facture: int
    id_frais : int

# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()


@frais_router.get("/types_frais", response_model=List[str])
async def get_types_frais():
    query = "SELECT libelle_type_frais FROM type_frais"
    result = mysql.fetch_query(query)
    return list(mysql.values())


@frais_router.get("/{id_frais}", response_model=FraisAllInfo)
async def get_frais(id_frais:int):
    
    _,description_type,description_reduction,montant_reduction,pourcentage_reduction,date_creation_frais,montant_frais,description_frais= mysql.callproc("get_frais",(id_frais,0,0,0,0,0,0,0))

    fraisAll = FraisAllInfo()
    fraisAll.description_type = description_type
    fraisAll.description_reduction = description_reduction
    fraisAll.montant_reduction = montant_reduction
    fraisAll.pourcentage_reduction = pourcentage_reduction
    fraisAll.date_creation_frais = date_creation_frais
    fraisAll.montant_frais = montant_frais
    fraisAll.description_frais = description_frais
    
    return fraisAll


@frais_router.post("/creation", response_model=int)
async def creation_frais(frais: Frais):
    _,_,_,_,_,_,id_frais= mysql.callproc("creation_frais",(frais.libelle_type_frais, frais.id_reduction, datetime.now(), frais.montant_frais, frais.description_frais, 0))
    return id_frais


@frais_router.post("/liaison_frais_facture")
async def liaison_frais_facture(liaison: LiaisonFraisFacture):
    mysql.callproc("liaison_frais_facture",(liaison.id_facture, liaison.id_frais))



