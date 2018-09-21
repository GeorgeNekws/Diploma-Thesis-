# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class FooModel(models.Model):
    name = models.CharField(max_length=20)
    length = models.CharField(max_length=20)
    begin = models.CharField(max_length=30)
    end = models.CharField(max_length=30)

    def __str__(self):
        return(self.name)
