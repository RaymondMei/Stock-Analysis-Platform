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
	shortWindow = 5
	longWindow = 20
	def init(self):
		price = self.data.Close
		self.ma1 = self.I(SMA, price, self.shortWindow)
		self.ma2 = self.I(SMA, price, self.longWindow)
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
		initialInvestment = int(request.GET.get('initialInvestment'))
		shortWindow = int(request.GET.get('shortWindow'))
		longWindow = int(request.GET.get('longWindow'))

		try:
            # Fetch data
			# tickerObj = yfin.Ticker(ticker)
			# data1 = tickerObj.history(start=startDate, end=endDate)
			# data1.to_csv(f'fetchfinancialdata/test.csv')
			data = pd.read_csv(f'fetchfinancialdata/YahooFinanceData/{ticker}-2024.csv')
			data.index = pd.DatetimeIndex(data['Date'], tz='UTC')

			# Run backtest
			backtest = Backtest(data, SMAStrategy, cash=initialInvestment, commission=.002, exclusive_orders=True)
			stats = backtest.run(shortWindow=shortWindow, longWindow=longWindow).to_dict()
			del stats['_equity_curve']
			del stats['_trades']

			stats_dict = {}
			for key, value in stats.items():
				if pd.isna(value):
					stats_dict[key] = None
				elif isinstance(value, pd.Timestamp):
					stats_dict[key] = value.to_pydatetime().isoformat()
				elif isinstance(value, pd.Timedelta):
					stats_dict[key] = str(value)
				elif isinstance(value, (int, float, str, bool, list, dict)):
					stats_dict[key] = value  # No conversion needed
				elif isinstance(value, dt.datetime):
					stats_dict[key] = value.isoformat()
				elif isinstance(value, np.float64):
					stats_dict[key] = float(value)
				elif isinstance(value, np.int64):
					stats_dict[key] = int(value)
				else:
					stats_dict[key] = str(value)  # Fallback for unknown types

			# Optional: Save or process plot
			# backtest.plot()  # Comment/remove this line for API-only behavior

			return Response(stats_dict, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
