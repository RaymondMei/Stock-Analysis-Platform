from django.urls import path
from .views import generatePDF

urlpatterns = [
	path('generatePDF', view=generatePDF, name='generatePDF'),
]