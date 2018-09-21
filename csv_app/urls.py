from django.conf.urls import url
from . import views

#from csv_app.views import ToDoView

urlpatterns = [
    #url(r'^$', views.list_person, name='list_person'),
    url(r'^my_data/$', views.my_data_serialize, name = 'my_data_serialize'),
    #url(r'^get_exons/$', views.get_exons_locations, name = 'get_exons'),
    #url(r'^get_utrs/$', views.get_utr_locations, name = 'get_utrs'),
    #url(r'^basic/$', views.basic_view, name = 'basic_view'),
    #url(r'^api/',ToDoView.as_view()),
    #url(r'^ajax/$', views.ajax, name = 'ajax'),
    #url(r'^index2/$', views.index_view, name = 'index2'),
    #url(r'^create_post/$', views.create_post, name='create_post'),
    #url(r'^index4/$', views.index4, name = 'index4'),
    #url(r'^show_data/$', views.show_data, name = 'show_data'),
    #url(r'^extra_data/$', views.extra_data, name = 'extra_data'),
    url(r'^home/$', views.home, name = 'home'),
    url(r'^help/$', views.help, name = 'help'),
    #url(r'^chromo/$', views.chromo, name = 'chromo'),
    #url(r'^demo/$', views.demo, name = 'demo'),
    url(r'^data_search/$', views.data_search, name = 'data_search'),




    #url(r'^json/api/',ToDoView.as_view()),

]
