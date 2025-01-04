from django.urls import path
from .views import simpleMovingAverage

urlpatterns = [
	# path('backtest', view=backtest, name='backtest'),
	path('simplemovingaverage', view=simpleMovingAverage, name='simpleMovingAverage'),
]