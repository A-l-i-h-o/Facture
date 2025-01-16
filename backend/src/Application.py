
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from tables.Enfant import enfant_router
from tables.Factures import facture_router
from tables.Famille import famille_router
from tables.Frais import frais_router
from tables.Paiement import paiement_router
from tables.Parent import parent_router
from tables.Reduction import reduction_router
from tables.Users import user_router

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
app.include_router(enfant_router, prefix="/enfant", tags=["Enfant"])
app.include_router(facture_router, prefix="/facture", tags=["Facture"])
app.include_router(famille_router, prefix="/famille", tags=["Famille"])
app.include_router(frais_router, prefix="/frais", tags=["Frais"])
app.include_router(paiement_router, prefix="/paiement", tags=["Paiement"])
app.include_router(parent_router, prefix="/parent", tags=["Parent"])
app.include_router(reduction_router, prefix="/reduction", tags=["Reduction"])
app.include_router(user_router, prefix="/users", tags=["Users"])
