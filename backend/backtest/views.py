from django.shortcuts import render
from django.http import HttpResponse, request, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
import pandas as pd
import numpy as np

from backtesting import Backtest, Strategy
from backtesting.lib import crossover
from backtesting.test import SMA, GOOG

import yfinance as yfin
import datetime as dt

# Create your views here.
# @api_view(['GET'])
# def backtest(request):
# 	if request.method == 'GET':
# 		# symbol = request.GET.get('stock-symbol')
# 		initial_investment = float(request.GET.get('initial-investment'))
# 		short_window = int(request.GET.get('short-window'))
# 		long_window = int(request.GET.get('long-window'))

# 		with open('fetchfinancialdata/teststockdata.json', 'r') as file:
# 			data = json.load(file)
# 		resultJson = data

# 		df = pd.DataFrame.from_dict(resultJson['Time Series (Daily)'], orient='index')
# 		df = df.astype(float)
# 		df.index = pd.to_datetime(df.index)
# 		df = df.sort_index()
# 		df['id'] = range(1, len(df)+1)
# 		df[['id'] + [x for x in df.columns if x != 'id']]
# 		df.set_index('id')

# 		df['short_mavg'] = df['close'].rolling(window=short_window, min_periods=1).mean()
# 		df['long_mavg'] = df['close'].rolling(window=long_window, min_periods=1).mean()

# 		# Implement the trading strategy
# 		df['signal'] = np.where(df['close'] > df['long_mavg'], 1, 0)
# 		df['positions'] = df['signal'].diff()
# 		df.at[df.index[0], 'positions'] = 0

# 		prev_quantity = 0
# 		prev_closing = initial_investment
# 		for i, row in df.iterrows():

# 			if row['positions'] == 1: # buy
# 				new_quantity = prev_closing / row['close']
# 				new_closing = 0
# 			elif row['positions'] == -1: # sell
# 				new_quantity = 0
# 				new_closing = prev_quantity * row['close']
# 			else:
# 				new_quantity = prev_quantity
# 				new_closing = prev_closing
			
# 			df.at[i, 'quantity'] = new_quantity
# 			df.at[i, 'closing cash'] = new_closing
			
# 			prev_quantity = new_quantity
# 			prev_closing = new_closing

# 		total_return = df['closing cash'].iloc[-1] + df['quantity'].iloc[-1] * df['close'].iloc[-1] - initial_investment

# 		print(total_return)

# 		performance_summary = {
# 			'total_return': total_return
# 		}

# 		return JsonResponse(performance_summary, status=status.HTTP_200_OK)


class SMAStrategy(Strategy):
	def init(self):
		price = self.data.Close
		self.ma1 = self.I(SMA, price, 10)
		self.ma2 = self.I(SMA, price, 20)
	def next(self):
		if crossover(self.ma1, self.ma2):
			self.buy()
		elif crossover(self.ma2, self.ma1):
			self.sell()

@api_view(['GET'])
def simpleMovingAverage(request):
	if request.method == 'GET':
		startDate = request.GET.get('start-date')
		endDate = request.GET.get('end-date')
		ticker = request.GET.get('ticker')
		
		try:
            # Fetch data
			tickerObj = yfin.Ticker(ticker)
			data = tickerObj.history(start=startDate, end=endDate)

			# Run backtest
			backtest = Backtest(data, SMAStrategy, commission=.002, exclusive_orders=True)
			stats = backtest.run().to_dict()
			del stats['_equity_curve']
			del stats['_trades']

			stats_dict = {}
			for key, value in stats.items():
				if isinstance(value, pd.Timestamp):
					stats_dict[key] = value.to_pydatetime()
				elif isinstance(value, pd.Timedelta):
					stats_dict[key] = value.to_pytimedelta()
				elif isinstance(value, (int, float, str, bool, list, dict)):
					stats_dict[key] = value  # No conversion needed
				else:
					stats_dict[key] = str(value)  # Fallback for unknown types

			print(stats)
			# Prepare response data
			response_data = {
				"ticker": ticker,
				"start_date": startDate,
				"end_date": endDate,
				"performance_metrics": stats # Convert stats to a serializable format
			}
			print("------------------")
			for k, v in stats_dict.items():
				print(k, type(v))
			# print(response_data.items())

			# Optional: Save or process plot
			# backtest.plot()  # Comment/remove this line for API-only behavior

			return JsonResponse(stats_dict, safe=False)
		except Exception as e:
			print("asdfsdfsd", e)
			return JsonResponse({"error": e}, status=400)
