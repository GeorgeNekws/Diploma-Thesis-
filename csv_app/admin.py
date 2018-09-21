# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from .models import Annotation
from .models import Interaction
from .models import Mirna, MyChromosome, Transcr_extra_info

admin.site.register(Interaction)
admin.site.register(Annotation)
admin.site.register(Mirna)
#admin.site.register(MyInteraction)
admin.site.register(MyChromosome)
admin.site.register(Transcr_extra_info)
