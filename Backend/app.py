from dotenv import load_dotenv
import os
from datetime import datetime
from flask import Flask, request, jsonify
import pyrebase
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

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
# http://localhost:5000/signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    try:
        user = auth.create_user_with_email_and_password(email, password)
        return jsonify({"message": "Successfully created account"}), 201
    except Exception as e:
        error_message = str(e)
        if "WEAK_PASSWORD" in error_message:
            error_message = "Password should be at least 6 characters."
        elif "EMAIL_EXISTS" in error_message:
            error_message = "The email address is already in use by another account."
        return jsonify({"error": error_message}), 400
    
# http://localhost:5000/boards
@app.route('/boards', methods=['GET'])
def get_boards():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 401

    parts = auth_header.split(' ')
    if len(parts) != 2 or parts[0] != 'Bearer':
        return jsonify({"error": "Invalid Authorization header format"}), 400

    token = parts[1]

    try:
        user_id = get_user_id(token)
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        boards_ref = db.child(f'boards/{user_id}')
        boards = boards_ref.get()

        if boards.each():
            return jsonify(boards.val()), 200
        else:
            return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# http://localhost:5000/login
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
        error_message = str(e)
        if "EMAIL_NOT_FOUND" in error_message:
            error_message = "The email address is not registered."
        elif "INVALID_PASSWORD" in error_message:
            error_message = "The password is incorrect."
        else:
            error_message = "An error occurred. Please try again."
        return jsonify({"error": error_message}), 400

# http://localhost:5000/boards/<board_id>/assignments
@app.route('/boards/<board_id>/assignments', methods=['POST'])
def create_assignment(board_id):
    data = request.get_json()

    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 401

    parts = auth_header.split(' ')
    if len(parts) != 2 or parts[0] != 'Bearer':
        return jsonify({"error": "Invalid Authorization header format"}), 400

    token = parts[1]

    try:
        user = auth.get_account_info(token)
        user_id = user['users'][0]['localId'] if user and 'users' in user and len(user['users']) > 0 else None

        if user_id:
            board = db.child(f'boards/{user_id}/{board_id}').get()
            if not board.val():
                return jsonify({"error": "Board not found"}), 404

            assignment = {
                "title": data.get('title'),
                "type": data.get('type'),
                "due_date": data.get('due_date'),
                "open_date": data.get('open_date'),
                "status": "to do"
            }

            db.child(f'boards/{user_id}/{board_id}/assignments').push(assignment)
            return jsonify({"success": True}), 201
        else:
            return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400



# http://localhost:5000/boards/<board_id>/assignments
@app.route('/boards/<board_id>/assignments', methods=['GET'])
def get_assignments(board_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 401

    parts = auth_header.split(' ')
    if len(parts) != 2 or parts[0] != 'Bearer':
        return jsonify({"error": "Invalid Authorization header format"}), 400

    token = parts[1]

    try:
        user_id = get_user_id(token)
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        board = db.child(f'boards/{user_id}/{board_id}').get()
        if not board.val():
            return jsonify({"error": "Board not found"}), 404

        assignments_ref = db.child(f'boards/{user_id}/{board_id}/assignments')
        assignments = assignments_ref.get()

        if assignments.each():
            return jsonify(assignments.val()), 200
        else:
            return jsonify({"message": "No assignments found. Please enter your first assignment."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# http://localhost:5000/boards/<board_id>/assignments
@app.route('/boards/<board_id>/assignments', methods=['DELETE'])
def delete_assignment(board_id):
    data = request.get_json()
    title = data.get('title')

    # Debugging print statements
    print(f"Received request to delete assignment with title: {title} from board: {board_id}")

    auth_header = request.headers.get('Authorization')
    print(f"Authorization Header: {auth_header}")  # Log the header value

    if not auth_header:
        print("Authorization header is missing")  # Debugging line
        return jsonify({"error": "Authorization header is missing"}), 401

    parts = auth_header.split(' ')
    if len(parts) != 2 or parts[0] != 'Bearer':
        print("Invalid Authorization header format")  # Debugging line
        return jsonify({"error": "Invalid Authorization header format"}), 400

    token = parts[1]

    try:
        user = auth.get_account_info(token)
        print(f"User Info: {user}")  # Debugging line
        user_id = user['users'][0]['localId'] if user and 'users' in user and len(user['users']) > 0 else None

        if user_id:
            print(f"User ID: {user_id}")  # Debugging line
            assignments_ref = db.child(f'boards/{user_id}/{board_id}/assignments')
            print("line 160 passed")
            assignments = assignments_ref.order_by_child('title').equal_to(title).get()
            print("line 161 passed")
            print(f"Assignments found: {assignments.val()}")  # Debugging line

            if assignments.each():
                for assignment in assignments.each():
                    print(f"Deleting assignment with key: {assignment.key()}")  # Debugging line
                    db.child(f'boards/{user_id}/{board_id}/assignments/{assignment.key()}').remove()
                return jsonify({"message": "Assignment(s) deleted"}), 200
            else:
                print("No assignments found with the given title")  # Debugging line
                return jsonify({"error": "No assignments found with the given title"}), 404
        else:
            print("Invalid token")  # Debugging line
            return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging line
        return jsonify({"error": str(e)}), 400


# http://localhost:5000/boards/<board_id>/assignments/<assignment_id/status
@app.route('/boards/<board_id>/assignments/<assignment_id>/status', methods=['PUT'])
def update_assignment_status(board_id, assignment_id):
    try:
        data = request.get_json()
        new_status = data.get('status')

        if not new_status:
            return jsonify({"error": "Status is missing"}), 400

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "Authorization header is missing"}), 400

        parts = auth_header.split(' ')
        if len(parts) != 2 or parts[0] != 'Bearer':
            return jsonify({"error": "Invalid Authorization header format"}), 400

        token = parts[1]
        user = auth.get_account_info(token)
        if not user or 'users' not in user or not user['users']:
            return jsonify({"error": "Invalid token"}), 401

        user_id = user['users'][0]['localId']

        # Correct path to the specific assignment
        assignment_path = f'boards/{user_id}/{board_id}/assignments/{assignment_id}'
        print(f"Trying to access path: {assignment_path}")

        assignment_ref = db.child(assignment_path)
        assignment = assignment_ref.get()

        # Print the data retrieved from Firebase for debugging
        assignment_data = assignment.val()
        print(f"Assignment data: {assignment_data}")

        if not assignment_data:
            return jsonify({"error": "Assignment not found"}), 404

        # Update only the status field
        assignment_ref.child('status').set(new_status)
        return jsonify({"message": "Assignment status updated to " + new_status}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# http://localhost:5000/boards
@app.route('/boards', methods=['POST'])
def create_board():
    data = request.get_json()

    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 401

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
                "lastUpdated": datetime.now().isoformat()  # Optional, for tracking updates
            }

            db.child(f'boards/{user_id}').push(board)
            return jsonify({"success": True}), 201
        else:
            return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)