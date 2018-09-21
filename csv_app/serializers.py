from rest_framework import serializers
from csv_app.models import Interaction ,Annotation

class ToDoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = 'bind_start' , 'bind_stop' , 'mirna_name', 'gene_id'

#
# class MyInteractionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MyInteraction
#         fields = 'chromosome', 'mirna_name' , 'transcript_id' , 'bind_start' , 'bind_stop'

class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = 'chromosome', 'bind_start' , 'bind_stop', 'mirna_name' , 'gene_id', 'transcript_id' , 'bind_site', 'score', 'strand', 'relative_bind_start', 'relative_bind_stop', 'num_species_conserved', 'species', 'bind_type'

class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = 'chromosome', 'a_type' , 'start' , 'stop', 'strand', 'gene_id', 'gene_name', 'transcript_id' , 'transcript_name' , 'exon_id', 'exon_number'
