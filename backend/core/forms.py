# Forms v1.0.0
from django import forms

from .models import Contato, ContatoLoja
from django.core.validators import MinValueValidator

class ContatoLojaAdminForm(forms.ModelForm):
    nome = forms.CharField(label='Nome do Contato', max_length=64)
    sobrenome = forms.CharField(label='Sobrenome', max_length=128, required=False)
    cpf = forms.CharField(label='CPF', max_length=14)
    email = forms.EmailField(label='E-mail', max_length=128)
    whatsapp = forms.CharField(label='WhatsApp', max_length=15)

    class Meta:
        model = ContatoLoja
        fields = ['instagram', 'cnpj']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and hasattr(self.instance, 'contato'):
            contato = self.instance.contato
            self.initial['nome'] = contato.nome
            self.initial['sobrenome'] = contato.sobrenome
            self.initial['cpf'] = contato.cpf
            self.initial['email'] = contato.email
            self.initial['whatsapp'] = contato.whatsapp
    
    def save(self, commit=True):
        contato_data = {
            'nome': self.cleaned_data['nome'],
            'sobrenome': self.cleaned_data['sobrenome'],
            'cpf': self.cleaned_data['cpf'],
            'email': self.cleaned_data['email'],
            'whatsapp': self.cleaned_data['whatsapp'],
        }
        if self.instance.pk and hasattr(self.instance, 'contato'):
            Contato.objects.filter(pk=self.instance.contato.pk).update(**contato_data)
            self.instance.contato.refresh_from_db()
        else:
            contato = Contato.objects.create(**contato_data)
            self.instance.contato = contato

        return super().save(commit=commit)

class GerarEtiquetaMelhorEnvioForm(forms.Form):
    selected_ids = forms.CharField(widget=forms.HiddenInput)
    
    peso = forms.DecimalField(
        label='Peso Total do Pacote (kg)',
        help_text='Exemplo: 0.850 para 850g. Use ponto como separador.',
        decimal_places=3,
        max_digits=10,
        required=True
    )
    comprimento = forms.DecimalField(
        label='Comprimento do Pacote (cm)',
        decimal_places=2,
        max_digits=10,
        required=True,
        validators=[MinValueValidator(11)]
    )
    largura = forms.DecimalField(
        label='Largura do Pacote (cm)',
        decimal_places=2,
        max_digits=10,
        required=True,
        validators=[MinValueValidator(10)]
    )
    altura = forms.DecimalField(
        label='Altura do Pacote (cm)',
        decimal_places=2,
        max_digits=10,
        required=True,
        validators=[MinValueValidator(1)]
    )