# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2018-05-23 09:18
from __future__ import unicode_literals

from django.db import migrations, models


def link_mirnas(apps, schema_editor):
    Mirna = apps.get_model('csv_app', 'Mirna')
    Interaction = apps.get_model('csv_app', 'Interaction')
    for inter in Interaction.objects.all():
        mirna, created = Mirna.objects.get_or_create(mirna_name=inter.mirna_name)
        inter.mirna_name_link = mirna
        inter.save()

class Migration(migrations.Migration):

    dependencies = [
        ('csv_app', '0011_transfer_mirna'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mirna',
            name='mirna_name',
            field=models.CharField(max_length=32, primary_key=True, serialize=False),
        ),
        migrations.RunPython(link_mirnas),
    ]
