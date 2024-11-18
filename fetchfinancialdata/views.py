from django.shortcuts import render
from django.http import HttpResponse, request
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
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
		df['id'] = range(1, len(df)+1)
		df[['id'] + [x for x in df.columns if x != 'id']]
		df.set_index('id')

		df['short_mavg'] = df['close'].rolling(window=short_window, min_periods=1).mean()
		df['long_mavg'] = df['close'].rolling(window=long_window, min_periods=1).mean()

		# Implement the trading strategy
		df['signal'] = np.where(df['close'] > df['long_mavg'], 1, 0)
		df['positions'] = df['signal'].diff()
		df.at[df.index[0], 'positions'] = 0

		prev_quantity = 0
		prev_closing = initial_investment
		for i, row in df.iterrows():

			if row['positions'] == 1: # buy
				new_quantity = prev_closing / row['close']
				new_closing = 0
			elif row['positions'] == -1: # sell
				new_quantity = 0
				new_closing = prev_quantity * row['close']
			else:
				new_quantity = prev_quantity
				new_closing = prev_closing
			
			df.at[i, 'quantity'] = new_quantity
			df.at[i, 'closing cash'] = new_closing
			
			prev_quantity = new_quantity
			prev_closing = new_closing

		# Backtest the strategy
		# portfolio = pd.DataFrame(index=df.index)
		# portfolio['holdings'] = df['close'] * df['signal']
		# portfolio['cash'] = initial_investment - (df['close'] * df['positions']).cumsum()
		# portfolio['total'] = portfolio['holdings'] + portfolio['cash']
		# portfolio['returns'] = portfolio['total'].pct_change()

		# # Calculate performance metrics
		# total_return = portfolio['total'][-1] - initial_investment
		# max_drawdown = (portfolio['total'].cummax() - portfolio['total']).max()
		# num_trades = df['positions'].abs().sum()

		# performance_summary = {
		# 	'total_return': total_return,
		# 	'max_drawdown': max_drawdown,
		# 	'num_trades': num_trades
		# }

		total_return = df['closing cash'].iloc[-1] + df['quantity'].iloc[-1] * df['close'].iloc[-1] - initial_investment

		print(total_return)

		performance_summary = {
			'total_return': total_return
		}

		return Response(performance_summary, status=status.HTTP_200_OK)