import httpx
from pydantic import BaseModel
from typing import List, Optional
import asyncio

# Modèles Pydantic
class User(BaseModel):
    login: str
    mdp: str
    admin: bool

class SessionID(BaseModel):
    session_id: str

class UserCreate(BaseModel):
    login: str
    mdp: str
    admin: bool

class UserConnect(BaseModel):
    login: str
    mdp: str

class UserModification(BaseModel):
    session_id: str
    login: Optional[str] = None
    mdp: Optional[str] = None
    new_mdp: Optional[str] = None

class UserGetter(BaseModel):
    session_id: str

# Fonction pour effectuer la requête
async def requeteGet(url: str, identite:int):
    async with httpx.AsyncClient() as client:
        print(f"http://localhost:9392/{url}/{identite}")
        response = await client.get(f"http://localhost:9392/{url}/{identite}")
        return response.json()  # Retourne la réponse JSON

    
# Fonction pour effectuer la requête
async def requetePost(url: str, param: dict):
    async with httpx.AsyncClient() as client:
        print(f"http://localhost:9392/{url}")
        response = await client.post(f"http://localhost:9392/{url}", json=param)
        return response.json()  # Retourne la réponse JSON


# Crée une instance de UserConnect
user_admin = UserConnect(login="admin", mdp="admin")

user_root = UserCreate(login="root", mdp="root", admin=False)


async def main():
    
    id_utilisateur_admin = (await requetePost("users/connect", user_admin.dict()))["session_id"]
    print("id_utilisateur_admin",id_utilisateur_admin)
    
    id_user_root = (await requetePost("users/create", user_root.dict()))
    print("id_user_root",id_user_root)
    

    id_famille = (await requetePost("famille/creation", {"user_id":id_user_root}))
    print("id_famille",id_famille)

    
    
    

# Exécution du code asynchrone
if __name__ == "__main__":
    asyncio.run(main())
