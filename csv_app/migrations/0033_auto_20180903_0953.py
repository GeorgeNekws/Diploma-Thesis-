# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2018-09-03 09:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('csv_app', '0032_auto_20180729_0934'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mirna',
            name='mirna_family',
            field=models.CharField(max_length=300),
        ),
        migrations.AlterField(
            model_name='mirna',
            name='mirna_seed',
            field=models.CharField(max_length=30),
        ),
    ]
