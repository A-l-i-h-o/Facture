from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from baseDeDonnees.MySqlDatabase import MySQLDatabase

# In-memory "database" for families
reduction_db = {}

reduction_router = APIRouter()

class ReductionAvecId(BaseModel):
    id_reduction: int
    description_reduction: str
    montant_reduction : float
    pourcentage_reduction: float

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

@reduction_router.get("/", response_model=List[ReductionAvecId])
async def get_all_reductions():
    query = "SELECT * FROM reduction"
    result = mysql.fetch_query(query)
    return list(mysql.values())

@reduction_router.post("/{id_reduction}", response_model=ReductionAvecId)
async def get_reduction(id_reduction: int):
    query = "SELECT * FROM reduction WHERE id_reduction=%d"
    result = mysql.fetch_query(query,(id_reduction,))
    return mysql.values()

@reduction_router.post("/ajout", response_model=int)
async def ajout_reduction(reduction: Reduction):
    _,_,_,id_reduction = mysql.callproc("ajout_reduction",(reduction.description_reduction, reduction.montant_reduction, reduction.pourcentage_reduction,0))
    return id_reduction

@reduction_router.post("/modification", response_model=int)
async def modification_reduction(reduction: Reduction):
    _,_,_,id_reduction = mysql.callproc("modification_reduction",(reduction.description_reduction, reduction.montant_reduction, reduction.pourcentage_reduction,0))
    return id_reduction

@reduction_router.post("/liaison_reduction_famille")
async def liaison_reduction_famille(liaison: LiaisonReductionFamille):
    mysql.callproc("liaison_famille_facture",(liaison.id_famille, liaison.id_reduction))


@reduction_router.post("/liaison_reduction_enfant")
async def liaison_reduction_enfant(liaison: LiaisonReductionEnfant):
    mysql.callproc("liaison_reduction_enfant",(liaison.id_enfant, liaison.id_reduction))
