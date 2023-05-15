import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA

df = pd.read_csv('C:\\Users\\anok1\\Desktop\\Epics\\billing-system\\server\\Prediction System\\inventory_dataset.csv')
# print(df)

cookies_data = df[df['Sub Category'] == 'Cookies']
df = cookies_data
# print(df)

df['Date'] = pd.to_datetime(df['Date'], format="%Y-%m-%d")
df['Date'] = df['Date'].dt.to_period('M').dt.to_timestamp()
df = df.groupby('Date')['Sales'].sum().reset_index()
# print(df)

old_column_name = 'Date'
new_column_name = 'Month'
df = df.rename(columns={old_column_name: new_column_name})

df.columns=["Month","Sales"]
df.head()
df.describe()

df.set_index('Month',inplace=True)
# print(df)

