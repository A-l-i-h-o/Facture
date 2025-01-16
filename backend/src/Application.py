
from fastapi import FastAPI
from Users import user_router
from Families import family_router
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
app.include_router(family_router, prefix="/families", tags=["Families"])
app.include_router(invoice_router, prefix="/invoices", tags=["Invoices"])