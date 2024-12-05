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
