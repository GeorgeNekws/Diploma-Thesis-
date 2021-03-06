# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2018-04-25 20:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('csv_app', '0004_auto_20180424_1523'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interaction',
            name='bind_start',
            field=models.CharField(max_length=40),
        ),
        migrations.AlterField(
            model_name='interaction',
            name='bind_stop',
            field=models.CharField(max_length=40),
        ),
        migrations.AlterField(
            model_name='interaction',
            name='bind_type',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='interaction',
            name='chromosome',
            field=models.CharField(max_length=5),
        ),
        migrations.AlterField(
            model_name='interaction',
            name='mirna_name',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='interaction',
            name='species',
            field=models.CharField(max_length=250),
        ),
        migrations.AlterField(
            model_name='interaction',
            name='strand',
            field=models.CharField(max_length=3),
        ),
    ]
