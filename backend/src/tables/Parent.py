from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from baseDeDonnees.MySqlDatabase import MySQLDatabase

parent_db = {}

parent_router = APIRouter()

class Parent(BaseModel):
    id_famille: int
    libelle_statut_parent : str
    nom: str
    prenom: str
    adresse_parent: str
    adresse_email_parent : str

# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()


@enfant_router.post("/{id_parent}", response_model=Parent)
async def recuperation_parent(id_parent: int):
    query = "SELECT * FROM parent WHERE id_parent=%q"
    result = mysql.fetch_query(query)
    return mysql.values()


@parent_router.post("/create", response_model=int)
async def recuperation_id_parent(parent: Parent):
    _,_,_,_,_,_,id_parent= mysql.callproc("recuperation_id_parent",(parent.id_famille, parent.libelle_statut_parent, parent.nom, parent.prenom, parent.adresse_parent, parent.adresse_email_parent, 0))
    return id_parent
