from flask import Flask, jsonify
from extensions import db, bcrypt, jwt
from config import Config
from flask_sqlalchemy import SQLAlchemy
from auth import auth_blueprint



db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    #db = SQLAlchemy(app) 
    bcrypt.init_app(app)
    jwt.init_app(app)

  
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    @app.route('/predictions', methods=['GET'])
    def predictions():
        from  EaStockPrediction_LSTM import generate_predictions
        predictions_data = generate_predictions()
        return jsonify(predictions_data)
        
    pass

    with app.app_context():
        db.create_all()
  

    return app















# SQLAlchemy setup
#Base = declarative_base()
#engine = create_engine('sqlite:///stock_predictions.db', echo=True)
#Session = sessionmaker(bind=engine)
#session = scoped_session(Session)



# Define models
#class User(Base):
 #   __tablename__ = 'users'
#    id = Column(Integer, primary_key=True)
  #  username = Column(String(100), unique=True, nullable=False)
  #  password_hash = Column(String(128), nullable=False)
  #  role = Column(String(20), nullable=False)

  #  def set_password(self, password):
  #     self.password_hash = generate_password_hash(password)

    # def check_password(self, password):
    #    return check_password_hash(self.password_hash, password)

#class StockPrediction(Base):
#    __tablename__ = 'stock_predictions'
#    id = Column(Integer, primary_key=True)
#    date = Column(Date, unique=True)
 #    predicted_close_price = Column(Float)

#Base.metadata.create_all(engine)

#@app.route('/register', methods=['POST'])
#def register():
#    data = request.get_json()
#    username = data['username']
#    password = data['password']
#    role = data['role']

 #   if session.query(User).filter_by(username=username).first():
  #      return jsonify({'message': 'User already exists'}), 400

  #  hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

   # new_user = User(username=username, password_hash=hashed_password, role=role)
   # session.add(new_user)
   # session.commit()

   # return jsonify({'message': 'User registered successfully'}), 201

#@app.route('/login', methods=['POST'])
#def login():
#    data = request.get_json()
#    user = session.query(User).filter_by(username=data['username']).first()

#    if user and user.check_password(data['password']):
        # Implement login logic here. Flask-Login is not used, so you might need to manage sessions manually or use JWT tokens.
#        return jsonify({'message': 'Logged in successfully'}), 200

#    return jsonify({'message': 'Invalid username or password'}), 401

#@app.route('/predictions', methods=['GET'])
#def get_predictions():
#    predictions_list = session.query(StockPrediction).all()
#    result = [{'date': prediction.date.isoformat(), 'predicted_close_price': prediction.predicted_close_price} for prediction in predictions_list]
#    return jsonify(result)

#if __name__ == '__main__':
#    app.run(debug=True)