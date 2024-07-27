from dotenv import load_dotenv
import os
from datetime import datetime
from flask import Flask, request, jsonify
import pyrebase

app = Flask(__name__)

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
auth = firebase.auth()
db = firebase.database()

def get_user_id(token):
    try:
        user_info = auth.get_account_info(token)
        return user_info['users'][0]['localId']
    except:
        return None

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    try:
        user = auth.create_user_with_email_and_password(email, password)
        return jsonify({"message": "Successfully created account"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    try:
        login = auth.sign_in_with_email_and_password(email, password)
        user_info = auth.get_account_info(login['idToken'])
        return jsonify({"message": "Successfully logged in", "idToken": login['idToken'], "user_info": user_info}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    
@app.route('/assignments', methods=['POST'])
def create_assignment():
    data = request.get_json()

    auth_header = request.headers.get('Authorization')
    print(f"Authorization Header: {auth_header}")  # Log the header value

    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 400

    parts = auth_header.split(' ')

    if len(parts) != 2 or parts[0] != 'Bearer':
        return jsonify({"error": "Invalid Authorization header format"}), 400

    token = parts[1]

    try:
        # Get user_id from the token using Firebase Auth
        user = auth.get_account_info(token)
        user_id = user['users'][0]['localId'] if user and 'users' in user and len(user['users']) > 0 else None
        
        if user_id:
            assignment = {
                "title": data.get('title'),
                "type": data.get('type'),
                "due_date": data.get('due_date'),
                "open_date": data.get('open_date'),
                "status": "to do"  # or any default value you want to set
            }
            
            # Save the assignment to Firebase Realtime Database
            db.child(f'assignments/{user_id}').push(assignment)
            return jsonify({"success": True}), 201
        else:
            return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/assignments/<assignment_id>', methods=['PATCH'])
def update_assignment(assignment_id):
    data = request.get_json()
    token = request.headers.get('Authorization').split(' ')[1]
    user_id = get_user_id(token)

    if user_id:
        assignment_ref = db.child("assignments").child(user_id).child(assignment_id)
        assignment_ref.update(data)
        return jsonify({"message": "Assignment updated"}), 200
    else:
        return jsonify({"error": "Unauthorized"}), 401

@app.route('/assignments', methods=['GET'])
def get_assignments():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 401

    try:
        token = auth_header.split(' ')[1]
        user_id = get_user_id(token)
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        assignments = db.child("assignments").child(user_id).get()
        if assignments.each():
            return jsonify(assignments.val()), 200
        else:
            return jsonify({"error": "No assignments found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 400
if __name__ == '__main__':
    app.run(debug=True)
