from flask_sqlalchemy import SQLAlchemy
#from werkzeug.security import generate_password_hash, check_password_hash 
#from sqlalchemy import String, create_engine, Column, Integer, Float, Date
#from sqlalchemy.orm import declarative_base, sessionmaker



# set up the engine and session 
#engine = create_engine('sqlite:///stock_predictions.db')
#Session = sessionmaker(bind=engine)


# User model

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(80), nullable=False)  # Roles: Investor, Organization, Individual, Administrator

    def set_password(self, password):
        self.password_hash = db.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return db.check_password_hash(self.password_hash, password)
    


class StockPrediction(db.Model):
    __tablename__ = 'stock_predictions'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True)
    predicted_close_price = db.Column(db.Float)

    


# set up the database and declarative base
#Base = declarative_base()



