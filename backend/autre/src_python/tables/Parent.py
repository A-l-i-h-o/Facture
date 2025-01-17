from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from baseDeDonnees.MySqlDatabase import MySQLDatabase

parent_db = {}

parent_router = APIRouter()

class ParentAvecIdFamille(BaseModel):
    id_parent: int
    id_famille: int
    libelle_statut_parent : str
    nom: str
    prenom: str
    adresse_parent: str
    adresse_email_parent : str

# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()


@parent_router.post("/{id_parent}", response_model=ParentAvecIdFamille)
async def recuperation_parent(id_parent: int):
    
    _,id_famille,libelle_statut_parent,nom_parent,prenom_parent,adresse_parent,adresse_email_parent = mysql.callproc(
        "get_parent",(id_parent,0,0,0,0,0,0)
    )

    parent = ParentAvecIdFamille()
    parent.id_parent = id_parent
    parent.id_famille=id_famille
    parent.libelle_statut_parent=libelle_statut_parent
    parent.nom=nom
    parent.prenom=prenom
    parent.adresse_parent=adresse_parent
    parent.adresse_email_parent=adresse_email_parent
    return parent


@parent_router.post("/create", response_model=int)
async def create_parent(parent: ParentAvecIdFamille):
    _,_,_,_,_,_,id_parent= mysql.callproc("create_parent",(parent.id_famille, parent.libelle_statut_parent, parent.nom, parent.prenom, parent.adresse_parent, parent.adresse_email_parent, 0))
    return id_parent

@parent_router.post("/modification")
async def modification_parent(parent: ParentAvecIdFamille):
    
    mysql.callproc("create_parent",(parent.id_famille, parent.libelle_statut_parent, parent.nom, parent.prenom, parent.adresse_parent, parent.adresse_email_parent))
