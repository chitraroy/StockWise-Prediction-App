from extensions import mongo_db
from werkzeug.security import generate_password_hash, check_password_hash 
from datetime import datetime





class User:
    collection =mongo_db.user_info

    @staticmethod
    def create_user(username, password, role):
        password_hash = generate_password_hash(password)
        user = {
            "username": username,
            "password_hash": password_hash,
            "role": role
        }
        return User.collection.insert_one(user).inserted_id

    @staticmethod
    def find_by_username(username):
        return User.collection.find_one({"username": username})

    @staticmethod
    def check_password(username, password):
        user = User.find_by_username(username)
        if user:
            return check_password_hash(user["password_hash"], password)
        return False


class StockPrediction:
    collection = mongo_db.stock_predictions  # Use your MongoDB collection name

    @staticmethod
    def create_prediction(date, predicted_close_price):
        prediction = {
            "date": date,  # Ensure date is in a format MongoDB can store, like ISODate
            "predicted_close_price": predicted_close_price
        }
        return StockPrediction.collection.insert_one(prediction).inserted_id

    @staticmethod
    def find_by_date(date):
        # Assuming 'date' is stored as a string or ISODate
        return StockPrediction.collection.find_one({"date": date})

    @staticmethod
    def update_prediction(date, predicted_close_price):
        # This method updates a prediction for a given date
        return StockPrediction.collection.update_one(
            {"date": date},
            {"$set": {"predicted_close_price": predicted_close_price}}
        )

    @staticmethod
    def delete_prediction(date):
        # This method deletes a prediction for a given date
        return StockPrediction.collection.delete_one({"date": date})

    




