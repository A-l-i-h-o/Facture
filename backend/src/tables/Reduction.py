from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from baseDeDonnees.MySqlDatabase import MySQLDatabase

# In-memory "database" for families
reduction_db = {}

reduction_router = APIRouter()

class Reduction(BaseModel):
    description_reduction: str
    montant_reduction : float
    pourcentage_reduction: float

class LiaisonReductionFamille(BaseModel):
    id_famille:int
    id_reduction:int

class LiaisonReductionEnfant(BaseModel):
    id_enfant:int
    id_reduction:int


# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()

@reduction_router.get("/ajout", response_model=int)
async def ajout_reduction(reduction: Reduction):
    _,_,_,id_reduction = mysql.callproc("ajout_reduction",(reduction.description_reduction, reduction.montant_reduction, reduction.pourcentage_reduction,0))
    return id_reduction


@reduction_router.post("/liaison_reduction_famille")
async def liaison_reduction_famille(liaison: LiaisonReductionFamille):
    mysql.callproc("liaison_famille_facture",(liaison.id_famille, liaison.id_reduction))


@reduction_router.post("/liaison_reduction_enfant")
async def liaison_reduction_enfant(liaison: LiaisonReductionEnfant):
    mysql.callproc("liaison_reduction_enfant",(liaison.id_enfant, liaison.id_reduction))
