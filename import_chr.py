import csv,sys,os

project_dir = "/home/geo/Desktop/django_projects/csvDemo/"

sys.path.append(project_dir)

os.environ['DJANGO_SETTINGS_MODULE'] = 'csvDemo.settings'

import django
django.setup()

from csv_app.models import MyChromosome

data = csv.reader(open("/home/geo/Desktop/proc_ideogram_9606_GCF_000001305.13_850_V1.csv"),delimiter="	")


for x in data:
    chromo = MyChromosome()
    chromo.chromosome_num = x[0]
    chromo.arm = x[1]
    chromo.band = x[2]
    #chromo.iscn_start = x[3]
    #chromo.iscn_stop = x[4]
    chromo.bp_start = x[3]
    chromo.bp_stop = x[4]
    chromo.stain = x[5]
    if x[6] != '':
        chromo.density = x[6]
    chromo.save()
