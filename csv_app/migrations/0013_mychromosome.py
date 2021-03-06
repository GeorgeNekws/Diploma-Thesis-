# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2018-06-07 05:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('csv_app', '0012_auto_20180523_0918'),
    ]

    operations = [
        migrations.CreateModel(
            name='MyChromosome',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chromosome_num', models.IntegerField()),
                ('arm', models.CharField(max_length=2)),
                ('band', models.FloatField()),
                ('iscn_start', models.IntegerField()),
                ('iscn_stop', models.IntegerField()),
                ('bp_start', models.IntegerField()),
                ('bp_stop', models.IntegerField()),
                ('stain', models.CharField(max_length=8)),
                ('density', models.IntegerField(default=0)),
            ],
        ),
    ]
