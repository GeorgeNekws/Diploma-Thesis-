import csv,sys,os

project_dir = "/home/geo/Desktop/django_projects/csvDemo/"

sys.path.append(project_dir)

os.environ['DJANGO_SETTINGS_MODULE'] = 'csvDemo.settings'

import django
django.setup()

from csv_app.models import Interaction,Annotation,Mirna

#data1 = csv.reader(open("/home/geo/Desktop/final3_transcript_annotations_gtf_file.txt.csv"),delimiter="	")
#data2 = csv.reader(open("/home/geo/Desktop/mimat_seq_combined_miRNA_info_21.txt.csv"),delimiter="	")
#data3 = csv.reader(open("/home/geo/Desktop/final_humanito_interactions.txt"),delimiter="	")
data4 = csv.reader(open("/home/geo/Desktop/foo_humanito_v1.txt"),delimiter="	")


'''for y in data1:
    annot = Annotation()
    annot.chromosome = y[0]
    annot.a_type = y[1]
    annot.start = y[2]
    annot.stop = y[3]
    annot.strand = y[4]
    annot.gene_id = y[5]
    annot.gene_name = y[6]
    if len(y) > 7:
        annot.transcript_id = y[7]
        annot.transcript_name = y[8]
    #if len(y) > 9:
        #annot.exon_id = y[9]
        #annot.exon_number = y[10]
    annot.save()'''


# for x in data2:
#     mir = Mirna()
#     mir.mirna_name = x[0]
#     mir.mirna_id = x[1]
#     mir.mirna_sequence = x[2]
#     mir.mirna_family = x[3]
#     mir.mirna_seed = x[4]
#     mir.save()

#Mirna = apps.get_model('csv_app', 'Mirna')
for z in data4:
    inter = Interaction()
    inter.chromosome = z[0]
    inter.bind_start = z[1]
    inter.bind_stop = z[2]
    inter.mirna_name = z[3]

    mirna, created = Mirna.objects.get_or_create(mirna_name=inter.mirna_name)
    inter.mirna_conn = mirna

    inter.gene_id = z[4]
    inter.transcript_id = z[5]
    inter.bind_site = z[6]
    inter.score = z[7]
    inter.strand = z[8]
    inter.num_species_conserved = z[9]
    inter.species = z[10]
    inter.bind_type = z[11]
    inter.save()

'''
for z in data4:
    inter = Interaction()
    inter.chromosome = z[0]
    inter.bind_start = z[1]
    inter.bind_stop = z[2]
    inter.mirna_name = z[3]
    inter.gene_id = z[4]
    inter.transcript_id = z[5]
    inter.bind_site = z[6]
    inter.score = z[7]
    inter.strand = z[8]
    #inter.relative_bind_start = z[9]
    #inter.relative_bind_stop = z[10]
    inter.num_species_conserved = z[9]
    inter.species = z[10]
    inter.bind_type = z[11]
    inter.save()
'''


'''def link_mirnas(apps, schema_editor):
    Mirna = apps.get_model('csv_app', 'Mirna')
    Interaction = apps.get_model('csv_app', 'Interaction')
    for inter in Interaction.objects.all():
        mirna, created = Mirna.objects.get_or_create(mirna_name=inter.mirna_name)
        inter.mirna_conn = mirna
        inter.save()'''
