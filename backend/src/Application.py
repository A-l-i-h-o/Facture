
from fastapi import FastAPI
from app.families import family_router
from app.invoices import invoice_router



if "__main__" == __name__:
    app = FastAPI()

    # Include routers
    app.include_router(family_router, prefix="/families", tags=["Families"])
    app.include_router(invoice_router, prefix="/invoices", tags=["Invoices"])