from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from Logger import logger
from baseDeDonnees.MySqlDatabase import MySQLDatabase
from Users import session_db

discount_router = APIRouter()

class Discount(BaseModel):
    id_reduction: int
    description_reduction: str
    montant_reduction: float
    pourcentage_reduction: float

class DiscountCreate(BaseModel):
    description_reduction: str
    montant_reduction: float
    pourcentage_reduction: float

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

@discount_router.post("/create-discount")
async def create_discount(discount: DiscountCreate, session_id: str):
    verify_session(session_id)
    if not is_admin(session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    create_discount_query = """
        INSERT INTO reduction (description_reduction, montant_reduction, pourcentage_reduction)
        VALUES (%s, %s, %s)
    """
    mysql.execute_query(create_discount_query, (
        discount.description_reduction,
        discount.montant_reduction,
        discount.pourcentage_reduction
    ))

    raise HTTPException(status_code=201, detail="Discount created")

@discount_router.get("/get-discounts", response_model=List[Discount])
async def get_discounts(session_id: str):
    verify_session(session_id)

    query = "SELECT * FROM reduction"
    results = mysql.fetch_query(query)
    ret = []
    for result in results:
        ret.append(Discount(
            id_reduction=result[0],
            description_reduction=result[1],
            montant_reduction=result[2],
            pourcentage_reduction=result[3]
        ))
    return ret

@discount_router.put("/update-discount/{id_reduction}")
async def update_discount(id_reduction: int, discount: DiscountCreate, session_id: str):
    verify_session(session_id)
    if not is_admin(session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    update_discount_query = """
        UPDATE reduction
        SET description_reduction = %s, montant_reduction = %s, pourcentage_reduction = %s
        WHERE id_reduction = %s
    """
    mysql.execute_query(update_discount_query, (
        discount.description_reduction,
        discount.montant_reduction,
        discount.pourcentage_reduction,
        id_reduction
    ))

    raise HTTPException(status_code=200, detail="Discount updated")

@discount_router.delete("/delete-discount/{id_reduction}")
async def delete_discount(id_reduction: int, session_id: str):
    verify_session(session_id)
    if not is_admin(session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    delete_discount_query = "DELETE FROM reduction WHERE id_reduction = %s"
    mysql.execute_query(delete_discount_query, (id_reduction,))

    raise HTTPException(status_code=200, detail="Discount deleted")
