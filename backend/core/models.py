# Database v14.4.1
import uuid
from io import BytesIO
from PIL import Image as PILImage
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db import models

from django.core.validators import MinLengthValidator, MinValueValidator, RegexValidator
from .utils.validations import CPFValidator

class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True

class InformacoesEntrega(BaseModel):
    entrega_estimada = models.DateField()
    rastreador = models.CharField(max_length=32)
    transportadora = models.CharField(max_length=32)
    preco_frete = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        validators=[
            MinValueValidator(0),
        ],
    verbose_name='Preço do Frete')
    data_hora_finalizado = models.DateTimeField(null=True, blank=True, verbose_name='Finalizado')

    def __str__(self):
        return f'{self.transportadora} - {self.rastreador}'
    
    class Meta:
        verbose_name = 'Informações da Entrega'
        verbose_name_plural = 'Informações das Entregas'

class Loja(BaseModel):
    apelido = models.CharField(max_length=32, verbose_name='Apelido da Loja')

    def __str__(self):
        return f'{self.apelido}'
    
    class Meta:
        verbose_name = 'Loja'
        verbose_name_plural = 'Lojas'

class Endereco(BaseModel):
    UF = (
        ('AC', 'Acre'),
        ('AL', 'Alagoas'),
        ('AM', 'Amazonas'),
        ('AP', 'Amapá'),
        ('BA', 'Bahia'),
        ('CE', 'Ceará'),
        ('DF', 'Distrito Federal'),
        ('ES', 'Espirito Santo'),
        ('GO', 'Goiás'),
        ('MA', 'Maranhão'),
        ('MG', 'Minas Gerais'),
        ('MS', 'Mato Grosso do Sul'),
        ('MT', 'Mato Grosso'),
        ('PA', 'Pará'),
        ('PB', 'Paraíba'),
        ('PE', 'Pernambuco'),
        ('PI', 'Piauí'),
        ('PR', 'Paraná'),
        ('RJ', 'Rio de Janeiro'),
        ('RN', 'Rio Grande do Norte'),
        ('RO', 'Rondônia'),
        ('RR', 'Roraima'),
        ('RS', 'Rio Grande do Sul'),
        ('SC', 'Santa Catarina'),
        ('SE', 'Sergipe'),
        ('SP', 'São Paulo'),
        ('TO', 'Tocantins'),
    )
    CEPValidator = RegexValidator(
        regex=r'^\d{5}-\d{3}$',
        message='O CEP deve estar no formato XXXXX-XXX.'
    )
    cep = models.CharField(
        max_length=9,
        blank=False,
        null=False,
        validators=[
            CEPValidator,
            ],
        )
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE, null=True, blank=True)
    logradouro = models.CharField(max_length=128, blank=False, null=False)
    numero = models.PositiveIntegerField(blank=False, null=False, verbose_name='Número')
    complemento = models.CharField(max_length=128, blank=True, null=True)
    bairro = models.CharField(max_length=128, blank=False, null=False)
    cidade = models.CharField(max_length=32, blank=False, null=False)
    uf = models.CharField(
        max_length=2, 
        blank=False, 
        null=False, 
        choices=UF, 
        default='SP',
        validators=[
            MinLengthValidator(2),
            ], 
        verbose_name='UF'
        )
    
    def __str__(self):
        return f'{self.logradouro}. {self.cep}'
    
    class Meta:
        verbose_name = 'Endereço'
        verbose_name_plural = 'Endereços'

class Contato(BaseModel):
    nome = models.CharField(max_length=64, blank=False, null=False)
    sobrenome = models.CharField(max_length=128)
    cpf = models.CharField(
        max_length=11,
        blank=False, 
        null=False,
        validators=[
            CPFValidator,
            ], 
        verbose_name='CPF'
        )
    email = models.EmailField(max_length=128, blank=False, null=False, verbose_name='E-mail')

    def __str__(self):
        return f'{self.nome} {self.sobrenome}'
    
    class Meta:
        verbose_name = 'Contato'
        verbose_name_plural = 'Contatos'
    
class ContatoLoja(models.Model):
    loja = models.OneToOneField(Loja, on_delete=models.CASCADE, primary_key=True)
    contato = models.OneToOneField(Contato, on_delete=models.CASCADE, verbose_name='Contato da Loja')
    whatsapp = models.CharField(
        max_length=15,                        
        validators=[
            MinLengthValidator(13),
            ], 
        verbose_name='WhatsApp'
        )
    telefone = models.CharField(
        max_length=15,
        validators=[
            MinLengthValidator(13),
            ],
        )
    instagram = models.CharField(max_length=32)
    cnpj = models.CharField(
        max_length=18,
        null=True,
        blank=True,
        validators=[
            MinLengthValidator(18),
            ],
        verbose_name='CNPJ'
        )
    
    def __str__(self):
        return f'{self.instagram}'
    
    class Meta:
        verbose_name = 'Contato da Loja'
        verbose_name_plural = 'Contatos das Lojas'

class ContatoNormal(Contato):
    class Meta:
        proxy = True
        verbose_name = 'Contato (Cliente)'
        verbose_name_plural = 'Contatos (Clientes)'

class ContatoDeLoja(Contato):
    class Meta:
        proxy = True
        verbose_name = 'Contato (Loja)'
        verbose_name_plural = 'Contatos (Lojas)'

class Categoria(BaseModel):
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE)
    nome_categoria = models.CharField(max_length=64, verbose_name='Nome da Categoria')

    def __str__(self):
        return f'{self.nome_categoria}'
    
    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'

class Produto(BaseModel):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    nome = models.CharField(max_length=128)
    descricao = models.TextField(verbose_name='Descrição')
    qtd_disponivel = models.PositiveIntegerField(default=1, verbose_name='Quantidade Disponível')
    qtd_em_compra = models.PositiveIntegerField(default=0, verbose_name='Quantidade em Compra')
    preco = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        validators=[
            MinValueValidator(0),
        ],
    verbose_name='Preço')
    peso = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    comprimento = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    largura = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    altura = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    dias_para_disponibilizar = models.PositiveIntegerField(default=0, verbose_name='Dias para Disponibilizar para Entrega')

    class Meta:
        indexes = [
            models.Index(fields=['nome'], name='idx_produto_nome')
        ]
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'

    def __str__(self):
        return f'{self.nome}'

class DetalheProduto(BaseModel):
    propriedade = models.CharField(max_length=64)
    descricao = models.TextField(max_length=128, verbose_name='Descrição')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.propriedade} - {self.produto}'

    class Meta:
        verbose_name = 'Detalhe do Produto'
        verbose_name_plural = 'Detalhes dos Produtos'

class Tamanho(BaseModel):
    nome = models.CharField(max_length=32)
    valor = models.CharField(max_length=2)

    def __str__(self):
        return f'{self.nome} [{self.valor}]'
    
    class Meta:
        verbose_name = 'Tamanho'
        verbose_name_plural = 'Tamanhos'

class TamanhoProduto(BaseModel):
    tamanho = models.ForeignKey(Tamanho, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('tamanho', 'produto')
        verbose_name = 'Tamanho do Produto'
        verbose_name_plural = 'Tamanhos dos Produtos'

class Pedido(BaseModel):
    STATUS = (
        ('A', 'Aguardando Pagamento'),
        ('R', 'Recusada'),
        ('E', 'Em Preparo'),
        ('S', 'Enviada'),
        ('C', 'Concluída'),
    )
    contato_cliente = models.ForeignKey(Contato, on_delete=models.PROTECT, verbose_name='Contado do Cliente')
    endereco_entrega = models.ForeignKey(Endereco, on_delete=models.PROTECT, verbose_name='Endereço de Entrega')

    info_entrega = models.ForeignKey(InformacoesEntrega, on_delete=models.PROTECT, verbose_name='Informações de Entrega')
    data_hora_criacao = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    status = models.CharField(max_length=1, choices=STATUS, blank=False, null=False, default='A')
    
    id_pagamento_externo = models.CharField(max_length=255, blank=True, null=True, verbose_name='ID do Pagamento Externo')
    url_pagamento = models.URLField(max_length=255, blank=True, null=True, verbose_name='URL do Pagamento')
    
    def __str__(self):
        return f"Pedido #{self.id} - {self.get_status_display()}"
    
    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

class ItemPedido(BaseModel):
    pedido = models.ForeignKey(Pedido, related_name='itens', on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    tamanho = models.ForeignKey(TamanhoProduto, on_delete=models.PROTECT)
    quantidade = models.PositiveIntegerField()
    preco_unitario_congelado = models.DecimalField(max_digits=12, decimal_places=2, verbose_name='Preço Unitário')

    def __str__(self):
        return f'{self.quantidade}x {self.produto.nome} no Pedido #{self.pedido.id}'
    
    class Meta:
        verbose_name = 'Item do Pedido'
        verbose_name_plural = 'Itens dos Pedidos'

class Imagem(BaseModel):
    titulo = models.CharField(max_length=128, blank=True, verbose_name='Título')
    imagem = models.ImageField(upload_to='images/')
    
    _original_imagem_name = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_imagem_name = self.imagem.name

    def __str__(self):
        return self.titulo or self.imagem.name
    
    class Meta:
        verbose_name = 'Imagem'
        verbose_name_plural = 'Imagens'

    def save(self, *args, **kwargs):
        imagem_foi_trocada = self.imagem.name != self._original_imagem_name
        arquivo_antigo = self._original_imagem_name if self.pk and imagem_foi_trocada else None

        if self.imagem and imagem_foi_trocada:
            try:
                img = PILImage.open(self.imagem).convert('RGB')
                MAX_HEIGHT = 1080
                original_width, original_height = img.size
                if original_height > MAX_HEIGHT:
                    aspect_ratio = original_width / original_height
                    novo_width = int(aspect_ratio * MAX_HEIGHT)
                    img = img.resize((novo_width, MAX_HEIGHT), PILImage.Resampling.LANCZOS)

                buffer = BytesIO()
                img.save(buffer, format='webp', quality=85)
                
                novo_nome = f"{uuid.uuid4()}.webp"
                self.imagem.save(novo_nome, ContentFile(buffer.getvalue()), save=False)
            
            except Exception as e:
                print(f"Erro ao processar a imagem: {e}")
                self.imagem.name = self._original_imagem_name
                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)
        
        if arquivo_antigo:
            if default_storage.exists(arquivo_antigo):
                default_storage.delete(arquivo_antigo)

    def delete(self, *args, **kwargs):
        if self.imagem:
            if default_storage.exists(self.imagem.name):
                default_storage.delete(self.imagem.name)
        super().delete(*args, **kwargs)

class ImagemProduto(BaseModel):
    imagem = models.ForeignKey(Imagem, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('imagem', 'produto')
        verbose_name = 'Imagem do Produto'
        verbose_name_plural = 'Imagens dos Produtos'