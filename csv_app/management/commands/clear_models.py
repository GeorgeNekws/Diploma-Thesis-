from django.core.management.base import BaseCommand
from csv_app.models import Interaction,Mirna,Annotation,MyChromosome,Transcr_extra_info

class Command(BaseCommand):
    def handle(self, *args, **options):
        #Interaction.objects.all().delete()
        #Mirna.objects.all().delete()
        #Annotation.objects.all().delete()
        #MyChromosome.objects.all().delete()
        #Transcr_extra_info.objects.all().delete()


#command : python manage.py clear_models
