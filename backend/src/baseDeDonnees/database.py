import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("firebaseKey.json")
firebase_admin.initialize_app(cred)