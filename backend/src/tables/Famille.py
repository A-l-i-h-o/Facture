from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from baseDeDonnees.MySqlDatabase import MySQLDatabase

# In-memory "database" for families
famille_db = {}

famille_router = APIRouter()

class LiaisonFamilleFacture(BaseModel):
    id_facture: int
    id_famille : int


# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()


@famille_router.get("/all", response_model=List[int])
async def get_all_familles():
    query = "SELECT id_famille FROM famille"
    result = mysql.fetch_query(query, (user_login,))
    return list(mysql.values())


@famille_router.get("/famille", response_model=int)
async def get_family(user_id: int):
    _,id_famille = mysql.callproc("creation_utilisateur",(user_id,0))
    return id_famille


@famille_router.post("/liaison_famille_facture")
async def liaison_famille_facture(liaison: LiaisonFamilleFacture):
    mysql.callproc("liaison_famille_facture",(liaison.id_famille, liaison.id_facture))

