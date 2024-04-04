import threading
from flask import Flask, jsonify, request
import matplotlib
from pymongo import MongoClient
from flask_cors import CORS 
import json
import numpy as np
import pandas as pd
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
from keras.models import load_model
import joblib
from sklearn.preprocessing import MinMaxScaler
import io
import os
import base64
from bson import ObjectId
# Importing additional libraries
from flask import Response
from queue import Queue
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# Create a queue to communicate between threads
plot_queue = Queue()
predictions_queue = Queue()

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
client = MongoClient('mongodb://localhost:27017')
db = client['Stockwise']
users_collection = db['customer_user']
customer_data_collection = db['customer_data']

# Check if the 'customer_data' collection exists and create it if it doesn't
if 'customer_data' not in db.list_collection_names():
    customer_data_collection = db['customer_data']
    print('Created customer_data collection.')
else:
    print('collection db exists')
    customer_data_collection = db['customer_data']  # Define the collection if it exists
    
    # Log database connection success
print('Database connection successful.')

# Function to generate predictions
def generate_predictions(stock_symbol):
    message_info = ""
    try:
        # Check if model file exists
        model_filename = f'stock_model_{stock_symbol}.keras'
        if not os.path.exists(model_filename):
            message_info = f"No data exists for stock symbol {stock_symbol}"
            predictions_queue.put({'message': message_info})  # Passing the message to the queue
        else:
            # Load the saved model and scaler
            model = load_model(model_filename)
            scaler_filename = f'scaler_{stock_symbol}.save'
            scaler = joblib.load(scaler_filename)

            # Read the CSV file from the request
            #url = r"C:\Users\hajra\Downloads\sp500_stocks_ea.csv"
            #df = pd.read_csv(url)
            print(stock_symbol)
            # Make the stock_symbol case insensitive
            stock_symbol = stock_symbol.lower()
            stock_symbol_upper = stock_symbol.upper()

             # Check if collection with the specified stock symbol exists
            collection_name = f'stock_data_{stock_symbol}'
            if collection_name not in db.list_collection_names():
                message_info = f"No data exists for stock symbol {stock_symbol}"
                print(message_info)
                predictions_queue.put({'message': message_info})  # Passing the message to the queue
            else:
                # Pull data from MongoDB collection
                print(f"Fetching data for stock symbol {stock_symbol} from MongoDB...")
                cursor = db[collection_name].find({})
                print("Data fetched successfully.")

                df = pd.DataFrame(list(cursor))
                print("DataFrame created successfully.")
               
                # Convert 'Date' column to datetime
                df['Date'] = pd.to_datetime(df['Date']).dt.date
                df.set_index('Date', inplace=True)
          
                # Prepare dataset
                dataset = df[['Open', 'High', 'Low', 'Close']].values
                dataset = dataset.astype('float32')
          
                # Normalize the dataset
                dataset = scaler.transform(dataset)
          
                look_back = 20
               
                # Predict for next 20 days
                last_known_data = dataset[-look_back:]
          
                predictions = []
          
                for _ in range(20):
                    prediction = model.predict(last_known_data.reshape(1, look_back, 4))
                    predictions.append(prediction[0][0])
                    new_data_point = np.array([last_known_data[0, 1], last_known_data[0, 2], last_known_data[0, 3], prediction[0][0]]).reshape(1, 4)
                    last_known_data = np.append(last_known_data[1:], new_data_point, axis=0)
               
                # Calculate future dates and predictions for predicted data plotting      
                next_20_days_predictions = scaler.inverse_transform(np.c_[predictions, np.zeros(len(predictions)), np.zeros(len(predictions)), np.zeros(len(predictions))])[:,0]    
                future_dates = pd.date_range(start=df.index[-1], periods=21, freq='B')[1:]
          
                # Calculate baseline close and date for actual data plotting
                baseline_close = scaler.inverse_transform(dataset)[:, 3]
                dates = pd.date_range(start=df.index[0], periods=len(baseline_close), freq='B')  # Business days
          
                # Put the predictions, future dates, and actual data in the queue
                predictions_queue.put({'predictions': next_20_days_predictions.tolist(), 'future_dates': future_dates.strftime('%Y-%m-%d').tolist(),
                              'baseline_close': baseline_close.tolist(),'dates': dates.strftime('%Y-%m-%d').tolist(),'message': f"Predictions found for stock symbol {stock_symbol_upper}"})
          
    except Exception as e:
        print("Error:", e)


@app.route('/')
def home():
    return "Welcome to Stock Prediction Website!"

@app.route('/login', methods=['POST'])
def login():
    # Print all user records from the collection
    print('All users:', list(users_collection.find({})))

    # Get username and password from request
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print('Received login request with username:', username) # Add this line
    print('Received login request with password:', password) # Add this line

    # Check if user exists in the database based on username
    user = users_collection.find_one({'name': username})

    if user:
        print('User found:', user['name'])  # Print statement to indicate user found
        # If user exists, verify the password
        if user['password'] == password:
            print('Password found for user:', user['name'])  # Print statement to indicate password found
            # Password is correct, authentication successful
            return jsonify({'message': 'Login success', 'role': user.get('role', 'user')}), 200
        else:
            # Password is incorrect
            print('Incorrect password for user:', user['name'])  # Print statement to indicate incorrect password
            return jsonify({'message': 'Login failed - Incorrect password'}), 401
    else:
        # User does not exist
        print('User not found:', username)  # Print statement to indicate user not found
        return jsonify({'message': 'Login failed - User not found'}), 401


@app.route('/contactus', methods=['POST'])
def contactus():
    data = request.get_json()
    
    print('Received data:', data)  # Print the received data

    customer_name = data.get('name')  # Adjusted key to match the received data
    address = data.get('address')
    zip_code = data.get('zipCode')  # Adjusted key to match the received data
    phone = data.get('phone')
    email = data.get('email')
    message = data.get('message')

    result = customer_data_collection.insert_one({
        'customer_name': customer_name,
        'address': address,
        'zip_code': zip_code,
        'phone': phone,
        'email': email,
        'message': message
    })

    inserted_data = customer_data_collection.find_one({'_id': result.inserted_id})

    return jsonify({'message': 'Contact details submitted successfully'}), 200

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print('Received signin request with data:', data)

    name = data.get('name')
    password = data.get('password')
    phone = data.get('phone')
    email = data.get('email')
    role = 'admin' if data.get('role') == 'admin' else 'user'  # Determine role based on client-side logic

    # Check if user already exists
    existing_user = users_collection.find_one({'name': name})
    if existing_user:
        print('User already exists:', existing_user)
        return jsonify({'message': 'User already exists'}), 409
    
    # Insert the user into the database
    result = users_collection.insert_one({
        'name': name,
        'password': password,
        'phone': phone,
        'email': email,
        'role': role  # Add the role to the user data being inserted
    })
    print('Inserted user:', result.inserted_id)

    # Retrieve and print the inserted user record
    inserted_user = users_collection.find_one({'_id': result.inserted_id})
    print('Inserted user record:', inserted_user)

    return jsonify({'message': 'User created successfully'}), 200

@app.route('/dashboard', methods=['POST'])
def get_predictions():
    stock_symbol = request.json['stockSymbol']
    generate_predictions(stock_symbol)  # Call the function to generate predictions
    
    # Retrieve data from the queue
    if not predictions_queue.empty():
        data = predictions_queue.get()
        
        # Print the data being sent to the client
        print("Server sending the following data to client:")
        print("Predictions:", data.get('predictions'))
        print("Future Dates:", data.get('future_dates'))
        print("Future Dates:", type(data.get('future_dates')))
        print("Server message:" , data.get('massage'))
        #print("Actual Data (Baseline Close):", data.get('baseline_close'))
        #print("Predicted Data (Dates):", data.get('dates'))
        print("Predicted Data (Dates):", type(data.get('dates')))
        
        return jsonify({
            'message': data.get('message',''),
            'predictions': data.get('predictions', []),
            'future_dates': data.get('future_dates', []),
            'baseline_close': data.get('baseline_close', []),
            'dates': data.get('dates', [])
        })
    else:
        return jsonify({'message': 'No predictions found for this stock.'}), 404

@app.route('/admin/customer/<customer_id>', methods=['GET'])
def get_customer_info(customer_id):
    customer_data_collection = db['customer_data']
    print(customer_id)
    # Convert the customer_id string to ObjectId
    try:
        customer_id = ObjectId(customer_id)
    except Exception as e:
        return jsonify({'message': 'Invalid customer ID'}), 400
    
    # Query the database to find the customer information
    customer_info = customer_data_collection.find_one({'_id': customer_id})
    if customer_info:
        customer_info['_id'] = str(customer_info['_id'])
        return jsonify({'customerInfo': customer_info}), 200
    else:
        return jsonify({'message': 'Customer not found'}), 404   

from flask import jsonify, request
from bson import ObjectId  # Import ObjectId for converting string to ObjectId

from flask import jsonify, request
from bson import ObjectId  # Import ObjectId for converting string to ObjectId

@app.route('/admin/customer/<customer_id>', methods=['PUT'])
def update_customer(customer_id):
    customer_data_collection = db['customer_data']
    try:
        # Get the updated customer data from the request
        updated_data = request.json

        print("Received updated data:", updated_data)  # Log the received data
        
        # Convert the customer_id string to ObjectId
        customer_id_obj = ObjectId(customer_id)
        
        # Retrieve the existing customer record
        customer = customer_data_collection.find_one({'_id': customer_id_obj})
        
        if customer:
            # Drop the '_id' field from the updated data
            updated_data.pop('_id', None)
            
            # Update the customer record with the new data
            customer_data_collection.update_one({'_id': customer_id_obj}, {'$set': updated_data})
            
            # Log the updated customer data
            print("Customer updated successfully:", updated_data)
            
            # Return success response with the updated customer data
            return jsonify({'message': 'Customer updated successfully', 'customer': updated_data}), 200
        else:
            # Log customer not found error
            print("Customer not found")
            return jsonify({'error': 'Customer not found'}), 404
    except Exception as e:
        # Log any exception that occurred
        print("Error updating customer:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/admin/customer/<customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    customer_data_collection = db['customer_data']
    try:
        # Convert the customer_id string to ObjectId
        customer_id_obj = ObjectId(customer_id)
        
        # Retrieve the existing customer record
        customer = customer_data_collection.find_one({'_id': customer_id_obj})
        
        if customer:
            # Delete the customer record
            customer_data_collection.delete_one({'_id': customer_id_obj})
            
            # Log the deletion
            print("Customer deleted successfully")
            
            # Return success response
            return jsonify({'message': 'Customer deleted successfully'}), 200
        else:
            # Log customer not found error
            print("Customer not found")
            return jsonify({'error': 'Customer not found'}), 404
    except Exception as e:
        # Log any exception that occurred
        print("Error deleting customer:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/admin/send_email/<customer_id>', methods=['POST'])
def send_email(customer_id):
    try:
        # Extract email content from request
        data = request.json
        recipient_email = data.get('recipient_email')
        print("email to send to")
        print(recipient_email)
        
        message_body = data.get('message_body')

        print(message_body)

        # Create a multipart message and set headers
        msg = MIMEMultipart()
        msg['From'] = 'chitratiya@gmail.com'
        msg['To'] = recipient_email
        msg['Subject'] = 'Information you requested for Stockwise subscription'

        # Add message body to email
        msg.attach(MIMEText(message_body, 'plain'))

        # Connect to the SMTP server
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            # Login to the SMTP server (replace placeholders with actual credentials)
            smtp.login('chitratiya@gmail.com', 'nbwq rjjn gpgy wjak')
            print("login ok .. sending email")
            # Send email
            smtp.sendmail('chitratiya@gmail.com', recipient_email, msg.as_string())
        
        return jsonify({'message': 'Email sent successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error sending email', 'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
