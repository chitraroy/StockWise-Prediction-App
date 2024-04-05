
from app import create_app, mongo_db
from flask import  jsonify, request, redirect, url_for, render_template
from datetime import datetime, timedelta
from pymongo import MongoClient
import logging
from app.config import Config
from app.utils.predict_utils import load_saved_assets, prepare_data_for_prediction, predict_stock_price, fetch_last_days_of_data
import numpy as np
import pandas as pd




logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

# Create an instance of the Flask application
app = create_app()

# Assuming your create_app function correctly initializes mongo_db
mongo_db = app.mongo_db
predictions_collection = mongo_db['stock_predictions']

# Load and preprocess your CSV data
data_path = 'C:/Users/elfki/Desktop/COMP313_team5_new/model_training/data/sp500_stocks.csv'
df = pd.read_csv(data_path)

# Load saved model and scaler
model, scaler = load_saved_assets(
    model_path='C:/Users/elfki/Desktop/COMP313_team5_new/trained_models/stock_model.keras',
    scaler_path='C:/Users/elfki/Desktop/COMP313_team5_new/trained_models/scaler.pkl'
)


@app.route("/")
def index():
    user = request.args.get('user', '')
    return render_template("index.html", user=user)

@app.route("/login")
def login():
    if "user" in request.args:
        user = request.args['user']
    else:
        user = ""
    return render_template("login.html", user = user)

@app.route("/logout")
def logout():
    if "user" in request.args:
        user = request.args['user']
    else:
        user = ""
    return render_template("logout.html", user = user)

@app.route("/register")
def register():
    if "user" in request.args:
        user = request.args['user']
    else:
        user = ""
    return render_template("register.html", user = user)

@app.route('/add', methods=['POST'])
def add_item():
    # Access form data
    item_name = request.form['name']
    
    # Insert document into the collection
    result = mongo_db.collection_name.insert_one({"name": item_name})
    
    # Redirect or respond based on the result
    return redirect(url_for('index'))


@app.route('/api/predict', methods=['POST'])
def predict():
    # Example POST request JSON body: {"input_data": [[open, high, low, close], [open, high, low, close], ...]}
    input_json = request.get_json()
    
    # Print the received JSON body
    print("Received JSON body:", input_json)

     # Check if 'input_data' key exists in the JSON object
    if 'input_data' not in input_json or not isinstance(input_json['input_data'], list):
        return jsonify({"error": "Invalid JSON structure. 'input_data' should be a list of lists."}), 400
    
    try:
        input_data = np.array(input_json['input_data'])
    except Exception as e:
        return jsonify({"error": f"Error processing input data: {str(e)}"}), 400
    
       # Debugging statement - print the type and structure of input_data after conversion
    print("Type of input_data: ", type(input_data))
    print("Shape of input_data: ", input_data.shape)

    # Prepare data for prediction
    prepared_data = prepare_data_for_prediction(input_data, look_back=20, scaler=scaler)

    #print("Input data shape:", input_data.shape)
    
    # Predict stock price
    prediction = predict_stock_price(model, prepared_data)


    return jsonify({"predicted_price": prediction.tolist()})


@app.route('/generate_predictions', methods=['POST'])
def generate_predictions():
    try:
        #num_features = 4 
        look_back=20
        # Load saved model and scaler
        model, scaler = load_saved_assets(
            model_path='C:/Users/elfki/Desktop/COMP313_team5_new/trained_models/stock_model.keras',
            scaler_path='C:/Users/elfki/Desktop/COMP313_team5_new/trained_models/scaler.pkl'
        )

        # Fetch or generate the input data
        input_data = fetch_last_days_of_data(look_back=look_back, csv_path='C:/Users/elfki/Desktop/COMP313_team5_new/model_training/data/sp500_stocks.csv')
        # Check if the input data has the correct shape  
        if input_data.shape != (look_back, 4):
            raise ValueError(f"Input data must be shaped as ({look_back}, 4), got {input_data.shape}")  
      
        # Prepare the data for prediction
        prepared_data = prepare_data_for_prediction(input_data, look_back, scaler)
        #prepared_data = input_data.reshape(1, look_back, 4)  # Now shaped as (1, 20, 4)

        # Generate predictions
        predictions = predict_stock_price(model, prepared_data)

        # Prepare the document for MongoDB insertion
         # Generate dates for the next 7 days
        today = datetime.today()
        future_dates = [(today + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, 8)]
        
        # Prepare the document for MongoDB insertion
        predictions_docs = [{"date": date, "predicted_close_price": float(pred), "stock_symbol": 'EA'} for date, pred in zip(future_dates, predictions)]
         # Insert predictions into MongoDB
        mongo_db['stock_predictions'].insert_many(predictions_docs)
    

        logging.info("Predictions generated and saved successfully.")       
        return jsonify({"message": "Predictions generated and saved successfully"}), 200
    
    except Exception as e:

        raise e
        logging.error(f"Error in generate_predictions: {str(e)}")
        return jsonify({"error": "Failed to generate or save predictions"}), 500

@app.route('/api/predictions/<string:stock_symbol>', methods=['GET'])
def get_stock_predictions(stock_symbol):
    try:
        logging.info(f"Fetching predictions for stock symbol: {stock_symbol}.")
        
        # Query MongoDB for predictions corresponding to the requested stock symbol
        predictions_cursor = mongo_db['stock_predictions'].find({"stock_symbol": stock_symbol}, {'_id': 0})

        predictions = list(predictions_cursor)
        
        if predictions:
            logging.info(f"Found {len(predictions)} predictions for {stock_symbol}.")
            return jsonify(predictions)
        else:
            logging.info(f"No predictions found for {stock_symbol}.")
            return jsonify({"message": f"No predictions found for stock symbol {stock_symbol}"}), 404

    except Exception as e:
        logging.error(f"Failed to fetch predictions for {stock_symbol}: {str(e)}")
        return jsonify({"error": "Failed to fetch predictions"}), 500



@app.route('/api/predictions', methods=['GET'])
def get_predictions_from_db():
    try:
        logging.info("Fetching predictions from MongoDB.")
        predictions_cursor = predictions_collection.find({}, {'_id': 0})
        predictions = list(predictions_cursor)
        logging.info(f"Found {len(predictions)} predictions.")
        return jsonify(predictions)
    except Exception as e:
        logging.error(f"Failed to fetch predictions: {str(e)}")
        return jsonify({"error": "Failed to fetch predictions"}), 500
    
@app.route('/api/trending_stocks', methods=['GET'])
def get_trending_stocks():
    # Fetch the latest predictions from MongoDB
    cursor = predictions_collection.find().sort("date", -1).limit(7)
    return jsonify(list(cursor))


@app.route('/api/search_stock', methods=['GET'])
def search_stock():
    stock_symbol = request.args.get('symbol')
    cursor = predictions_collection.find({"stock_symbol": stock_symbol})
    predictions = list(cursor)
    if predictions:
        return jsonify(predictions)
    else:
        return jsonify({"error": f"No predictions found for {stock_symbol}"}), 404


if __name__ == '__main__':
    
    app.run(debug=True)


