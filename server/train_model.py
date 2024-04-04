import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
from keras.optimizers import Adam
import joblib  # Import joblib module

# Read the dataset
url = r"C:\Users\chitr\Downloads\sp500_stocks_ea.csv"
df = pd.read_csv(url)

# Convert 'Date' column to datetime
df['Date'] = pd.to_datetime(df['Date']).dt.date
df.set_index('Date', inplace=True)

# Prepare datasetsss
dataset = df[['Open', 'High', 'Low', 'Close']].values
dataset = dataset.astype('float32')

# Normalize the dataset
scaler = MinMaxScaler(feature_range=(0, 1))
dataset = scaler.fit_transform(dataset)

# Function to create dataset
def create_dataset(dataset, look_back=1):
    dataX, dataY = [], []
    for i in range(len(dataset) - look_back - 1):
        a = dataset[i:(i + look_back), :]
        dataX.append(a)
        dataY.append(dataset[i + look_back, -1])
    return np.array(dataX), np.array(dataY)

look_back = 20
dataX, dataY = create_dataset(dataset, look_back)
dataX = np.reshape(dataX, (dataX.shape[0], dataX.shape[1], 4))

# Create and fit the LSTM network
model = Sequential()
model.add(LSTM(300, input_shape=(look_back, 4)))
model.add(Dense(1))

model.compile(loss='mean_squared_error', optimizer=Adam(learning_rate=0.01, ema_momentum=0.9))
model.fit(dataX, dataY, epochs=100, batch_size=64, verbose=2)

# Save the trained model and scaler
model.save('stock_model_ea.keras')
scaler_filename = "scaler_ea.save"
joblib.dump(scaler, scaler_filename)