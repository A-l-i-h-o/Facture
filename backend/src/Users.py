from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid

from baseDeDonnees.MySqlDatabase import MySQLDatabase

session_db = {}

user_router = APIRouter()

class Error(BaseModel):
    code: int

class UserCreate(BaseModel):
    login: str
    mdp: str
    admin: bool
    session_id: str

class UserConnect(BaseModel):
    login: str
    mdp: str

class UserConnectResponse(BaseModel):
    error: Error
    session_id: str

@user_router.post("/", response_model=Error)
async def create_user(user: UserCreate):

    user_id = str(uuid.uuid4())
    mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
    mysql.connect()
    create_user_query = """
        INSERT INTO Users (id, login, mdp, admin)
        VALUES (%s, %s, %s, %s)
    """
    mysql.execute_query(create_user_query, (user_id, user.login, user.mdp, user.admin))
    return Error(code=200)

@user_router.get("/connect", response_model=List[UserConnectResponse])
async def connect_user(user: UserConnect):
    mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
    mysql.connect()
    connect_user_query = """
        SELECT * FROM utilisateur WHERE login = %s AND mdp = %s
    """
    results = mysql.fetch_query(connect_user_query, (user.login, user.mdp))
    if not results:
        return [UserConnectResponse(error=Error(code=404), session_id="")]
    session_id = str(uuid.uuid4())
    session_db[session_id] = user.login
    return [UserConnectResponse(error=Error(code=200), session_id=session_id)]