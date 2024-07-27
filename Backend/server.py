import firebase_admin
from firebase_admin import db, credentials

cred = credentials.Certificate("credentials.json")
firebase_admin.initialize_app(cred, {"databaseURL": "https://headscrapers-b079a-default-rtdb.firebaseio.com/"})

ref = db.reference("/")

ref.get()