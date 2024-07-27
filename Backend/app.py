from dotenv import load_dotenv
import os
import pyrebase

# Load environment variables from the .env file
load_dotenv()

config = {
    "apiKey": os.getenv('API_KEY'),
    "authDomain": os.getenv('FIREBASE_AUTH_DOMAIN'),
    "databaseURL": os.getenv('FIREBASE_DATABASE_URL'),
    "projectId": os.getenv('FIREBASE_PROJECT_ID'),
    "storageBucket": os.getenv('FIREBASE_STORAGE_BUCKET'),
    "messagingSenderId": os.getenv('FIREBASE_MESSAGING_SENDER_ID'),
    "appId": os.getenv('FIREBASE_APP_ID'),
    "measurementId": os.getenv('FIREBASE_MEASUREMENT_ID')
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()
auth = firebase.auth()

# Example of getting data from the Realtime Database
data = db.child("some_node").get()
print(data.val())

def signup():
    email = input("enter email: ")
    password = input("enter password: ")
    user = auth.create_user_with_email_and_password(email, password)
    print("Successfully created account")

signup()


# # Create a reference to the root of the database
# db = firebase.database()

# # Print initial data from Firebase Realtime Database
# data = db.child("some_node").get()
# print(data.val())

# app = Flask(__name__)

# # Define Flask routes
# @app.route('/')
# def home():
#     return 'index.html'

# @app.route('/login')
# def login():
#     return 'Login Page'

# @app.route('/register')
# def register():
#     return 'Register Page'

# @app.route('/members')
# def members():
#     return {"members": ["Member1", "Member2", "Member3"]}

# if __name__ == "__main__":
#     app.run(debug=True)