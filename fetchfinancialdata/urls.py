from django.urls import path
from .views import index, getstockdata

urlpatterns = [
	path('', view=index, name='index'),
	path('getstockdata', view=getstockdata, name='getstockdata'),
]