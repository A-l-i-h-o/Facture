
from fastapi import FastAPI
from Users import user_router
from Parents import parent_router
from Childrens import child_router
from Discounts import discount_router
from Invoices import invoice_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:4200",  # Permet les requêtes depuis localhost:4200
]

# Ajoutez le middleware CORS pour autoriser les origines spécifiées
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Autorise les origines que vous avez spécifiées
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les headers
)

# Include routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(parent_router, prefix="/parents", tags=["Parents"])
app.include_router(child_router, prefix="/children", tags=["Children"])
app.include_router(discount_router, prefix="/discounts", tags=["Discounts"])
app.include_router(invoice_router, prefix="/invoices", tags=["Invoices"])