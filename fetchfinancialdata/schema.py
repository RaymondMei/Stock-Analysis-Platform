import graphene
from graphene_django.types import DjangoObjectType

from .models import StockData

class StockType(DjangoObjectType):
	class Meta:
		model = StockData
		fields = '__all__'

class Query(graphene.ObjectType):
	stocks = graphene.List(StockType)

	def resolve_stocks(self, info):
		return StockData.objects.all()

schema = graphene.Schema(query=Query)