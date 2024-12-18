
from fastapi import FastAPI
from Users import user_router
from Families import family_router
from Invoices import invoice_router

app = FastAPI()

# Include routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(family_router, prefix="/families", tags=["Families"])
app.include_router(invoice_router, prefix="/invoices", tags=["Invoices"])