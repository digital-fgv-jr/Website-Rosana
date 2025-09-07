# Database v8.4.0

from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator, RegexValidator

from .utils.validations import CPFValidator

class Endereco(models.Model):
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
    uf = models.CharField(
        max_length=2, 
        blank=False, 
        null=False, 
        choices=UF, 
        default='SP',
        validators=[
            MinLengthValidator(2),
            ],
        )
    cidade = models.CharField(max_length=32, blank=False, null=False)
    logradouro = models.CharField(max_length=128, blank=False, null=False)
    bairro = models.CharField(max_length=128, blank=False, null=False)
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
    
    def __str__(self):
        return f'{self.logradouro}. {self.cep}'

class Contato(models.Model):
    nome = models.CharField(max_length=64, blank=False, null=False)
    sobrenome = models.CharField(max_length=128)
    cpf = models.CharField(
        max_length=11,
        blank=False, 
        null=False,
        validators=[
            CPFValidator,
            ],
        )
    email = models.EmailField(max_length=128, blank=False, null=False)

    def __str__(self):
        return f'{self.nome} {self.sobrenome} ({self.email})'
    
class ContatoLoja(models.Model):
    contato = models.OneToOneField(Contato, on_delete=models.CASCADE, primary_key=True)
    whatsapp = models.CharField(max_length=11)
    telefone = models.CharField(max_length=11)
    instagram = models.CharField(max_length=32)
    cnpj = models.CharField(
        max_length=14,
        null=True,
        blank=True,
        validators=[
            MinLengthValidator(14),
            ],
        )
    
    def __str__(self):
        return f'Loja: {self.instagram} ({self.telefone})'

class InformacoesEntrega(models.Model):
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
    )
    data_hora_finalizado = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Entrega {self.rastreador}'

class Loja(models.Model):
    apelido = models.CharField(max_length=32)
    contato = models.ForeignKey(ContatoLoja, null=True, on_delete=models.SET_NULL)
    endereco = models.ForeignKey(Endereco, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f'Loja {self.apelido}'

class Categoria(models.Model):
    loja = models.ForeignKey(Loja, on_delete=models.CASCADE)
    nome_categoria = models.CharField(max_length=64)

    def __str__(self):
        return f'Categoria {self.nome_categoria}'

class Produto(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    nome = models.CharField(max_length=128)
    descricao = models.TextField()
    qtd_disponivel = models.PositiveIntegerField(default=1)
    qtd_em_compra = models.PositiveIntegerField(default=0)
    preco = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        validators=[
            MinValueValidator(0),
        ],
    )
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

    class Meta:
        indexes = [
            models.Index(fields=['nome'], name='idx_produto_nome')
        ]
    
    def __str__(self):
        return f'Produto {self.nome}'

class DetalheProduto(models.Model):
    propriedade = models.CharField(max_length=64)
    descricao = models.TextField(max_length=128)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)

    def __str__(self):
        return f'Detalhe {self.propriedade} - {self.produto}'


class Imagem(models.Model):
    imagem = models.ImageField(upload_to='imagens/')
    alt_text = models.CharField(max_length=128, blank=True)

    def __str__(self):
        return self.alt_text or self.imagem.name

class Tamanho(models.Model):
    nome = models.CharField(max_length=32)
    valor = models.CharField(max_length=2)

    def __str__(self):
        return f'{self.nome}: {self.valor}'

class TamanhoProduto(models.Model):
    tamanho = models.ForeignKey(Tamanho, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('tamanho', 'produto')

class Carrinho(models.Model):
    fechado = models.BooleanField(default=False, null=False)

    def __str__(self):
        return f'Carrinho {'Fechado' if self.fechado == True else 'Aberto'}'

class Pedido(models.Model):
    STATUS = (
        ('C', 'Concluída'),
        ('P', 'Pendente'),
        ('A', 'Aguardando Pagamento'),
        ('R', 'Recusada'),
    )
    contato_cliente = models.ForeignKey(Contato, on_delete=models.PROTECT)
    endereco_entrega = models.ForeignKey(Endereco, on_delete=models.PROTECT)

    info_entrega = models.ForeignKey(InformacoesEntrega, on_delete=models.PROTECT)
    data_hora_criacao = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=STATUS, blank=False, null=False, default='A')
    
    id_pagamento_externo = models.CharField(max_length=255, blank=True, null=True)
    url_pagamento = models.URLField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"Pedido #{self.id} - {self.get_status_display()}"

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='itens', on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    tamanho = models.ForeignKey(TamanhoProduto, on_delete=models.PROTECT)
    quantidade = models.PositiveIntegerField()
    preco_unitario_congelado = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f'{self.quantidade}x {self.produto.nome} no Pedido #{self.pedido.id}'

class ProdutoCarrinho(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    tamanho = models.ForeignKey(TamanhoProduto, on_delete=models.PROTECT)
    carrinho = models.ForeignKey(Carrinho, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    class Meta:
        unique_together = ('produto', 'carrinho')

class ImagemProduto(models.Model):
    imagem = models.ForeignKey(Imagem, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('imagem', 'produto')