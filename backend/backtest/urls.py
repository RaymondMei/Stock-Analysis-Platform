from django.urls import path
from .views import backtest

urlpatterns = [
	path('backtest', view=backtest, name='backtest'),
]