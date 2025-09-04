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
