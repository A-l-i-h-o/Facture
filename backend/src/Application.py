
from fastapi import FastAPI
from Users import user_router
from Parents import parent_router
from Childrens import child_router
from Discounts import discount_router
from Invoices import invoice_router

app = FastAPI()

# Include routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(parent_router, prefix="/parents", tags=["Parents"])
app.include_router(child_router, prefix="/children", tags=["Children"])
app.include_router(discount_router, prefix="/discounts", tags=["Discounts"])
app.include_router(invoice_router, prefix="/invoices", tags=["Invoices"])