from django.shortcuts import render
from django.http import HttpResponse, request
from rest_framework.decorators import api_view
import requests
from decouple import config
import json
import pandas as pd
import numpy as np

# Create your views here.
def index(request):
	return render(request, 'getstockdata.html')
	# return HttpResponse("Hello, world. You're at the fetchfinancialdata index.")

@api_view(['GET'])
def getstockdata(request):
	if request.method == 'GET':
		symbol = request.GET['stock-symbol']
		print(symbol)
		# result = requests.get(f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={config("ALPHAVANTAGE_API_KEY")}')
		# print(json.loads(result.content)['Time Series (Daily)'].items())
		# resultJson= json.loads(result.content)
		# for k, v in resultJson['Time Series (Daily)'].items():
		# 	resultJson['Time Series (Daily)'][k] = {'open': v['1. open'], 'high': v['2. high'], 'low': v['3. low'], 'close': v['4. close'], 'volume': v['5. volume']}
		# print(resultJson['Time Series (Daily)'])
		with open('fetchfinancialdata/teststockdata.json', 'r') as file:
			data = json.load(file)
		resultJson = data

		return render(request, 'displaystockdata.html', {'title': symbol, 'data': resultJson['Time Series (Daily)']})

@api_view(['GET'])
def backtest(request):
	if request.method == 'GET':
		# symbol = request.GET.get('stock-symbol')
		initial_investment = float(request.GET.get('initial-investment'))
		short_window = int(request.GET.get('short-window'))
		long_window = int(request.GET.get('long-window'))

		with open('fetchfinancialdata/teststockdata.json', 'r') as file:
			data = json.load(file)
		resultJson = data

		df = pd.DataFrame.from_dict(resultJson['Time Series (Daily)'], orient='index')
		df = df.astype(float)
		df.index = pd.to_datetime(df.index)
		df = df.sort_index()

		df['short_mavg'] = df['close'].rolling(window=short_window, min_periods=1).mean()
		df['long_mavg'] = df['close'].rolling(window=long_window, min_periods=1).mean()

		# Implement the trading strategy
		df['signal'] = 0
		df['signal'][short_window:] = np.where(df['short_mavg'][short_window:] > df['long_mavg'][short_window:], 1, 0)
		df['positions'] = df['signal'].diff()

		# Backtest the strategy
		portfolio = pd.DataFrame(index=df.index)
		portfolio['holdings'] = df['close'] * df['signal']
		portfolio['cash'] = initial_investment - (df['close'] * df['positions']).cumsum()
		portfolio['total'] = portfolio['holdings'] + portfolio['cash']
		portfolio['returns'] = portfolio['total'].pct_change()

		# Calculate performance metrics
		total_return = portfolio['total'][-1] - initial_investment
		max_drawdown = (portfolio['total'].cummax() - portfolio['total']).max()
		num_trades = df['positions'].abs().sum()

		performance_summary = {
			'total_return': total_return,
			'max_drawdown': max_drawdown,
			'num_trades': num_trades
		}

		return HttpResponse(performance_summary)