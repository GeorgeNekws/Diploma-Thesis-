import csv,sys,os

project_dir = "/home/geo/Desktop/django_projects/csvDemo/"

sys.path.append(project_dir)

os.environ['DJANGO_SETTINGS_MODULE'] = 'csvDemo.settings'

import django
django.setup()

from csv_app.models import Interaction

data = csv.reader(open("/home/geo/Desktop/django_projects/csvDemo/human_interactions.txt.csv"),delimiter="	")

for row in data:
    inter = Interaction()
    inter.chromosome = row[0]
    inter.bind_start_site = row[1]
    inter.bind_stop_site = row[2]
    inter.miRNA_name = row[3]
    inter.gene_ID = row[4]
    inter.transcript_ID = row[5]
    inter.binding_site = row[6]
    inter.strand = row[7]
    inter.relative_start = row[8]
    inter.relative_stop = row[9]
    inter.binding_type = row[10]

    inter.save()
