# Serializers 13.0.0
from rest_framework import serializers
from django.conf import settings

from datetime import timedelta, date
from django.db import transaction
import requests
import mercadopago

from .models import (
    InformacoesEntrega, Loja, Endereco, Contato,
    ContatoLoja, ContatoNormal, ContatoDeLoja,
    Categoria, Produto, DetalheProduto, Tamanho,
    TamanhoProduto, Pedido, ItemPedido,
    ImagemProduto, ImagemCategoria,
)

######################
## SERIALIZERS BASE ##
######################

## Propriedades Básicas
class ImagemProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagemProduto
        fields = ['titulo', 'imagem']

class ImagemCategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagemCategoria
        fields = ['titulo', 'imagem']

class TamanhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tamanho
        fields = ['nome', 'valor']

class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = ['cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf']

class ContatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contato
        fields = ['nome', 'sobrenome', 'cpf', 'email']

class ContatoLojaSerializer(serializers.ModelSerializer):
    contato = ContatoSerializer()
    class Meta:
        model = ContatoLoja
        fields = ['contato', 'whatsapp', 'telefone', 'instagram', 'cnpj']

class ContatoLojaExclusiveInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContatoLoja
        fields = ['whatsapp', 'telefone', 'instagram', 'cnpj']

class ListaContatosNormaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContatoNormal
        fields = ['id', 'nome', 'sobrenome', 'cpf', 'email']

class ListaContatosLojaSerializer(serializers.ModelSerializer):
    contatoloja = ContatoLojaExclusiveInfoSerializer(read_only=True)
    class Meta:
        model = ContatoDeLoja
        fields = ['id', 'nome', 'sobrenome', 'cpf', 'email', 'contatoloja']