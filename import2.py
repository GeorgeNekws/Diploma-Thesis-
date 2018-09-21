from csv_app.models import Interaction,Mirna


def link_mirnas(apps, schema_editor):
    Mirna = apps.get_model('csv_app', 'Mirna')
    Interaction = apps.get_model('csv_app', 'Interaction')
    for inter in Interaction.objects.all():
        mirna, created = Mirna.objects.get_or_create(mirna_name=inter.mirna_name)
        inter.mirna_name_link = mirna
        inter.save()
        #migrations.RunPython(link_mirnas),

def link_artists(apps, schema_editor):
    Album = apps.get_model('discography', 'Album')
    Artist = apps.get_model('discography', 'Artist')
    for album in Album.objects.all():
        artist, created = Artist.objects.get_or_create(name=album.artist)
        album.artist_link = artist
        album.save()
