from django.db import models

# Create your models here.
class StockData(models.Model):
	symbol = models.CharField(max_length=10)
	open = models.FloatField()
	high = models.FloatField()
	low = models.FloatField()
	close = models.FloatField()
	volume = models.FloatField()
	date = models.DateField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	
	def __str__(self):
		return self.symbol