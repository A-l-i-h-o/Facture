from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from Logger import logger

from baseDeDonnees.MySqlDatabase import MySQLDatabase

from Users import session_db

parent_router = APIRouter()

class Parent(BaseModel):
    first_name: str
    last_name: str
    address: str
    email: str
    id_statut_parent: int

class ParentCreate(BaseModel):
    first_name: str
    last_name: str
    address: str
    email: str
    id_statut_parent: int
    id_famille: int
    session_id: str

class ParentDeletion(BaseModel):
    parent_id: int
    session_id: str

class ParentModification(BaseModel):
    parent_id: int
    session_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None

class ParentGetter(BaseModel):
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

@parent_router.post("/")
async def create_parent(parent: ParentCreate):
    verify_session(parent.session_id)
    if not is_admin(parent.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    # Check if id_statut_parent exists
    check_statut_query = "SELECT * FROM statut_parent WHERE id_statut_parent = %s"
    results = mysql.fetch_query(check_statut_query, (parent.id_statut_parent,))
    if not results:
        raise HTTPException(status_code=404, detail="Parent status not found")

    # Check if id_famille exists
    check_family_query = "SELECT * FROM famille WHERE id_famille = %s"
    family_results = mysql.fetch_query(check_family_query, (parent.id_famille,))
    if not family_results:
        raise HTTPException(status_code=404, detail="Family not found")

    # Create parent entry
    create_parent_query = """
        INSERT INTO parent (id_statut_parent, nom_parent, prenom_parent, adresse_parent, adresse_email_parent)
        VALUES (%s, %s, %s, %s, %s)
    """
    mysql.execute_query(create_parent_query, (parent.id_statut_parent, parent.last_name, parent.first_name, parent.address, parent.email))

    # Retrieve the last inserted parent ID
    last_parent_id_query = "SELECT LAST_INSERT_ID() as id_parent"
    parent_result = mysql.fetch_query(last_parent_id_query)
    id_parent = parent_result[0][0]

    # Link the parent to the family
    link_parent_family_query = """
        INSERT INTO liste_parent (id_parent, id_famille)
        VALUES (%s, %s)
    """
    mysql.execute_query(link_parent_family_query, (id_parent, parent.id_famille))

    raise HTTPException(status_code=201, detail="Parent created and linked to family")

@parent_router.delete("/")
async def delete_parent(parent_del: ParentDeletion):
    verify_session(parent_del.session_id)
    if not is_admin(parent_del.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    # Delete parent entry
    delete_query = "DELETE FROM parent WHERE id_parent = %s"
    mysql.execute_query(delete_query, (parent_del.parent_id,))

    raise HTTPException(status_code=200, detail="Parent deleted")

@parent_router.put("/modify")
async def modify_parent(parent_mod: ParentModification):
    verify_session(parent_mod.session_id)
    if not is_admin(parent_mod.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    # Update parent entry
    update_query = "UPDATE parent SET "
    params = []

    if parent_mod.first_name:
        update_query += "prenom_parent = %s, "
        params.append(parent_mod.first_name)
    if parent_mod.last_name:
        update_query += "nom_parent = %s, "
        params.append(parent_mod.last_name)
    if parent_mod.address:
        update_query += "adresse_parent = %s, "
        params.append(parent_mod.address)
    if parent_mod.email:
        update_query += "adresse_email_parent = %s, "
        params.append(parent_mod.email)

    update_query = update_query.rstrip(", ")  # Remove trailing comma
    update_query += " WHERE id_parent = %s"
    params.append(parent_mod.parent_id)

    mysql.execute_query(update_query, tuple(params))

    raise HTTPException(status_code=200, detail="Parent modified")

@parent_router.get("/", response_model=List[Parent])
async def get_parents(parent_get: ParentGetter):
    verify_session(parent_get.session_id)
    if not is_admin(parent_get.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    query = "SELECT id_statut_parent, prenom_parent, nom_parent, adresse_parent, adresse_email_parent FROM parent"
    results = mysql.fetch_query(query)

    ret = []
    for result in results:
        ret.append(Parent(
            id_statut_parent=result[0],
            first_name=result[1],
            last_name=result[2],
            address=result[3],
            email=result[4]
        ))

    return ret
