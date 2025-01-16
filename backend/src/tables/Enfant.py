from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from baseDeDonnees.MySqlDatabase import MySQLDatabase

enfant_db = {}

enfant_router = APIRouter()

class Enfant(BaseModel):
    id_famille: int
    nom: str
    prenom: str
    age: int


# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()



@enfant_router.post("/", response_model=int)
async def recuperation_enfant(enfant: Enfant):
    _,_,_,id_enfant= mysql.callproc("recuperation_id_enfant",(enfant.id_famille, enfant.nom, enfant.prenom, enfant.age, 0))
    return id_enfant
