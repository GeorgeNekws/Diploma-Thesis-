# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2018-07-28 23:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('csv_app', '0029_auto_20180728_1722'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interaction',
            name='chromosome',
            field=models.CharField(max_length=4),
        ),
    ]
