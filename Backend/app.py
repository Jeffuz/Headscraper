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


@app.route('/boards/,<board_id>assignments', methods=['DELETE'])
def delete_assignment(board_id):
    return "Route words", 200
    # data = request.get_json()
    # title = data.get('title')

    # auth_header = request.headers.get('Authorization')
    # if not auth_header:
    #     return jsonify({"error": "Authorization header is missing"}), 401

    # parts = auth_header.split(' ')
    # if len(parts) != 2 or parts[0] != 'Bearer':
    #     return jsonify({"error": "Invalid Authorization header format"}), 400

    # token = parts[1]

    # try:
    #     user = auth.get_account_info(token)
    #     user_id = user['users'][0]['localId'] if user and 'users' in user and len(user['users']) > 0 else None

    #     if user_id:
    #         assignments = db.child(f'boards/{user_id}/{board_id}/assignments').order_by_child('title').equal_to(title).get()
    #         if assignments.each():
    #             for assignment in assignments.each():
    #                 db.child(f'boards/{user_id}/{board_id}/assignments/{assignment.key()}').remove()
    #             return jsonify({"message": "Assignment(s) deleted"}), 200
    #         else:
    #             return jsonify({"error": "No assignments found with the given title"}), 404
    #     else:
    #         return jsonify({"error": "Invalid token"}), 401
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 400


@app.route('/boards/<board_id>/assignments/<assignment_id>/status', methods=['PUT'])
def update_assignment_status(board_id, assignment_id):
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

    try:
        user = auth.get_account_info(token)
        user_id = user['users'][0]['localId'] if user and 'users' in user and len(user['users']) > 0 else None

        if user_id:
            assignment_ref = db.child(f'boards/{user_id}/{board_id}/assignments').child(assignment_id)
            assignment = assignment_ref.get()

            if not assignment.val():
                return jsonify({"error": "Assignment not found"}), 404

            assignment_ref.update({"status": new_status})
            return jsonify({"message": "Assignment status updated"}), 200
        else:
            return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    
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