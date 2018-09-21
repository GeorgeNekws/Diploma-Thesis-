# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json
from django.core import serializers
import models
from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.urls import reverse
from csv_app.models import Interaction,Annotation,MyInteraction,MyChromosome,Transcr_extra_info
from csv_app.forms import SpeciesSelectionForm
from django.db.models import Q
import operator
#from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response

from django.http import HttpResponse, JsonResponse
#from rest_framework.renderers import JSONRenderer

from csv_app.serializers import ToDoSerializer,MyInteractionSerializer,AnnotationSerializer,InteractionSerializer
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view
import requests

#######################################################################################################################
def get_bind_site_choices():
    choices = ['']
    for choice in Interaction.BIND_SITE_CHOICES:
        choices.append(choice[0])
    return choices

def get_species_choices():
    choices = ['']
    for choice in Interaction.SPECIES_CHOICES:
        choices.append(choice[0])
    return choices

def get_bind_type_choices():
    choices = ['']
    for choice in Interaction.BIND_TYPE_CHOICES:
        choices.append(choice[0])
    return choices
#######################################################################################################################

@csrf_protect
def home(request):
    bind_site_list = get_bind_site_choices()
    species_list = get_species_choices()
    bind_types_list = get_bind_type_choices()

    args = {'bind_sites' : bind_site_list,
            'species' : species_list,
            'bind_types_list' : bind_types_list,
            }
    return render(request, 'csv_app/home2.html', args)

#######################################################################################################################
#default values:
    #score = 0.85
    #species = all
    #bind site = both UTR3 and CDS
    #bind type = all (6mer, 7mer, ...)

# auto diaxeirizetai mono gia user_input = transcript
def my_data_serialize(request):         #this view returns JSON data
    if request.is_ajax():
        print "AJJJJJJJJJAAAAAAAAAAAAXXXXXXXXXXXXXX"
    #q_search = request.GET.get('q_search') #xrisi me s2.js , s3.js , me p5.js
    q_search = request.POST.get('the_transcript') #xrisi me s4.js me ajax
    q_score = request.POST.get('the_score')
    q_site = request.POST.get('the_site')
    q_num_conserved = request.POST.get('the_num_of_conserved')
    q_species = request.POST.getlist('the_species[]')
    q_bind_types = request.POST.getlist('the_bind_types[]')


    ######### TEST PRINTS ###############
    print "BLAH BLAH BLAH BLAH BLAH BLAH BLAH"
    print q_search
    print q_score
    print q_site
    print q_species
    print type(q_species)
    print q_bind_types
    print q_num_conserved
    print type(q_num_conserved)

    #######################################

    if q_search:    # if transcript_id is given by user ,then ......

        #(1)########### for "species" checkbox choices ###########
        ### if "species" not specified , by default all species are searched ( Q() )###
        species = Q()
        if q_species:
            for sp in q_species:
                species |= Q(species__icontains = sp)
        print species


        #(2)########### for "bind type" checkbox choices ###########
        ### if "bind types" not specified , by default all species are searched ( Q() )###
        bind_types = Q()
        if q_bind_types:
            for bt in q_bind_types:
                bind_types |= Q(bind_type__icontains = bt)
        print bind_types


        #(3)########### check if q_score is given , else give a default value ###########
        if not q_score:
            q_score = '0.85'  #default search value , na valw kai ena mnm pou 8a fainetai i default timi sto xristi


        #(4)############## if bind_site is not specified , search both UTR3 and CDS ############
        site = Q()
        if not q_site:
            site = Q(bind_site__icontains = "CDS") | Q(bind_site__icontains = "UTR3")
        else:
            site = Q(bind_site__icontains = q_site)
        print site

        #(5)############## if number of conserved species not specified ,search all ############
        #kati den paei kala edw nomizw , alla tre3tw gia na sigoureuteis prwta
        #stin periptwsi pou den dinei tpt o xristis stin entoli regex_pattern to q_num_conserved einai 0 ara den vgazei tpt
        if not q_num_conserved:
            q_num_conserved = 0 #result even if none species is conserved
        else:
            q_num_conserved = int(q_num_conserved) - 1
            print type(q_num_conserved)
        regex_pattern = "(\w+\,){" + str(q_num_conserved) + ",}"


        #0. Find all microRNAs that bind to the given transcript
        queryset_list = Interaction.objects.filter(species, site, bind_types,
            Q(transcript_id__icontains = q_search) , score__gte = q_score , species__regex=regex_pattern
        ).values('mirna_conn__mirna_sequence', 'mirna_conn__mirna_id', 'chromosome', 'bind_start',\
         'bind_stop', 'mirna_name', 'gene_id', 'transcript_id' , 'bind_site',\
         'score', 'strand', 'relative_bind_start', 'relative_bind_stop',\
         'num_species_conserved', 'species', 'bind_type')
        print "HEY YI"
        print type(queryset_list)

        #TOdo ta #1 kai #2 mporoun na sinxwneutoun se ena query kapws etsi, me titlo:
        #Find all the transcript info like start,stop,name and also gene id
        # q0 = Annotation.objects.filter(
        #    Q(a_type = 'transcript', transcript_id__icontains = q_search)
        #).values('start','stop','gene_id','transcript_name')
        #mydict = q0[0]
        #print mydict.get('start')
        #print mydict.get('gene_id')

        #1. Find the gene ID , using the transcript ID
        geneID = Annotation.objects.filter(
            Q(transcript_id__icontains = q_search, a_type = 'transcript')
        ).values('gene_id')

        id_gene =  geneID[0].get('gene_id')

        #2. Find the transcript start and stop positions
        q1 = Annotation.objects.filter(
            Q(a_type = 'transcript', transcript_id__icontains = q_search)
        ).values('start','stop')

        mydict = q1[0]
        print mydict
        #print mydict.values()[0]
        #print mydict.get('start')
        #print mydict['stop']

        #3. Find all the gene info like : gene start and stop positions , gene name based on #1 query
        q2 = Annotation.objects.filter(
            Q(gene_id = id_gene , a_type = 'gene')
        ).values('a_type', 'start', 'stop', 'chromosome', 'gene_name', 'strand')

        mydict2 = q2[0]
        print mydict2
        print '\n'

        print "PRINTARWWWWWWWWWWWWWWWWWWWWWWWWW"
        chromo = mydict2['chromosome']
        print mydict2['chromosome']

        q3 = MyChromosome.objects.filter(
            Q(chromosome_num = chromo)
        ).values('chromosome_num', 'arm', 'band', 'iscn_start', 'iscn_stop', 'bp_start', 'bp_stop', 'stain', 'density')

        print "DICT 33333333333333"
        print list(q3)

        #serializer = AnnotationSerializer(queryset_list, many=True)
        #return JsonResponse(serializer.data, safe=False)

        args = {
            'transcript_start' : mydict.values()[0],
            'transcript_stop' : mydict.values()[1],
            'a_type' : mydict2.get('a_type'),
            'gene_start' : mydict2.get('start'),
            'gene_stop' : mydict2.get('stop'),
            'gene_chromosome' : mydict2.get('chromosome'),
            'gene_identifier' : id_gene,
            'gene_name' : mydict2.get('gene_name'),
            'gene_strand' : mydict2.get('strand'),
        }


        q = list(queryset_list)

        q.insert(0,args)
        q.insert(1,list(q3))
        #print "BOY"
        #print q
        #                               args    chromosome    mirnas(queryset_list)
        #list : q has a format like q= [{} , [{},{},{},{}] , {},{},{}..... ]

        #serializer = InteractionSerializer(queryset_list, many=True)
        #return render(request, 'csv_app/index4.html', {'data': serializer.data})  #it works ,if you use it ,change action="/csv_app/show_data --> my_data/" in index4.html

        return JsonResponse(q,safe=False)

        #return Response(serializer.data)

    else:
        return HttpResponse("Text only, please.", content_type="text/plain")
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )



#######################################################################################################################
def data_search(request):
    q_search = request.POST.get('user_data')
    data_type = request.POST.get('user_data_type')

    if data_type == 'gene':
        #call gene_function
        pass
    elif data_type == 'transcript':
        #call transcript_function
        q = transcript_input_manipulation(q_search)
        return JsonResponse(q,safe=False)
    else: # data_type == mirna
        #q = mirna_input_manipulation(q_search)
        #call mirna_function
        pass


def transcript_input_manipulation(transcript):
    #(1)########### for "species" checkbox choices ###########
    ### if "species" not specified , by default all species are searched ( Q() )###
    #species = Q()
    #if q_species:
    #    for sp in q_species:
    #        species |= Q(species__icontains = sp)
    #print species


    #(2)########### for "bind type" checkbox choices ###########
    ### if "bind types" not specified , by default all species are searched ( Q() )###
    #bind_types = Q()
    #if q_bind_types:
    #    for bt in q_bind_types:
    #        bind_types |= Q(bind_type__icontains = bt)
    #print bind_types
    bind_types = Q(bind_site__icontains = "CDS") | Q(bind_site__icontains = "UTR3") #DEFAULT VALUE


    #(3)########### check if q_score is given , else give a default value ###########
    #if not q_score:
    q_score = '0.85'  #default search value , na valw kai ena mnm pou 8a fainetai i default timi sto xristi


    #(4)############## if bind_site is not specified , search both UTR3 and CDS ############
    #site = Q()
    #if not q_site:
    site = Q(bind_type__icontains = "7mer") | Q(bind_type__icontains = "8mer") | Q(bind_type__icontains = "9mer") | Q(bind_type__icontains = "8mer+mismatch") | Q(bind_type__icontains = "8mer+wobble") #DEFAULT VALUE
    #else:
        #site = Q(bind_site__icontains = q_site)
    #print site

    #(5)############## if number of conserved species not specified ,search all ############
    #kati den paei kala edw nomizw , alla tre3tw gia na sigoureuteis prwta
    #stin periptwsi pou den dinei tpt o xristis stin entoli regex_pattern to q_num_conserved einai 0 ara den vgazei tpt
    #if not q_num_conserved:
        #q_num_conserved = 0 #result even if none species is conserved
    #else:
        #q_num_conserved = int(q_num_conserved) - 1
        #print type(q_num_conserved)
    #regex_pattern = "(\w+\,){" + str(q_num_conserved) + ",}"


    queryset_list = Interaction.objects.filter(site, bind_types,
        Q(transcript_id__icontains = transcript) , score__gte = q_score
    ).values('mirna_conn__mirna_sequence', 'mirna_conn__mirna_id', 'chromosome', 'bind_start',\
     'bind_stop', 'mirna_name', 'gene_id', 'transcript_id' , 'bind_site',\
     'score', 'strand', 'relative_bind_start', 'relative_bind_stop',\
     'num_species_conserved', 'species', 'bind_type')

    print queryset_list

     #TOdo ta #1 kai #2 mporoun na sinxwneutoun se ena query kapws etsi, me titlo:
     #Find all the transcript info like start,stop,transcript name and also gene ID ,using the transcript ID
    q1 = Annotation.objects.filter(
        Q(a_type = 'transcript', transcript_id__icontains = transcript)
    ).values('start','stop','gene_id','transcript_name')
    mydict = q1[0]
     #print mydict.get('start')
     #print mydict.get('gene_id')
     #print mydict['start']

     #1. Find the gene ID , using the transcript ID
     #geneID = Annotation.objects.filter(
    #     Q(transcript_id__icontains = q_search, a_type = 'transcript')
     #).values('gene_id')

    id_gene =  mydict['gene_id']

     #2. Find the transcript start and stop positions
     #q1 = Annotation.objects.filter(
    #     Q(a_type = 'transcript', transcript_id__icontains = q_search)
     #).values('start','stop')

     #mydict = q1[0]
    # print mydict
     #print mydict.values()[0]
     #print mydict.get('start')
     #print mydict['stop']

     #3. Find all the gene info like : gene start and stop positions , gene name based on #1 query
    q2 = Annotation.objects.filter(
        Q(gene_id = id_gene , a_type = 'gene')
    ).values('a_type', 'start', 'stop', 'chromosome', 'gene_name', 'strand')

    mydict2 = q2[0]
    #print mydict2
    #print '\n'

    #print "PRINTARWWWWWWWWWWWWWWWWWWWWWWWWW"
    chromo = mydict2['chromosome']
    #print mydict2['chromosome']

    q3 = MyChromosome.objects.filter(
        Q(chromosome_num = chromo)
    ).values('chromosome_num', 'arm', 'band', 'iscn_start', 'iscn_stop', 'bp_start', 'bp_stop', 'stain', 'density')

    print "DICT 33333333333333"
    print list(q3)

    #.values = Retrieve values as a dictionary
    #.values_list =  Retrieve values as a tuple
    q4 = Transcr_extra_info.objects.filter(
        Q(transcr_id__icontains = transcript)
    ).values('exon_chr_start','exon_chr_stop','five_utr_start','five_utr_stop','three_utr_start','three_utr_stop','genomic_coding_start','genomic_coding_stop', 'transcr_start', 'transcr_stop','strand')
    #mydict3 = q4[0]
    #print q4
    transcr_extra_info = list(q4)
    print transcr_extra_info

     #serializer = AnnotationSerializer(queryset_list, many=True)
     #return JsonResponse(serializer.data, safe=False)

    args = {
        'transcript_start' : mydict['start'],
        'transcript_stop' : mydict['stop'],
        'a_type' : mydict2.get('a_type'),
        'gene_start' : mydict2.get('start'),
        'gene_stop' : mydict2.get('stop'),
        'gene_chromosome' : mydict2.get('chromosome'),
        'gene_identifier' : id_gene,
        'gene_name' : mydict2.get('gene_name'),
        'gene_strand' : mydict2.get('strand'),
    }

    q = list(queryset_list)

    q.insert(0,args)
    q.insert(1,list(q3)) #chromosome info append to returned data list
    q.insert(2,list(q4)) #5'utr, 3'utr, cds, exon ... info append to returned data list

     #print "BOY"
     #print q
     #                               args    chromosome    mirnas(queryset_list)
     #list : q has a format like q= [{} , [{},{},{},{}] , {},{},{}..... ]

     #serializer = InteractionSerializer(queryset_list, many=True)
     #return render(request, 'csv_app/index4.html', {'data': serializer.data})  #it works ,if you use it ,change action="/csv_app/show_data --> my_data/" in index4.html

    #return JsonResponse(q,safe=False)
    return q
#######################################################################################################################
#######################################################################################################################
#######################################################################################################################
#######################################################################################################################
#######################################################################################################################






def get_exons_locations(request):
    if request.is_ajax():
        print '----- Inside get_exons_locations function -----'
        q_transcript = request.POST.get('the_transcript')

        print q_transcript

        #4. Find the exon regions regions of the given transcript
        # UWAGA !!!! exon regions may be the same as UTR regions ask DIMITRA what to do
        q1 = Annotation.objects.filter(
            Q(transcript_id__icontains = q_transcript, a_type = 'exon')
        ).values('start', 'stop', 'exon_id')

        exons_list = list(q1)
        print q1
        print exons_list

        return JsonResponse(exons_list,safe=False)

    else:
        return HttpResponse("Text only, please.", content_type="text/plain")
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )


#######################################################################################################################


def get_utr_locations(request):
    if request.is_ajax():
        print '----- Inside get_utr_locations function -----'
        q_transcript = request.POST.get('the_transcript')

        print q_transcript

        #4. Find the utr regions regions of the given transcript
        # UWAGA !!!! exon regions may be the same as UTR regions ask DIMITRA what to do
        q1 = Annotation.objects.filter(
            Q(transcript_id__icontains = q_transcript, a_type = 'UTR')
        ).values('start', 'stop')

        utr_list = list(q1)
        print q1
        print utr_list

        return JsonResponse(utr_list,safe=False)

    else:
        return HttpResponse("Text only, please.", content_type="text/plain")
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )
#######################################################################################################################


@csrf_protect
def index_view(request):
    bind_site_list = get_bind_site_choices()
    species_list = get_species_choices()
    bind_types_list = get_bind_type_choices()

    if request.method == 'POST':# na vgalw thn FORMA den tin xreiazomai
        form2 = SpeciesSelectionForm(request.POST)

    else:
        form2 = SpeciesSelectionForm()

        args = {'bind_sites' : bind_site_list,
                'species' : species_list,
                'bind_types_list' : bind_types_list,
                'form2' : form2,
                }
    return render(request, 'csv_app/index2.html', args)


@csrf_protect
@api_view(['GET', 'POST', ])
def create_post(request):
    if request.method == 'POST':
        post_text = request.POST.get('the_post')

        queryset_list = MyInteraction.objects.filter(
                Q(transcript_id__icontains = post_text)
        )

        serializer = MyInteractionSerializer(queryset_list , many=True)
        return Response(serializer.data) # to work ,it needs @api_view decorator


        #return JsonResponse(serializer.data, safe=False)   Also WORKS

        #qs_json = serializers.serialize('json', queryset_list)
        #return HttpResponse(
        #    qs_json,
        #    content_type="application/json"
        #)
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )



#######################################################################################################################
def chromo(request):
    return render(request,'csv_app/chromosome.html')

def demo(request):
    return render(request,'csv_app/demo.html')


#######################################################################################################################

#@api_view(['GET'])
#@renderer_classes((JSONRenderer,))

def ajax(request):
    q_search = request.POST.get('q_search')

    if q_search:
        queryset_list = MyInteraction.objects.filter(
            Q(transcript_id__icontains = q_search)
        )
    else:
        queryset_list = MyInteraction.objects.all()[:3]

        serializer = MyInteractionSerializer(queryset_list , many=True)

    return Response(serializer.data)

#######################################################################################################################

class ToDoView(APIView):
    def get(self,request): #this is a django REST framework 'request object' in parameters
        #inters = MyInteraction.objects.all()
        #serializer = MyInteractionSerializer(inters , many=True)
        #return Response(serializer.data)

        #if request.method == 'GET':
        return render(request, 'csv_app/new1.html')

    def post(self,request):
        q_search = request.POST.get('q_search')

        if q_search:
            queryset_list = MyInteraction.objects.filter(
                Q(transcript_id__icontains = q_search)
            )
        else:
            queryset_list = MyInteraction.objects.all()[:3]

        serializer = MyInteractionSerializer(queryset_list , many=True)

        return Response(serializer.data)
        #args = {
        #    'data' : queryset_list,
        #}
        #return Response(args, template_name='csv_app/new2.html')


#######################################################################################################################
def basic_view(request):
    if request.method == 'GET':
        return render(request, 'csv_app/new1.html')
    else:
        q_search = request.POST.get('q_search')

        if q_search:
            queryset_list = MyInteraction.objects.filter(
                Q(transcript_id__icontains = q_search)
            )
        else:
            queryset_list = MyInteraction.objects.all()[:3]

        args = {
            'data' : queryset_list,
        }
        return render(request, 'csv_app/new2.html', args)


def index4(request):
    bind_site_list = get_bind_site_choices()
    species_list = get_species_choices()

    if request.method == 'POST':
        form2 = SpeciesSelectionForm(request.POST)

        '''if "checkbox" in request.POST:
            message=str(request.POST.get("checkbox"))
        else:
            message="Nothing choosen"

        print message'''

    else:
        form2 = SpeciesSelectionForm()

        args = {'bind_sites' : bind_site_list,
                'species' : species_list,
                'form2' : form2,
                }

    return render(request, 'csv_app/index4.html', args)



#######################################################################################################################



def my8_data_serialize(request):         #this view returns JSON data
    #if request.is_ajax():
    q_search = request.GET.get('q_search')

    if q_search:
        queryset_list = Interaction.objects.filter(
            Q(transcript_id__icontains = q_search)
        )
    else:
        queryset_list = Interaction.objects.all()[:3]

    serializer = InteractionSerializer(queryset_list, many=True)
    #return render(request, 'csv_app/index4.html', {'data': serializer.data})  #it works ,if you use it ,change action="/csv_app/show_data --> my_data/" in index4.html

    return JsonResponse(serializer.data, safe=False)

    #return Response(serializer.data)

#(TEMP i DONT USE)
def show_data(request):         #this view takes JSON data from a url and return the data to a html page
    q_search = request.GET.get('q_search')

    url = 'http://127.0.0.1:8000/csv_app/my_data/?q_search=%s' % q_search
    response = requests.get(url)
    user = response.json()
    return render(request, 'csv_app/index4.html', {'data': user})

def extra_data(request):
    q_search = request.GET.get('q_search')

    if q_search:
        #1. Find the gene ID , using the transcript ID
        geneID = Annotation.objects.filter(
            Q(transcript_id__icontains = q_search, a_type = 'transcript')
        ).values('gene_id')

        id_gene =  geneID[0].get('gene_id')

        #2. Find the transcript start and stop positions
        q1 = Annotation.objects.filter(
            Q(a_type = 'transcript', transcript_id__icontains = q_search)
        ).values('start','stop')

        mydict = q1[0]
        print mydict

        #3. Find all the gene info like : gene start and stop positions , gene name
        q2 = Annotation.objects.filter(
            Q(gene_id = id_gene , a_type = 'gene')
        ).values('a_type', 'start', 'stop', 'chromosome', 'gene_name')

        mydict2 = q2[0]
        print mydict2
        print '\n'

        #serializer = AnnotationSerializer(queryset_list, many=True)
        #return JsonResponse(serializer.data, safe=False)

        args = {
            'transcript_start' : mydict.values()[0],
            'transcript_stop' : mydict.values()[1],
            'a_type' : mydict2.get('a_type'),
            'gene_start' : mydict2.get('start'),
            'gene_stop' : mydict2.get('stop'),
            'gene_chromosome' : mydict2.get('chromosome'),
            'gene_identifier' : id_gene,
            'gene_name' : mydict2.get('gene_name'),
        }

        return JsonResponse(args)

    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )
