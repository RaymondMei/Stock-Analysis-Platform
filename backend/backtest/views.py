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




class SMAStrategy(Strategy):
	sw = 10
	lw = 20
	def init(self):
		price = self.data.Close
		print('win', self.sw, self.lw)
		self.ma1 = self.I(SMA, price, 10)#self.shortWindow)
		self.ma2 = self.I(SMA, price, 20)#self.longWindow)
	def next(self):
		if crossover(self.ma1, self.ma2):
			self.buy()
		elif crossover(self.ma2, self.ma1):
			self.sell()
		

@api_view(['GET'])
def simpleMovingAverage(request):
	if request.method == 'GET':
		startDate = "2024-1-1" # request.GET.get('start-date')
		endDate = "2024-12-31" # request.GET.get('end-date')
		ticker = request.GET.get('ticker')
		shortWindow = request.GET.get('shortWindow')
		longWindow = request.GET.get('longWindow')

		try:
            # Fetch data
			# tickerObj = yfin.Ticker(ticker)
			# data1 = tickerObj.history(start=startDate, end=endDate)
			# data1.to_csv(f'fetchfinancialdata/test.csv')
			data = pd.read_csv(f'fetchfinancialdata/YahooFinanceData/{ticker}-2024.csv')
			data.index = pd.DatetimeIndex(data['Date'], tz='UTC')

			# Run backtest
			backtest = Backtest(data, SMAStrategy, commission=.002, exclusive_orders=True)
			stats = backtest.run(sw=shortWindow, lw=longWindow).to_dict()
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

			return Response(stats_dict, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
