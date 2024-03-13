from app import create_app
from flask import jsonify, render_template, request
#from  EaStockPrediction_LSTM import generate_predictions
from pymongo import MongoClient
from flask import request, redirect, url_for
from extensions import mongo_db




#uri = 'mongodb+srv://ebilgeca:BwoSLCHaRyn3iUwm@cluster0.v5ifu66.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
# Create a new client and connect to the server
#client = MongoClient(uri)
# Send a ping to confirm a successful connection
#try:
#    client.admin.command('ping')
#    print("Pinged your deployment. You successfully connected to MongoDB!")
#except Exception as e:
#    print(e)

#db = client.cluster0
#collection = db.user_info

app = create_app()

@app.route("/")
def index():
    if "user" in request.args:
        user = request.args['user']
    else:
        user = ""
    return render_template("index.html", user = user)

@app.route("/login")
def login():
    if "user" in request.args:
        user = request.args['user']
    else:
        user = ""
    return render_template("login.html", user = user)

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

#@app.route("/predictions")
#def predictions():
    
   # if "user" in request.args:
    #    user = request.args['user']
    #    predictions_data = generate_predictions()
     

    #else:
     #   user = ""

    #return render_template("predictions.html", user = user, predictions_data = jsonify(predictions_data))





if __name__ == '__main__':
   app.run(debug=True)



