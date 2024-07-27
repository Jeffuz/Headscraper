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


@app.route('/boards/<boardTitle>/assignments', methods=['POST'])
def create_assignment(boardTitle):
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
            
            db.child(f'boards/{user_id}/{boardTitle}/assignments').push(assignment)

            # Update the board's lastUpdated field
            db.child(f'boards/{user_id}/{boardTitle}').update({"lastUpdated": datetime.now().isoformat()})

            return jsonify({"success": True}), 201
        else:
            return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/boards/<boardTitle>/assignments', methods=['GET'])
def get_assignments(boardTitle):
    print(f"Fetching assignments for board: {boardTitle}")  # Debugging line
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 401

    try:
        token = auth_header.split(' ')[1]
        user_id = get_user_id(token)
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        # Get board_id by board title for this user
        boards = db.child(f'boards/{user_id}').order_by_child('title').equal_to(boardTitle).get()
        print(f"Boards found: {boards.val()}")  # Debugging line
        
        if not boards.each():
            return jsonify({"error": "Board not found"}), 404

        board_id = list(boards.val().keys())[0]

        # Get assignments for the specified board
        assignments = db.child(f'assignments/{user_id}/{board_id}').get()
        print(f"Assignments found: {assignments.val()}")  # Debugging line
        
        if assignments.each():
            return jsonify(assignments.val()), 200
        else:
            return jsonify({"message": "No assignments found. Please enter your first assignment."}), 404

    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging line
        return jsonify({"error": str(e)}), 400


@app.route('/boards/boardTitle/assignments', methods=['DELETE'])
def delete_assignment(boardTitle):
    data = request.get_json()
    title = data.get('title')

    if not title:
        return jsonify({"error": "Title is missing"}), 400

    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 400

    parts = auth_header.split(' ')
    if len(parts) != 2 or parts[0] != 'Bearer':
        return jsonify({"error": "Invalid Authorization header format"}), 400

    token = parts[1]

    try:
        user = auth.get_account_info(token)
        user_id = user['users'][0]['localId'] if user and 'users' in user and len(user['users']) > 0 else None

        if user_id:
            # Get all assignments for the user within the specified board
            assignments = db.child(f'boards/{user_id}/{boardTitle}/assignments').get()
            
            if not assignments.each():
                return jsonify({"error": "No assignments found"}), 404

            # Find the assignment with the specified title
            assignment_key = None
            for assignment in assignments.each():
                if assignment.val().get('title') == title:
                    assignment_key = assignment.key()
                    break

            if not assignment_key:
                return jsonify({"error": "Assignment with the specified title not found"}), 404

            # Delete the found assignment
            db.child(f'boards/{user_id}/{boardTitle}/assignments/{assignment_key}').remove()
            return jsonify({"message": "Assignment deleted"}), 200
        else:
            return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/boards/<boardTitle>/assignments/status', methods=['PUT'])
def update_assignment_status(boardTitle):
    data = request.get_json()
    title = data.get('title')
    new_status = data.get('status')

    if not title or not new_status:
        return jsonify({"error": "Title or status is missing"}), 400

    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 400

    parts = auth_header.split(' ')
    if len(parts) != 2 or parts[0] != 'Bearer':
        return jsonify({"error": "Invalid Authorization header format"}), 400

    token = parts[1]

    try:
        user = auth.get_account_info(token)
        user_id = user['users'][0]['localId'] if user and 'users' in user and len(user['users']) > 0 else None

        if user_id:
            # Get all assignments for the user within the specified board
            assignments = db.child(f'boards/{user_id}/{boardTitle}/assignments').get()
            
            if not assignments.each():
                return jsonify({"error": "No assignments found"}), 404

            # Find the assignment with the specified title
            assignment_key = None
            for assignment in assignments.each():
                if assignment.val().get('title') == title:
                    assignment_key = assignment.key()
                    break

            if not assignment_key:
                return jsonify({"error": "Assignment with the specified title not found"}), 404

            # Update the status of the found assignment
            db.child(f'boards/{user_id}/{boardTitle}/assignments/{assignment_key}').update({"status": new_status})

            # Update the board's lastUpdated field
            current_time = datetime.now().isoformat()
            db.child(f'boards/{user_id}/{boardTitle}').update({"lastUpdated": current_time})

            return jsonify({"message": "Assignment status and board lastUpdated updated"}), 200
        else:
            return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/boards', methods=['POST'])
def create_board():
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
        user = auth.get_account_info(token)
        user_id = user['users'][0]['localId'] if user and 'users' in user and len(user['users']) > 0 else None

        if user_id:
            existing_boards = db.child(f'boards/{user_id}').order_by_child('title').equal_to(data.get('title')).get()
            if existing_boards.each():
                return jsonify({"error": "A board with this title already exists"}), 409

            board = {
                "title": data.get('title'),
                "description": data.get('description'),
                "lastUpdated": datetime.now().isoformat()
            }

            db.child(f'boards/{user_id}').push(board)
            return jsonify({"success": True}), 201
        else:
            return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
