from flask import Flask, jsonify
from extensions import bcrypt, jwt, mongo_db
from config import Config
from auth import auth_blueprint

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    bcrypt.init_app(app)
    jwt.init_app(app)

  
    app.register_blueprint(auth_blueprint, url_prefix='/') 

    return app















