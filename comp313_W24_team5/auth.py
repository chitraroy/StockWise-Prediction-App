from flask import Blueprint, request, jsonify, render_template, redirect, url_for
from models import User
from extensions import mongo_db as db, bcrypt
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash



auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    error = ""
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        role = request.form["role"]

        if not username or not password or not role:
            error = 'Missing information'
            return render_template("register.html", error = error)        

        # Check if username already exists
        user = User.find_by_username(username=username)
        if user:
            error = 'Username already exists'
            return render_template("register.html", error = error)

        # Hash password with bcrypt
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        hashed_password = generate_password_hash(password)
        new_user_id = User.create_user(username, password, role)
        db.session.add(new_user_id)
        db.session.commit()

        return redirect(url_for("index"))

    return render_template("register.html", error = error)

@auth_blueprint.route('/login', methods=['GET', 'POST'])
def login():

    error = ""
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        user = User.find_by_username(username=username)
        if user and bcrypt.check_password_hash(user.password_hash, password):
              # Create JWT token
            access_token = create_access_token(identity=username)
            return redirect(url_for("index", user = username))
        else:
            error = "Could not login with given credentials"

    return render_template("login.html", error = error)

@auth_blueprint.route('/logout', methods=['POST'])
def logout():
    # Implement your logout logic here (e.g., token revocation)
    return jsonify({'message': 'Logged out successfully'}), 200
