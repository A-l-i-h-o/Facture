from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid

# In-memory "database" for invoices
invoices_db = {}
# Reference to the families_db from families.py
from families import families_db

invoice_router = APIRouter()

class Invoice(BaseModel):
    id: str
    family_id: str
    amount: float
    description: Optional[str] = None  # Allow description to be None
    price_paid: float = 0.0  # Default price paid is 0.0


class InvoiceCreate(BaseModel):
    family_id: str
    amount: float
    description: Optional[str] = None  # Allow description to be None
    price_paid: float = 0.0  # Default price paid is 0.0


class InvoiceUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    price_paid: Optional[float] = None


@invoice_router.post("/", response_model=Invoice)
async def create_invoice(invoice: InvoiceCreate):
    if invoice.family_id not in families_db:
        raise HTTPException(status_code=404, detail="Family not found")
    invoice_id = str(uuid.uuid4())
    new_invoice = Invoice(id=invoice_id, **invoice.dict())
    invoices_db[invoice_id] = new_invoice
    return new_invoice


@invoice_router.get("/", response_model=List[Invoice])
async def get_all_invoices():
    return list(invoices_db.values())

@invoice_router.get("/family/{family_id}", response_model=List[Invoice])
async def get_family_invoices(family_id: str):
    return [invoice for invoice in invoices_db.values() if invoice.family_id == family_id]


@invoice_router.get("/{invoice_id}", response_model=Invoice)
async def get_invoice(invoice_id: str):
    invoice = invoices_db.get(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@invoice_router.put("/{invoice_id}", response_model=Invoice)
async def update_invoice(invoice_id: str, invoice_update: InvoiceUpdate):
    invoice = invoices_db.get(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    updated_invoice_data = invoice.dict()
    for key, value in invoice_update.dict(exclude_unset=True).items():
        updated_invoice_data[key] = value
    updated_invoice = Invoice(**updated_invoice_data)
    invoices_db[invoice_id] = updated_invoice
    return updated_invoice


@invoice_router.delete("/{invoice_id}", response_model=Invoice)
async def delete_invoice(invoice_id: str):
    invoice = invoices_db.pop(invoice_id, None)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice
