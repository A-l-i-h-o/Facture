from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from Logger import logger
from baseDeDonnees.MySqlDatabase import MySQLDatabase
from Users import session_db

invoice_router = APIRouter()

class Invoice(BaseModel):
    id_facture: int
    id_periode: int
    id_etat_paiement: int
    description_facture: str
    creancier: str
    debiteur: str
    date_creation_facture: str
    date_paiment_total_facture: Optional[str] = None
    date_echeance_facture: str

class InvoiceCreate(BaseModel):
    id_periode: Optional[int] = None
    id_etat_paiement: int
    description_facture: str
    creancier: str
    debiteur: str
    date_creation_facture: str
    date_echeance_facture: str
    id_reduction: Optional[int] = None
    libelle_periode: Optional[str] = None
    id_famille: Optional[int] = None
    session_id: str

class Period(BaseModel):
    id_reduction: int
    libelle_periode: str

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

@invoice_router.post("/create-invoice")
async def create_invoice(invoice: InvoiceCreate):
    verify_session(invoice.session_id)
    if not is_admin(invoice.session_id):
        raise HTTPException(status_code=403, detail="Admin privileges required")

    # Create period if necessary
    if invoice.id_periode is None and invoice.id_reduction is not None and invoice.libelle_periode is not None:
        create_period_query = """
            INSERT INTO periode (id_reduction, libelle_periode)
            VALUES (%s, %s)
        """
        mysql.execute_query(create_period_query, (
            invoice.id_reduction,
            invoice.libelle_periode
        ))

        # Retrieve the last inserted period ID
        last_period_id_query = "SELECT LAST_INSERT_ID() as id_periode"
        period_result = mysql.fetch_query(last_period_id_query)
        invoice.id_periode = period_result[0][0]

    if invoice.id_periode is None:
        raise HTTPException(status_code=400, detail="Period information is missing")

    # Create invoice
    create_invoice_query = """
        INSERT INTO facture (
            id_periode, id_etat_paiement, description_facture, creancier, debiteur, 
            date_creation_facture, date_echeance_facture
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    mysql.execute_query(create_invoice_query, (
        invoice.id_periode,
        invoice.id_etat_paiement,
        invoice.description_facture,
        invoice.creancier,
        invoice.debiteur,
        invoice.date_creation_facture,
        invoice.date_echeance_facture
    ))

    # Retrieve the last inserted invoice ID
    last_invoice_id_query = "SELECT LAST_INSERT_ID() as id_facture"
    invoice_result = mysql.fetch_query(last_invoice_id_query)
    id_facture = invoice_result[0][0]

    # Link invoice to family if provided
    if invoice.id_famille is not None:
        link_invoice_query = """
            INSERT INTO historique_facture (id_facture, id_famille)
            VALUES (%s, %s)
        """
        mysql.execute_query(link_invoice_query, (
            id_facture,
            invoice.id_famille
        ))

    raise HTTPException(status_code=201, detail="Invoice created and linked")

@invoice_router.get("/get-invoices", response_model=List[Invoice])
async def get_invoices(session_id: str):
    verify_session(session_id)

    query = "SELECT * FROM facture"
    results = mysql.fetch_query(query)
    ret = []
    for result in results:
        ret.append(Invoice(
            id_facture=result[0],
            id_periode=result[1],
            id_etat_paiement=result[2],
            description_facture=result[3],
            creancier=result[4],
            debiteur=result[5],
            date_creation_facture=result[6],
            date_paiment_total_facture=result[7],
            date_echeance_facture=result[8]
        ))
    return ret

@invoice_router.get("/get-periods", response_model=List[Period])
async def get_periods(session_id: str):
    verify_session(session_id)

    query = "SELECT * FROM periode"
    results = mysql.fetch_query(query)
    ret = []
    for result in results:
        ret.append(Period(
            id_reduction=result[1],
            libelle_periode=result[2]
        ))
    return ret
