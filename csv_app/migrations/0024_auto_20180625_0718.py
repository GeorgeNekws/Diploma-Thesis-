# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2018-06-25 07:18
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('csv_app', '0023_transfer_mirna4'),
    ]

    operations = [
        migrations.RenameField(
            model_name='interaction',
            old_name='mirna_connection',
            new_name='mirna_conn',
        ),
    ]