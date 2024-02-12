#Imports
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
from keras.optimizers import Adam
from sklearn.metrics import mean_squared_error
import matplotlib.dates as mdates


url = "C:/Users/elfki/Desktop/W24/COMP313/comp313_W24_team5/sp500_stocks.csv"

df = pd.read_csv(url)

df.head()


# Parse 'Date' column for proper indexing in pandas
df['Date'] = pd.to_datetime(df['Date']).dt.date
# Set the 'Date' column as the index
df.set_index('Date', inplace=True)

# Extract the required columns into a dataset
dataset = df[['Open', 'High', 'Low', 'Close']].values
dataset = dataset.astype('float32')

# Normalize the dataset
scaler = MinMaxScaler(feature_range=(0, 1))
dataset = scaler.fit_transform(dataset)

# Split into train and test sets
train_size = len(dataset) - 60
test_size = 60
train, test = dataset[0:train_size, :], dataset[train_size:len(dataset), :]

# Convert an array of values into a dataset matrix
def create_dataset(dataset, look_back=1):
    dataX, dataY = [], []
    for i in range(len(dataset) - look_back - 1):
        a = dataset[i:(i + look_back), :]
        dataX.append(a)
        dataY.append(dataset[i + look_back, -1])  # Using 'Close' value for prediction
    return np.array(dataX), np.array(dataY)

# Reshape into X=t and Y=t+1
look_back = 20
trainX, trainY = create_dataset(train, look_back)
testX, testY = create_dataset(test, look_back)

# Reshape input to be [samples, time steps, features]
trainX = np.reshape(trainX, (trainX.shape[0], trainX.shape[1], 4))
testX = np.reshape(testX, (testX.shape[0], testX.shape[1], 4))

# Create and fit the LSTM network
model = Sequential()
model.add(LSTM(300, input_shape=(look_back, 4)))  # Adjusted for 4 features
model.add(Dense(1))

model.compile(loss='mean_squared_error', optimizer=Adam(learning_rate=0.01, ema_momentum=0.9))
model.fit(trainX, trainY, epochs=100, batch_size=64, verbose=2)

# Predictions and inversion function
def predict_and_inverse(model, X):
    prediction = model.predict(X)
    prediction = np.column_stack((np.zeros((prediction.shape[0], 3)), prediction))  # Padding with zeros
    return scaler.inverse_transform(prediction)[:, -1]

# Make and invert predictions
trainPredict = predict_and_inverse(model, trainX)
trainY = scaler.inverse_transform(np.column_stack((np.zeros((trainY.shape[0], 3)), trainY)))[:, -1]
testPredict = predict_and_inverse(model, testX)
testY = scaler.inverse_transform(np.column_stack((np.zeros((testY.shape[0], 3)), testY)))[:, -1]

# Calculate root mean squared error
trainScore = np.sqrt(mean_squared_error(trainY, trainPredict))
print('Train Score: %.2f RMSE' % trainScore)
testScore = np.sqrt(mean_squared_error(testY, testPredict))
print('Test Score: %.2f RMSE' % testScore)

# ----------------Plotting

# Shift train predictions for plotting
trainPredictPlot = np.empty_like(dataset[:, 3])  # Only 'Close' values
trainPredictPlot[:] = np.nan
trainPredictPlot[look_back:len(trainPredict)+look_back] = trainPredict.flatten()

# Shift test predictions for plotting
testPredictPlot = np.empty_like(dataset[:, 3])  # Only 'Close' values
testPredictPlot[:] = np.nan
testPredictPlot[len(trainPredict)+(look_back*2)+1:len(dataset)-1] = testPredict.flatten()

# Plot baseline and predictions
plt.figure(figsize=(15, 6))

# Inverting the scaled dataset for plotting the baseline 'Close' values
baseline_close = scaler.inverse_transform(dataset)[:, 3]

# Getting the dates for the x-axis
dates = df.index

# Ensure dates align with the baseline_close array length
if len(dates) != len(baseline_close):
    print("Mismatch in dates and baseline_close lengths. Adjust the date range or plotting arrays.")
else:
    # Plot baseline and predictions
    plt.figure(figsize=(15, 6))
    plt.plot(dates, baseline_close, label='True')  # Plotting the 'Close' values


# Plotting the train and test predictions
plt.plot(dates, trainPredictPlot, label='Train Predicted')
plt.plot(dates, testPredictPlot, label='Test Predicted')

# Formatting the x-axis to show years
plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
plt.gca().xaxis.set_major_locator(mdates.YearLocator())
plt.title('Stock Price Prediction with LSTM')
plt.xlabel('Year')
plt.ylabel('Stock Price')
plt.legend()
plt.show()