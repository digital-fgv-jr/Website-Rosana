from django.db import migrations
import os
import csv
from django.conf import settings
from django.core.files import File

def popular_dados(apps, schema_editor):
    Loja = apps.get_model('core', 'Loja')
    Endereco = apps.get_model('core', 'Endereco')
    Contato = apps.get_model('core', 'Contato')
    ContatoLoja = apps.get_model('core', 'ContatoLoja')
    Categoria = apps.get_model('core', 'Categoria')
    Produto = apps.get_model('core', 'Produto')
    DetalheProduto = apps.get_model('core', 'DetalheProduto')
    Tamanho = apps.get_model('core', 'Tamanho')
    TamanhoProduto = apps.get_model('core', 'TamanhoProduto')
    Imagem = apps.get_model('core', 'Imagem')
    ImagemProduto = apps.get_model('core', 'ImagemProduto')

    print("\nCriando dados da loja...")

    contato_base_loja, _ = Contato.objects.get_or_create(
        email='contato@jewellery.roalves.com.br',
        defaults={
            'nome': 'Rô Alves',
            'sobrenome': 'Jewellery',
            'cpf': '82734723026'
        }
    )
    
    loja, _ = Loja.objects.get_or_create(apelido='Rô Alves Jewellery')

    Endereco.objects.get_or_create(
        loja=loja,
        cep='22231-020',
        defaults={
            'logradouro': 'Rua Farani',
            'numero': 3,
            'bairro': 'Botafogo',
            'cidade': 'Rio de Janeiro',
            'uf': 'RJ'
        }
    )

    ContatoLoja.objects.get_or_create(
        loja=loja,
        defaults={
            'contato': contato_base_loja,
            'whatsapp': '(21) 99999-9999',
            'telefone': '(21) 88888-8888',
            'instagram': '@roalves_jewellery',
            'cnpj': '14.946.698/0001-47'
        }
    )
    print("Dados da loja criados com sucesso.")

    print("Criando categorias pré-definidas...")

    categorias_predefinidas = ['Anéis', 'Brincos', 'Colares', 'Pingentes', 'Braceletes', 'Filigrana',]
    for nome_cat in categorias_predefinidas:
        Categoria.objects.get_or_create(loja=loja, nome_categoria=nome_cat)
    print("Categorias criadas com sucesso.")

    print("Criando tamanhos pré-definidos...")
    tamanhos_colares = {}
    tamanhos_aneis = {}
    tamanhos_braceletes = {}
    for val in [f'{i} cm' for i in [35, 40, 45, 50, 60, 70]]:
        tamanhos_colares[val], _ = Tamanho.objects.get_or_create(nome="Colar", valor=val)
    for val in range(10, 33):
        tamanhos_aneis[str(val)], _ = Tamanho.objects.get_or_create(nome="Anel", valor=str(val))
    for val in ["PP", "P", "M", "G", "GG"]:
        tamanhos_braceletes[val], _ = Tamanho.objects.get_or_create(nome="Bracelete", valor=val)
    print("Tamanhos criados com sucesso.")


    print("Iniciando a importação de produtos do CSV...")
    data_dir = os.path.join(settings.BASE_DIR, 'core', 'management', 'initial_data', 'JOIAS_BACKUP')
    csv_path = os.path.join(data_dir, 'INDEX.csv')

    if not os.path.exists(csv_path):
        print(f"AVISO: Arquivo INDEX.csv não encontrado. Produtos não foram importados.")
        return

    with open(csv_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        
        for row in reader:
            if not row.get('ID') or not row.get('Preco'):
                continue
            
            produto, created = Produto.objects.get_or_create(
                nome=row['Nome'],
                defaults={
                    'descricao': row['Descricao'],
                    'preco': float(row['Preco'].replace(',', '.')),
                    'qtd_disponivel': int(row['Quantidade Disponivel']),
                    'peso': 0.3, 'comprimento': 10, 'largura': 10, 'altura': 5,
                    'dias_para_disponibilizar': 3
                }
            )

            if not created:
                print(f"Produto '{row['Nome']}' já existia. Pulando.")
                continue

            
            categorias_nomes = [cat.strip() for cat in row['Categoria'].split(',') if cat.strip()]
            if categorias_nomes:
                categorias_para_associar = Categoria.objects.filter(loja=loja, nome_categoria__in=categorias_nomes)
                if categorias_para_associar.exists():
                    produto.categorias.set(categorias_para_associar)

            for i in range(1, 4):
                nome_detalhe, valor_detalhe = row.get(f'Detalhe {i}: Nome'), row.get(f'Detalhe {i}: Valor')
                if nome_detalhe and valor_detalhe:
                    DetalheProduto.objects.create(produto=produto, propriedade=nome_detalhe, descricao=valor_detalhe)
            
            pasta_imagens = os.path.join(data_dir, row['ID'])
            if os.path.isdir(pasta_imagens):
                for nome_imagem in os.listdir(pasta_imagens):
                    caminho_imagem = os.path.join(pasta_imagens, nome_imagem)
                    print(f"Attempting to load {caminho_imagem}")
                    try:
                        with open(caminho_imagem, 'rb') as f:
                            imagem_obj = Imagem(titulo=f"{produto.nome} - {nome_imagem}")
                            imagem_obj.imagem.save(nome_imagem, File(f), save=True)
                            ImagemProduto.objects.create(imagem=imagem_obj, produto=produto)
                            print(f"Successfully saved {nome_imagem}")
                    except Exception as e:
                        print(f"Error processing {nome_imagem}: {e}")
            
            if any(cat in ['Anel', 'Anéis'] for cat in categorias_nomes):
                for tamanho_obj in tamanhos_aneis.values():
                    TamanhoProduto.objects.create(produto=produto, tamanho=tamanho_obj)
            
            if any(cat in ['Colar', 'Colares'] for cat in categorias_nomes):
                for tamanho_obj in tamanhos_colares.values():
                    TamanhoProduto.objects.create(produto=produto, tamanho=tamanho_obj)
            
            if any(cat in ['Bracelete', 'Braceletes'] for cat in categorias_nomes):
                for tamanho_obj in tamanhos_braceletes.values():
                    TamanhoProduto.objects.create(produto=produto, tamanho=tamanho_obj)

            print(f"Produto '{produto.nome}' criado e associado.")

    print("Importação de produtos finalizada.")

def remover_dados(apps, schema_editor):
    Loja = apps.get_model('core', 'Loja')
    ContatoLoja = apps.get_model('core', 'ContatoLoja')
    Contato = apps.get_model('core', 'Contato')
    Endereco = apps.get_model('core', 'Endereco')
    Categoria = apps.get_model('core', 'Categoria')
    Produto = apps.get_model('core', 'Produto')
    DetalheProduto = apps.get_model('core', 'DetalheProduto')
    TamanhoProduto = apps.get_model('core', 'TamanhoProduto')
    ImagemProduto = apps.get_model('core', 'ImagemProduto')
    Tamanho = apps.get_model('core', 'Tamanho')
    Imagem = apps.get_model('core', 'Imagem')
    ItemPedido = apps.get_model('core', 'ItemPedido')
    Pedido = apps.get_model('core', 'Pedido')
    InformacoesEntrega = apps.get_model('core', 'InformacoesEntrega')
    
    print("\nRevertendo migração: Removendo dados iniciais...")

    Endereco.objects.filter(loja_id__isnull=False).exclude(loja_id__in=Loja.objects.values('id')).delete()

    InformacoesEntrega.objects.all().delete()
    ItemPedido.objects.all().delete()
    Pedido.objects.all().delete()
    ImagemProduto.objects.all().delete()
    TamanhoProduto.objects.all().delete()
    DetalheProduto.objects.all().delete()
    Produto.objects.all().delete()
    ContatoLoja.objects.all().delete()
    Endereco.objects.all().delete()
    Categoria.objects.all().delete()
    Tamanho.objects.all().delete()
    Imagem.objects.all().delete()
    Contato.objects.all().delete()
    Loja.objects.all().delete()
    
    print("Dados iniciais removidos com sucesso.")

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(popular_dados, reverse_code=remover_dados),
    ]