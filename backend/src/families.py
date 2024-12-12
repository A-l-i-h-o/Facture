from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid

# In-memory "database" for families
families_db = {}

family_router = APIRouter()

class Family(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None  # Allow phone to be None


class FamilyCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None  # Allow phone to be None


@family_router.post("/", response_model=Family)
async def create_family(family: FamilyCreate):
    family_id = str(uuid.uuid4())
    new_family = Family(id=family_id, **family.dict())
    families_db[family_id] = new_family
    return new_family


@family_router.get("/", response_model=List[Family])
async def get_all_families():
    return list(families_db.values())


@family_router.get("/{family_id}", response_model=Family)
async def get_family(family_id: str):
    family = families_db.get(family_id)
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family


@family_router.put("/{family_id}", response_model=Family)
async def update_family(family_id: str, family_update: FamilyCreate):
    family = families_db.get(family_id)
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    updated_family_data = family.dict()
    updated_family_data.update(family_update.dict(exclude_unset=True))
    updated_family = Family(**updated_family_data)
    families_db[family_id] = updated_family
    return updated_family


@family_router.delete("/{family_id}", response_model=Family)
async def delete_family(family_id: str):
    family = families_db.pop(family_id, None)
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family
