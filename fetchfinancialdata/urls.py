from django.urls import path
from .views import index, getstockdata, backtest

urlpatterns = [
	path('', view=index, name='index'),
	path('getstockdata', view=getstockdata, name='getstockdata'),
	path('backtest', view=backtest, name='backtest'),
]