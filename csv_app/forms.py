from django import forms


class SpeciesSelectionForm(forms.Form):
    SPECIES_CHOICES = (
        ('panTro2', 'panTro2'),
        ('rheMac2', 'rheMac2'),
        ('oryCun2', 'oryCun2'),
        ('canFam2', 'canFam2'),
        ('dasNov2', 'dasNov2'),
        ('loxAfr3', 'loxAfr3'),
        ('echTel1', 'echTel1'),
        ('monDom5', 'monDom5'),
        ('mm9', 'mm9'),
        ('bosTau4', 'bosTau4'),
        ('rn4', 'rn4'),
        ('galGal3', 'galGal3'),
        ('danRer6', 'danRer6'),
        ('xenTro2', 'xenTro2'),
        ('fr2', 'fr2'),
        ('tetNig2', 'tetNig2'),
        ('NA', 'NA'),
        ('Not Conserved', 'Not Conserved'),
    )

    multiple_checkboxes = forms.MultipleChoiceField(choices=SPECIES_CHOICES, widget=forms.CheckboxSelectMultiple)
