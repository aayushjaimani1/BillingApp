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

from pylab import rcParams
rcParams['figure.figsize'] = 15, 7
df.plot()

from statsmodels.tsa.stattools import adfuller
test_result=adfuller(df['Sales'])


def adfuller_test(sales):
    result = adfuller(sales)
    labels = ['ADF Test Statistic', 'p-value', '#Lags Used', 'Number of Observations']
    for value, label in zip(result, labels):
        print(label + ' : ' + str(value))

    if result[1] <= 0.05:
        print("Strong evidence against the null hypothesis (Ho), reject the null hypothesis. Data is stationary.")
    else:
        print("Weak evidence against the null hypothesis, indicating it is non-stationary.")

adfuller_test(df['Sales'])


from pandas.plotting import autocorrelation_plot
autocorrelation_plot(df['Sales'])
plt.show()

from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))

# Autocorrelation plot
plot_acf(df['Sales'], lags=11, ax=ax1)
ax1.set_title('Autocorrelation')

# Partial autocorrelation plot
plot_pacf(df['Sales'], lags=11, ax=ax2)
ax2.set_title('Partial Autocorrelation')

plt.tight_layout()
plt.show()


import statsmodels.api as sm
model = sm.tsa.ARIMA(df['Sales'], order=(1, 1, 1))
model_fit = model.fit()
print(model_fit.summary())


df['forecast']=model_fit.predict(start=42,end=103,dynamic=True)
df[['Sales','forecast']].plot(figsize=(12,8))

import statsmodels.api as sm
model=sm.tsa.statespace.SARIMAX(df['Sales'],order=(1, 1, 1),seasonal_order=(1,1,1,12))
results=model.fit()
df['forecast']=results.predict(start=35,end=103,dynamic=True)
df[['Sales','forecast']].plot(figsize=(12,8))

# print(df)


start_date = pd.to_datetime('2022-01-01')
end_date = pd.to_datetime('2023-12-31')

filtered_dataset = df[(df.index >= start_date) & (df.index <= end_date)]
# print(filtered_dataset)
