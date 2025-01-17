from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from baseDeDonnees.MySqlDatabase import MySQLDatabase

session_db = {}

user_router = APIRouter()

class User(BaseModel):
    login: str
    mdp: str
    admin: bool

class SessionID(BaseModel):
    session_id: str

class UserCreate(BaseModel):
    login: str
    mdp: str
    admin: bool
    session_id: str

class UserConnect(BaseModel):
    login: str
    mdp: str

class UserModification(BaseModel):
    session_id: str
    login: Optional[str] = None
    mdp: Optional[str] = None
    new_mdp: Optional[str] = None

class UserGetter(BaseModel):
    session_id: str

# Database initialization
mysql = MySQLDatabase(host="localhost", user="root", password="", database="Facture")
mysql.connect()

# Helper function to verify session
def verify_session(session_id: str):
    if session_id not in session_db:
        raise HTTPException(status_code=403, detail="Invalid session")

@user_router.post("/create")
async def create_user(user: UserCreate):
    verify_session(user.session_id)
    if not session_db[user.login][1]:
        raise HTTPException(status_code=403, detail="Admin privileges required")

    _,_,id_user = mysql.callproc("creation_utilisateur",(user.login, user.mdp,0))
    session_db[user.login] = [id_user,user.admin]


    
@user_router.post("/connect", response_model=SessionID)
async def connect_user(user: UserConnect):
    
    if user.login in session_db.keys():
        return SessionID(session_id=session_db[user.login][0])
    _,_,v_connexion, v_id_user, v_admin= mysql.callproc("connexion",(user.login, user.mdp,0,0,0))
    if not v_connexion:
        raise HTTPException(status_code=404, detail="User not found")
    
    session_db[user.login] = [v_id_user,v_admin]
    return SessionID(session_id=v_id_user)



@user_router.post("/disconnect")
async def disconnect_user(session_id: SessionID):
    verify_session(session_id.session_id)
    del session_db[session_id.session_id]
    raise HTTPException(status_code=200, detail="User disconnected")



@user_router.post("/modify")
async def modify_user(user_mod: UserModification):
    verify_session(user_mod.session_id)
    if not session_db[user.login][1]:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    
    mysql.callproc("modification_utilisateur",(user.login, user.mdp, user.new_mdp, 0))
    raise HTTPException(status_code=200, detail="User modified")

