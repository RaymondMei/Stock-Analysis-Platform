from django.shortcuts import render
from django.http import HttpResponse, request, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
from decouple import config
import json
import pandas as pd
import numpy as np
import yfinance as yfin
from datetime import datetime as dt

# Create your views here.
def index(request):
	return render(request, 'getstockdata.html')
	# return HttpResponse("Hello, world. You're at the fetchfinancialdata index.")

@api_view(['GET'])
def getstockdata(request):
	if request.method == 'GET':
		ticker = request.GET['ticker']
		print(ticker)
		# result = requests.get(f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={config("ALPHAVANTAGE_API_KEY")}')
		# print(json.loads(result.content)['Time Series (Daily)'].items())
		# resultJson= json.loads(result.content)
		# for k, v in resultJson['Time Series (Daily)'].items():
		# 	resultJson['Time Series (Daily)'][k] = {'open': v['1. open'], 'high': v['2. high'], 'low': v['3. low'], 'close': v['4. close'], 'volume': v['5. volume']}
		# print(resultJson['Time Series (Daily)'])
		
		# testdata = yfin.Ticker(ticker).history(start="2024-1-1", end="2024-12-31")
		# testdata = pd.read_csv('fetchfinancialdata/teststockdata.csv')
		# # testdata.to_csv('fetchfinancialdata/teststockdata.csv')
		# testdata = testdata.to_json(orient='index')
		# print(testdata)
		# with open("fetchfinancialdata/teststockdata2.json", "w") as outfile:
		# 	json.dump(json.loads(testdata), outfile, indent=4)

		# with open('fetchfinancialdata/teststockdata2.json', 'r') as infile:
		# 	data = json.load(infile)
		# resultJson = data

		# with open("fetchfinancialdata/teststockdata2.json", "w") as outfile:
		# 	json.dump(json.load(resultJson), outfile, indent=4)
		
		# newdata = {}
		# for v in testdata.values():
		# 	newdata[v['Date']] = {'open': v['Open'], 'high': v['High'], 'low': v['Low'], 'close': v['Close'], 'volume': v['Volume']}
		
		# with open("fetchfinancialdata/teststockdata3.json", "w") as outfile:
		# 	json.dump(newdata, outfile, indent=4)

		with open('fetchfinancialdata/teststockdata3.json', 'r') as file:
			testdata = json.load(file)
		
		newdata = {}
		for k, v in testdata.items():
			newdata[dt.strptime(k, "%Y-%m-%d %H:%M:%S%z").date().isoformat()] = {'open': v['open'], 'high': v['high'], 'low': v['low'], 'close': v['close'], 'volume': v['volume']}

		with open("fetchfinancialdata/teststockdata4.json", "w") as outfile:
			json.dump(newdata, outfile, indent=4)


		return Response(testdata, status=status.HTTP_200_OK)
		# return render(request, 'displaystockdata.html', {'title': ticker, 'data': resultJson['Time Series (Daily)']})
