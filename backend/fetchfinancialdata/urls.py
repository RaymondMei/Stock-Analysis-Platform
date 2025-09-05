from django.urls import path
from .views import getStockHistory, getStockResults, getStockQuote
from graphene_django.views import GraphQLView
from .schema import schema

urlpatterns = [
	path('stockhistory', view=getStockHistory, name='stockhistory'),
	path('stockresults', view=getStockResults, name='stockresults'),
	path('stockquote', view=getStockQuote, name='stockquote'),
	path('stockhistory/graphql', GraphQLView.as_view(graphiql=True, schema=schema)),
]