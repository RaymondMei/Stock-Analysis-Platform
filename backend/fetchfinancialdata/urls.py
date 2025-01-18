from django.urls import path
from .views import getStockHistory
from graphene_django.views import GraphQLView
from .schema import schema

urlpatterns = [
	path('stockhistory', view=getStockHistory, name='stockhistory'),
	path('stockhistory/graphql', GraphQLView.as_view(graphiql=True, schema=schema)),
]