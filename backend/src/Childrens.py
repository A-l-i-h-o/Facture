from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from Logger import logger

from baseDeDonnees.MySqlDatabase import MySQLDatabase

from Users import session_db

child_router = APIRouter()

class Child(BaseModel):
    first_name: str
    last_name: str
    birth_date: str
    id_famille: int

class ChildCreate(BaseModel):
    first_name: str
    last_name: str
    birth_date: str
    id_famille: int
    session_id: str

class ChildDeletion(BaseModel):
    child_id: int
    session_id: str

class ChildModification(BaseModel):
    child_id: int
    session_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birth_date: Optional[str] = None

class ChildGetter(BaseModel):
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

@child_router.post("/")
async def create_child(child: ChildCreate):
    verify_session(child.session_id)
    if not is_admin(child.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    # Check if id_famille exists
    check_family_query = "SELECT * FROM famille WHERE id_famille = %s"
    family_results = mysql.fetch_query(check_family_query, (child.id_famille,))
    if not family_results:
        raise HTTPException(status_code=404, detail="Family not found")

    # Create child entry
    create_child_query = """
        INSERT INTO enfant (prenom_enfant, nom_enfant, date_naissance_enfant, id_famille)
        VALUES (%s, %s, %s, %s)
    """
    mysql.execute_query(create_child_query, (child.first_name, child.last_name, child.birth_date, child.id_famille))

    # Retrieve the last inserted child ID
    last_child_id_query = "SELECT LAST_INSERT_ID() as id_enfant"
    child_result = mysql.fetch_query(last_child_id_query)
    id_enfant = child_result[0][0]

    # Link the child to the family in liste_enfant
    create_liste_enfant_query = """
        INSERT INTO liste_enfant (id_enfant, id_famille)
        VALUES (%s, %s)
    """
    mysql.execute_query(create_liste_enfant_query, (id_enfant, child.id_famille))

    raise HTTPException(status_code=201, detail="Child created and linked to family")

@child_router.delete("/")
async def delete_child(child_del: ChildDeletion):
    verify_session(child_del.session_id)
    if not is_admin(child_del.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    # Delete child entry from liste_enfant
    delete_liste_query = "DELETE FROM liste_enfant WHERE id_enfant = %s"
    mysql.execute_query(delete_liste_query, (child_del.child_id,))

    # Delete child entry
    delete_query = "DELETE FROM enfant WHERE id_enfant = %s"
    mysql.execute_query(delete_query, (child_del.child_id,))

    raise HTTPException(status_code=200, detail="Child deleted")

@child_router.put("/modify")
async def modify_child(child_mod: ChildModification):
    verify_session(child_mod.session_id)
    if not is_admin(child_mod.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    # Update child entry
    update_query = "UPDATE enfant SET "
    params = []

    if child_mod.first_name:
        update_query += "prenom_enfant = %s, "
        params.append(child_mod.first_name)
    if child_mod.last_name:
        update_query += "nom_enfant = %s, "
        params.append(child_mod.last_name)
    if child_mod.birth_date:
        update_query += "date_naissance_enfant = %s, "
        params.append(child_mod.birth_date)

    update_query = update_query.rstrip(", ")  # Remove trailing comma
    update_query += " WHERE id_enfant = %s"
    params.append(child_mod.child_id)

    mysql.execute_query(update_query, tuple(params))

    raise HTTPException(status_code=200, detail="Child modified")

@child_router.get("/", response_model=List[Child])
async def get_children(child_get: ChildGetter):
    verify_session(child_get.session_id)
    if not is_admin(child_get.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    query = "SELECT prenom_enfant, nom_enfant, date_naissance_enfant, id_famille FROM enfant"
    results = mysql.fetch_query(query)

    ret = []
    for result in results:
        ret.append(Child(
            first_name=result[0],
            last_name=result[1],
            birth_date=result[2],
            id_famille=result[3]
        ))

    return ret
