from keras.models import load_model
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from keras.models import Sequential
from keras.layers import Dense, LSTM
from keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler



# Load the saved model and scaler
model = load_model('stock_model.keras')
scaler = joblib.load("scaler.save")

# Read the CSV file to get the last 20 rows
url = r"C:\Users\hajra\Downloads\sp500_stocks_ea.csv"

df = pd.read_csv(url)  # Replace 'path_to_your_csv_file.csv' with the actual path

# Convert 'Date' column to datetime
df['Date'] = pd.to_datetime(df['Date']).dt.date
df.set_index('Date', inplace=True)

# Prepare dataset
dataset = df[['Open', 'High', 'Low', 'Close']].values
dataset = dataset.astype('float32')

# Normalize the dataset
scaler = MinMaxScaler(feature_range=(0, 1))
dataset = scaler.fit_transform(dataset)

look_back = 20
print(dataset)
print("---end--")
# Predict for next 20 days
last_known_data = dataset[-look_back:]
print(last_known_data)


# Predict for next 20 days

predictions = []

for _ in range(20):
    prediction = model.predict(last_known_data.reshape(1, look_back, 4))
    predictions.append(prediction[0][0])
    new_data_point = np.array([last_known_data[0, 1], last_known_data[0, 2], last_known_data[0, 3], prediction[0][0]]).reshape(1, 4)
    last_known_data = np.append(last_known_data[1:], new_data_point, axis=0)
next_20_days_predictions = scaler.inverse_transform(np.c_[predictions, np.zeros(len(predictions)), np.zeros(len(predictions)), np.zeros(len(predictions))])[:,0]
print("\nPredicted stock prices for the next 20 days:")
print(next_20_days_predictions)

# Predict for next 20 days
future_dates = pd.date_range(start=df.index[-1], periods=21, freq='B')[1:]  # Exclude the last known date

# Plotting
plt.figure(figsize=(15, 10))

# Plotting the actual data as a line chart with blue color
plt.subplot(2, 1, 1)
plt.plot(df.index, df['Close'], label='Actual Data', color='blue')
plt.plot(future_dates, next_20_days_predictions, label='Predicted Data', linestyle='--', color='orange')
plt.title('Actual vs Predicted Stock Prices (Line Chart)')
plt.xlabel('Date')
plt.ylabel('Stock Price')
plt.legend()
plt.xticks(rotation=45)

# Plotting the actual and predicted data as a bar chart
plt.subplot(2, 1, 2)
plt.bar(df.index, df['Close'], label='Actual Data', color='blue', alpha=0.6)
plt.bar(future_dates, next_20_days_predictions, label='Predicted Data', color='orange', alpha=0.6)
plt.title('Actual vs Predicted Stock Prices (Bar Chart)')
plt.xlabel('Date')
plt.ylabel('Stock Price')
plt.legend()
plt.xticks(rotation=45)

# Adjust layout and display the plots
plt.tight_layout()
plt.show()
