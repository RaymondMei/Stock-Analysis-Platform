from django import forms

class StockDataForm(forms.Form):
	symbol = forms.CharField(max_length=5)

	def __str__(self):
		return self.symbol