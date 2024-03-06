from flask import Blueprint, request, jsonify
from models import User, db
from extensions import bcrypt
from flask_jwt_extended import create_access_token


auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({'error': 'Missing information'}), 400

    # Check if username already exists
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'error': 'Username already exists'}), 409

    # Hash password with bcrypt
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password_hash=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
          # Create JWT token
        access_token = create_access_token(identity=username)
        return jsonify({'message': 'Logged in successfully'}), 200

    return jsonify({'message': 'Invalid username or password'}), 401

@auth_blueprint.route('/logout', methods=['POST'])
def logout():
    # Implement your logout logic here (e.g., token revocation)
    return jsonify({'message': 'Logged out successfully'}), 200
