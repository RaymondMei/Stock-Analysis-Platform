from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
import os
import pandas as pd

class GetStockHistoryAPITests(APITestCase):
    def setUp(self):
        self.url = reverse('stockhistory')  # Adjust the URL name as per your URL configuration
        self.ticker = "AAPL"
        self.invalid_ticker = "INVALID"
        self.csv_path = f'fetchfinancialdata/YahooFinanceData/{self.ticker}-2024.csv'
        
        # Create a sample CSV file for testing
        data = {
            "Date": ["2024-01-01", "2024-01-02"],
            "Open": [100, 110],
            "High": [110, 120],
            "Low": [90, 100],
            "Close": [105, 115],
            "Volume": [1000, 1500]
        }
        df = pd.DataFrame(data)
        os.makedirs(os.path.dirname(self.csv_path), exist_ok=True)
        df.to_csv(self.csv_path, index=False)

    def tearDown(self):
        # Remove the sample CSV file after tests
        if os.path.exists(self.csv_path):
            os.remove(self.csv_path)

    def test_get_stock_history_success(self):
        response = self.client.get(self.url, {'ticker': self.ticker})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('2024-01-01', response.data)
        self.assertIn('2024-01-02', response.data)

    def test_get_stock_history_invalid_ticker(self):
        response = self.client.get(self.url, {'ticker': self.invalid_ticker})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    def test_get_stock_history_missing_ticker(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)