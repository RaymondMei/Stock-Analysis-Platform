import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class BacktestAPITests(APITestCase):
    def setUp(self):
        self.url = reverse('simpleMovingAverage')  # Adjust the URL name as per your URL configuration

    def test_backtest_success(self):
        data = {
            "ticker": "AAPL",
            "initialInvestment": 1000,
            "shortWindow": 10,
            "longWindow": 20,
            "startDate": "2023-01-01",
            "endDate": "2023-12-31"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Start', response.data)
        self.assertIn('End', response.data)
        self.assertIn('Return [%]', response.data)

    def test_backtest_invalid_ticker(self):
        data = {
            "ticker": "INVALID",
            "initialInvestment": 1000,
            "shortWindow": 10,
            "longWindow": 20,
            "startDate": "2023-01-01",
            "endDate": "2023-12-31"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_backtest_missing_parameters(self):
        data = {
            "ticker": "AAPL",
            "initialInvestment": 1000,
            "shortWindow": 10,
            "longWindow": 20
            # Missing startDate and endDate
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)