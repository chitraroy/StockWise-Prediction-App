from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager


bcrypt = Bcrypt()
jwt = JWTManager()
MONGO_URI = 'mongodb+srv://ebilgeca:zigot123@cluster0.v5ifu66.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client['cluster0']

