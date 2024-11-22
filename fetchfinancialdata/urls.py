from django.urls import path
from .views import index, getstockdata
from graphene_django.views import GraphQLView
from .schema import schema

urlpatterns = [
	path('', view=index, name='index'),
	path('getstockdata', view=getstockdata, name='getstockdata'),
	path('getstockdata/graphql', GraphQLView.as_view(graphiql=True, schema=schema)),
]