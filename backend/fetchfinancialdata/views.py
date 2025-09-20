from django.shortcuts import render
from django.http import HttpResponse, request, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
import json
import pandas as pd
import numpy as np
import yfinance as yfin
from datetime import datetime as dt
import time
import random
import warnings

# Configure yfinance for better reliability (new in 0.2.66)
import yfinance as yf
yf.set_tz_cache_location("custom/cache/location")  # Optional: set custom cache location
warnings.filterwarnings("ignore", category=FutureWarning)  # Suppress pandas warnings

def is_valid_ticker(info_dict):
	if not info_dict or len(info_dict) <= 1:
		return False
	
	required_fields = ['symbol', 'longName', 'regularMarketPrice']
	if any(field not in info_dict for field in required_fields):
		return False
	
	return True

@api_view(['GET'])
def getStockHistory(request):
	if request.method == 'GET':
		ticker = request.GET['ticker']
		
		try:
			# Fetch data from Yahoo Finance
			data = []
			cached = True
			try:
				data = pd.read_csv(f'fetchfinancialdata/YahooFinanceData/{ticker}-2024.csv')
				cached = True
			except FileNotFoundError: 
				data = yfin.Ticker(ticker).history(start="2024-1-1", end="2024-12-31")
				cached = False

			if len(data) <= 0:
				raise FileNotFoundError
			
			data.to_csv(f'fetchfinancialdata/YahooFinanceData/{ticker}-2024.csv')

			data = data.to_json(orient='index')
			data = json.loads(data)

			dateFormattedData = {}
			for k, v in data.items():
				if cached:
					# if reading from csv:
					dateFormattedData[dt.strptime(v['Date'], "%Y-%m-%d %H:%M:%S%z").date().isoformat()] = {'open': v['Open'], 'high': v['High'], 'low': v['Low'], 'close': v['Close'], 'volume': v['Volume']}
				else:
					# if reading from yfinance:
					dateFormattedData[dt.fromtimestamp(int(k) / 1000).date().isoformat()] = {'open': v['Open'], 'high': v['High'], 'low': v['Low'], 'close': v['Close'], 'volume': v['Volume']}

			if not cached:
				with open(f'fetchfinancialdata/YahooFinanceData/{ticker}-2024.json', 'w') as file:
					json.dump(dateFormattedData, file, indent=4)

			return Response(dateFormattedData, status=status.HTTP_200_OK)
		except FileNotFoundError:
			return Response({'error': 'Data not found'}, status=status.HTTP_404_NOT_FOUND)


def getStockResults(request):
	query = request.GET.get('query', '')
	print(f"Searching for: {query}")
	if not query:
		return JsonResponse({'error': 'Query parameter required'}, status=400)

	try:
		ticker = yfin.Ticker(query.upper())
		info = ticker.info
		print('ticker:', ticker.info)
		
		if is_valid_ticker(info):
			return JsonResponse({
				'results': [{
					'symbol': info.get('symbol', query.upper()),
					'name': info.get('longName', info.get('shortName', '')),
					'type': 'Equity',
					'region': info.get('country', ''),
					'currency': info.get('currency', ''),
				}]
			})
		else:
			return JsonResponse({'error': f'Invalid ticker symbol \"{query.upper()}\"'}, status=404)
			
	except Exception as e:
		print(f"Exception occurred: {e}")
		return JsonResponse({'error': str(e)}, status=500)
	

def getStockQuote(request):
	query = request.GET.get('query', '')
	print(f"Getting quote for: {query}")
	if not query:
		return JsonResponse({'error': 'Query parameter required'}, status=400)

	try:
		ticker = yfin.Ticker(query.upper())
		info = ticker.info
		print('ticker:', ticker.info)
		
		if is_valid_ticker(info):
			return JsonResponse({
				'quote': {
					'symbol': info.get('symbol', query.upper()),
					'name': info.get('longName', info.get('shortName', '')),
					'price': info.get('regularMarketPrice', 0.0),
					'change': info.get('regularMarketChange', 0.0),
					'percent_change': info.get('regularMarketChangePercent', 0.0),
					'volume': info.get('regularMarketVolume', 0),
					'marketCap': info.get('marketCap', 0),
					'time': dt.fromtimestamp(info.get('regularMarketTime', 0)).isoformat() if info.get('regularMarketTime') else '',
				}
			})
		else:
			return JsonResponse({'error': f'Invalid ticker symbol \"{query.upper()}\"'}, status=404)
			
	except Exception as e:
		print(f"Exception occurred: {e}")
		return JsonResponse({'error': str(e)}, status=500)
	
def getStockHistoricalData(request):
	symbol = request.GET.get('symbol', '')
	period = request.GET.get('period', '1mo')  # Default to 1 month
	print(f"Getting historical data for: {symbol} over period: {period}")
	if not symbol:
		return JsonResponse({'error': 'Symbol parameter required'}, status=400)
	try:
		ticker = yfin.Ticker(symbol.upper())
		history = ticker.history(period=period)
		if history.empty:
			return JsonResponse({'error': f'No historical data found for symbol \"{symbol.upper()}\"'}, status=404)
		
		history.reset_index(inplace=True)
		history['Date'] = history['Date'].dt.strftime('%Y-%m-%d')
		
		# Rename columns to lowercase
		history.columns = history.columns.str.lower()
		historical_data = history[['date', 'open', 'high', 'low', 'close', 'volume']].to_dict(orient='records')

		return JsonResponse({'historical_data': historical_data})
	except Exception as e:
		print(f"Exception occurred: {e}")
		return JsonResponse({'error': str(e)}, status=500)