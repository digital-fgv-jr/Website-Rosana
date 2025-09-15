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
    ImagemProduto = apps.get_model('core', 'ImagemProduto')
    ImagemCategoria = apps.get_model('core', 'ImagemCategoria')

    print("\nCriando dados da loja...")

    contato_base_loja, _ = Contato.objects.get_or_create(
        email='contato@jewellery.roalves.com.br',
        defaults={
            'nome': 'Rô Alves',
            'sobrenome': 'Jewellery',
            'cpf': '827.347.230-26',
            'whatsapp': '(11) 99999-9999',
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
            'instagram': '@roalves_jewellery',
            'cnpj': '14.946.698/0001-47'
        }
    )
    print("Dados da loja criados com sucesso.")

    print("Criando categorias pré-definidas...")
    categorias_predefinidas = [('Anel', 'Anéis',), ('Brinco', 'Brincos',), ('Colar', 'Colares',), ('Pingente', 'Pingentes'), ('Bracelete', 'Braceletes',), ('Filigrana', 'Filigrana',),]
    for nome_cat, nome_plural in categorias_predefinidas:
        Categoria.objects.get_or_create(loja=loja, nome_categoria=nome_cat, nome_plural=nome_plural)
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
    tamanho_unico, _ = Tamanho.objects.get_or_create(nome="Único", valor="UNICO")
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
                categorias_para_associar = Categoria.objects.filter(loja=loja, nome_plural__in=categorias_nomes)
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
                            ImagemProduto.objects.create(
                                produto=produto,
                                titulo=f"{produto.nome} - {nome_imagem}",
                                imagem=File(f, name=nome_imagem) 
                            )
                            print(f"Successfully saved {nome_imagem}")
                    except Exception as e:
                        print(f"Error processing {nome_imagem}: {e}")
            
            if any(cat in ['Anel', 'Anéis'] for cat in categorias_nomes):
                for tamanho_obj in tamanhos_aneis.values():
                    TamanhoProduto.objects.create(produto=produto, tamanho=tamanho_obj)
            elif any(cat in ['Colar', 'Colares'] for cat in categorias_nomes):
                for tamanho_obj in tamanhos_colares.values():
                    TamanhoProduto.objects.create(produto=produto, tamanho=tamanho_obj)
            elif any(cat in ['Bracelete', 'Braceletes'] for cat in categorias_nomes):
                for tamanho_obj in tamanhos_braceletes.values():
                    TamanhoProduto.objects.create(produto=produto, tamanho=tamanho_obj)
            else:
                TamanhoProduto.objects.create(produto=produto, tamanho=tamanho_unico)

            print(f"Produto '{produto.nome}' criado e associado.")

    print("\nAssociando a primeira imagem de produto a cada categoria...")
    todas_categorias = Categoria.objects.filter(loja=loja)
    for categoria in todas_categorias:
        produto_com_imagem = Produto.objects.filter(categorias=categoria, imagens__isnull=False).last()
        
        if produto_com_imagem:
            primeira_imagem_produto = produto_com_imagem.imagens.first()
            ImagemCategoria.objects.get_or_create(
                categoria=categoria,
                defaults={
                    'titulo': f"Imagem da categoria {categoria.nome_categoria}",
                    'imagem': primeira_imagem_produto.imagem
                }
            )
            print(f"Imagem associada para a categoria '{categoria.nome_categoria}'.")
        else:
            print(f"Nenhuma imagem encontrada para produtos da categoria '{categoria.nome_categoria}'.")
    print("Associação de imagens de categoria finalizada.")

    print("Importação de produtos finalizada.")

def remover_dados(apps, schema_editor):
    
    print("\nRevertendo migração: Removendo dados iniciais...")

    ItemPedido = apps.get_model('core', 'ItemPedido')
    ItemPedido.objects.all().delete()
    
    Pedido = apps.get_model('core', 'Pedido')
    Pedido.objects.all().delete()
    
    InformacoesEntrega = apps.get_model('core', 'InformacoesEntrega')
    InformacoesEntrega.objects.all().delete()

    ImagemProduto = apps.get_model('core', 'ImagemProduto')
    ImagemProduto.objects.all().delete()

    ImagemCategoria = apps.get_model('core', 'ImagemCategoria')
    ImagemCategoria.objects.all().delete()

    TamanhoProduto = apps.get_model('core', 'TamanhoProduto')
    TamanhoProduto.objects.all().delete()

    DetalheProduto = apps.get_model('core', 'DetalheProduto')
    DetalheProduto.objects.all().delete()

    Produto = apps.get_model('core', 'Produto')
    Produto.categorias.through.objects.all().delete()
    Produto.objects.all().delete()

    Categoria = apps.get_model('core', 'Categoria')
    Categoria.objects.all().delete()

    ContatoLoja = apps.get_model('core', 'ContatoLoja')
    ContatoLoja.objects.all().delete()

    Contato = apps.get_model('core', 'Contato')
    Contato.objects.all().delete()

    Endereco = apps.get_model('core', 'Endereco')
    Endereco.objects.all().delete()

    Tamanho = apps.get_model('core', 'Tamanho')
    Tamanho.objects.all().delete()
    
    Loja = apps.get_model('core', 'Loja')
    Loja.objects.all().delete()
    
    print("Dados iniciais removidos com sucesso.")

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(popular_dados, reverse_code=remover_dados),
    ]