import csv,sys,os

project_dir = "/home/geo/Desktop/django_projects/csvDemo/"

sys.path.append(project_dir)

os.environ['DJANGO_SETTINGS_MODULE'] = 'csvDemo.settings'

import django
django.setup()

from csv_app.models import Transcr_extra_info

data = csv.reader(open("/home/geo/Desktop/4_biomart_results_only_protein_coding.csv"),delimiter="	")

for x in data:
    r = Transcr_extra_info()
    r.gene_id = x[0]
    r.transcr_id = x[1]
    r.strand = x[2]

    if x[3] != '':
        r.five_utr_start = x[3]
    if x[4] != '':
        r.five_utr_stop = x[4]
    if x[5] != '':
        r.three_utr_start = x[5]
    if x[6] != '':
        r.three_utr_stop = x[6]
    if x[7] != '':
        r.genomic_coding_start = x[7]
    if x[8] != '':
        r.genomic_coding_stop = x[8]


    #r.chromosome_name = x[2]
    #r.gene_start = x[3]
    #r.gene_stop = x[4]
    #r.transcr_start = x[5]
    #r.transcr_stop = x[6]
    #r.gene_name = x[8]
    #r.exon_chr_start = x[13]
    #r.exon_chr_stop = x[14]


    r.save()
