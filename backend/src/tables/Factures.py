from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from baseDeDonnees.MySqlDatabase import MySQLDatabase

from datetime import date

facture_db = {}

facture_router = APIRouter()


class Facture(BaseModel):
    libelle_periode:str
    id_reduction:int
    libelle_etat_paiement:str
    description_facture:str
    creancier:str
    debiteur:str
    date_creation_facture:date
    date_paiment_total_facture:date
    date_echeance_facture:date


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


