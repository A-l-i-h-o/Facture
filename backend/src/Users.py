from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid

from Logger import logger

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

class UserDeletion(BaseModel):
    login: str
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

# Helper function to verify admin status
def is_admin(session_id: str) -> bool:
    if session_id not in session_db:
        return False
    user_login = session_db[session_id]
    query = "SELECT admin FROM utilisateur WHERE login = %s"
    result = mysql.fetch_query(query, (user_login,))
    return result and result[0][0] == 1

# Helper function to verify session
def verify_session(session_id: str):
    if session_id not in session_db:
        raise HTTPException(status_code=403, detail="Invalid session")

@user_router.post("/")
async def create_user(user: UserCreate):
    verify_session(user.session_id)
    if not is_admin(user.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    check_user_query = "SELECT * FROM utilisateur WHERE login = %s"
    results = mysql.fetch_query(check_user_query, (user.login,))
    if results:
        raise HTTPException(status_code=409, detail="User already exists")
    create_user_query = """
        INSERT INTO utilisateur (login, mdp, admin)
        VALUES (%s, %s, %s)
    """
    mysql.execute_query(create_user_query, (user.login, user.mdp, user.admin))
    raise HTTPException(status_code=201, detail="User created")

@user_router.delete("/")
async def delete_user(user_del: UserDeletion):
    verify_session(user_del.session_id)
    if not is_admin(user_del.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    delete_query = "DELETE FROM utilisateur WHERE login = %s"
    mysql.execute_query(delete_query, (user_del.login,))
    raise HTTPException(status_code=200, detail="User deleted")

@user_router.post("/connect", response_model=SessionID)
async def connect_user(user: UserConnect):
    if user.login in session_db.values():
        raise HTTPException(status_code=403, detail="User already connected")
    connect_user_query = """
        SELECT * FROM utilisateur WHERE login = %s AND mdp = %s
    """
    results = mysql.fetch_query(connect_user_query, (user.login, user.mdp))
    if not results:
        raise HTTPException(status_code=404, detail="User not found")
    session_id = str(uuid.uuid4())
    session_db[session_id] = user.login
    return SessionID(session_id=session_id)

@user_router.post("/disconnect")
async def disconnect_user(session_id: SessionID):
    verify_session(session_id.session_id)
    del session_db[session_id.session_id]
    raise HTTPException(status_code=200, detail="User disconnected")

@user_router.put("/modify")
async def modify_user(user_mod: UserModification):
    verify_session(user_mod.session_id)
    user_login = session_db[user_mod.session_id]
    update_query = "UPDATE utilisateur SET "
    params = []
    if user_mod.new_mdp:
        update_query += "mdp = %s "
        params.append(user_mod.new_mdp)
    if user_mod.login:
        if params:
            update_query += ", "
        update_query += "login = %s "
        params.append(user_mod.login)
    update_query += "WHERE login = %s"
    params.append(user_login)
    mysql.execute_query(update_query, tuple(params))
    raise HTTPException(status_code=200, detail="User modified")

@user_router.put("/modify-admin")
async def modify_user_admin(user_mod: UserModification):
    verify_session(user_mod.session_id)
    if not is_admin(user_mod.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    update_query = "UPDATE utilisateur SET "
    params = []
    if user_mod.new_mdp:
        update_query += "mdp = %s "
        params.append(user_mod.new_mdp)
    if user_mod.login:
        if params:
            update_query += ", "
        update_query += "login = %s "
        params.append(user_mod.login)
    update_query += "WHERE login = %s"
    params.append(user_mod.login)
    mysql.execute_query(update_query, tuple(params))
    raise HTTPException(status_code=200, detail="User modified")

@user_router.get("/", response_model=List[User])
async def get_users(user_admin_get: UserGetter):
    verify_session(user_admin_get.session_id)
    if not is_admin(user_admin_get.session_id):
        query = "SELECT * FROM utilisateur WHERE login = %s"
    else:
        query = "SELECT * FROM utilisateur"
    results = mysql.fetch_query(query)
    ret = []
    for result in results:
        ret.append(User(mdp=result[1], login=result[2], admin=result[3]))
    return ret
