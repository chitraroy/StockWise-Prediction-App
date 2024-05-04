StockWise Web application
This project is about Stockwise App which will prdict the next 20 days price of perticular stocks like Walmart stock and S&P 550, based on baseline data from previous year since 1991. The Client side app built with React.js. It serves as the front-end interface for interacting with the associated backend server.

Navigate into the project client Side app: (FrontEnd)
cd client

Built With
React - JavaScript library for building user interfaces Create React App - Set up a modern web app by running one command npm - Package manager for JavaScript

Install dependencies like node modules, Package jason and package lock:
npm install

Running the Application
npm start

This will start the development server. You can view the application by navigating to http://localhost:3000 in your web browser.

Navigate into the project Server Side app: (Back End)
cd Server

Train the model with existing walmart and S&P 500 data
python train.py This will train the model and save the model as keras . Import necessary python library.

Run the Server file
python server.py This command executes the "server.py" file using the Python interpreter.You will see server is running on to http://localhost:5000. Make sure that Python is installed on the user's machine and that they have the necessary permissions to run the script.

db connection
craete a mongodbcompass account in localhost:27017 as mentione in server.py file. Create database named Stockwise.Connect localhost:27017 once you run the the server file it will connect the db and craete collections(customer_user, customer_data) through signup page and contact us page . We can also import wmt and ea data (stock_data_ea, and stock_data_wmt)

Once server and Client side rumnning
Go to http://localhost:3000 in your web browser

You can hover over Navigation bar.

First one is Home Page

once you in Sign in page, one can siging in with existing username and password. This successfull sigin render you to dashbord Prediction page.

in Stock Prediction page one should choose a ticker either ea(S&P500) or wmt (Walmart). Based on current date of choosing one can check the next 20 days prediction in a Red Broken line form and baseline data in blue line . Please pan out the screen of the prediction page and drag it to the left to see the prediction in red. One can zoom in with the plus sign. Prediction are presented with the heklp of line plot and bar plot way.

Sign up page will enable the new user to register their name and details as an User by default. To register as an admin one should checked on the admin button below the sign up page and write the Admin code A123 and submit.

Contact Us page will enable the user to send message to Chitratiya@gmail.com with Uuser details. The email has to be a genuine one , so that admin can reply.

Admin page will require sign in as admin. A successfull sign in will enable the admin search for the customer details with the customer id captured in mongodbcompass customer_data collection feild. Admin can also update and delete the customer details in the same user interface through and can click on the update button to see the changes right way. Mongodb refresh action may require in this case sometimes. Delete button will delete the whole customer data itself.

Once one log in successfully as an admin or as an user can see the log off button at the upper most right corner of the navigation bar. Log off is enables also on contact us and admin page. Succesful Log off will return back the user or admin to the Home Page again.

-------------------------------------------- End -------------------------------------------------------------
