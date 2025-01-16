import httpx

with httpx.AsyncClient() as client:

    response = await client.get(
        "http://localhost:4200/type_paiement",
        params=
    )
        response.raise_for_status()  # Raise an exception for 4xx/5xx responses
        return response.json()  # Retourne la réponse JSON
