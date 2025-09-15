# API da Loja Rô Alves Jewellery

Bem-vindo à documentação da API da loja Rô Alves Jewellery. Esta API é responsável por fornecer e gerenciar todas as informações de lojas, produtos, categorias e pedidos.

## URL Base

Todas as rotas da API são prefixadas com `/api/`. A URL base para o ambiente de desenvolvimento é:

`http://127.0.0.1:8000/api/`

## Autenticação

Atualmente, os endpoints de leitura (GET) e de criação de pedido/cotação de frete são públicos e não requerem autenticação.

---

## Endpoints da API

### 1. Lojas

#### `GET /lojas/`

Retorna uma lista com todas as informações públicas da(s) loja(s) cadastradas.

**Exemplo de Resposta (`200 OK`):**
```json
[
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "apelido": "Rô Alves Jewellery",
        "contato_loja": {
            "contato": {
                "nome": "Rô Alves",
                "sobrenome": "Jewellery",
                "cpf": "123.456.789-00",
                "email": "contato@jewellery.roalves.com.br",
                "whatsapp": "(21) 99999-9999"
            },
            "instagram": "@roalves_jewellery",
            "cnpj": "14.946.698/0001-47"
        },
        "enderecos": [
            {
                "cep": "22231-020",
                "logradouro": "Rua Farani",
                "numero": 3,
                "complemento": "Apto 101",
                "bairro": "Botafogo",
                "cidade": "Rio de Janeiro",
                "uf": "RJ"
            }
        ]
    }
]
```

---

### 2. Categorias

#### `GET /categorias/`

Retorna uma lista de todas as categorias de produtos, incluindo a primeira imagem associada e informações da loja.

**Exemplo de Resposta (`200 OK`):**
```json
[
    {
        "id": "f4g5h6j7-k8l9-1011-1213-141516abcdef",
        "nome_categoria": "Anel",
        "nome_plural": "Anéis",
        "loja": {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "apelido": "Rô Alves Jewellery"
        },
        "primeira_imagem": "[http://127.0.0.1:8000/media/images/exemplo_anel.webp](http://127.0.0.1:8000/media/images/exemplo_anel.webp)"
    },
    {
        "id": "a9b8c7d6-e5f4-3210-fedc-ba9876543210",
        "nome_categoria": "Colar",
        "nome_plural": "Colares",
        "loja": {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "apelido": "Rô Alves Jewellery"
        },
        "primeira_imagem": "[http://127.0.0.1:8000/media/images/exemplo_colar.webp](http://127.0.0.1:8000/media/images/exemplo_colar.webp)"
    }
]
```

---

### 3. Produtos

#### `GET /produtos/`

Retorna uma lista resumida de todos os produtos.

**Query Parameters (Filtros):**

* `categorias__id` (opcional): Filtra os produtos por uma ou mais IDs de categoria.
    * Exemplo: `/produtos/?categorias__id=f4g5h6j7-k8l9-1011-1213-141516abcdef`

**Exemplo de Resposta (`200 OK`):**
```json
[
    {
        "id": "uuid-do-produto-1",
        "nome": "Anel Solitário de Prata",
        "preco": "250.00",
        "categorias": [
            {
                "id": "f4g5h6j7-k8l9-1011-1213-141516abcdef",
                "nome_categoria": "Anel"
            }
        ],
        "primeira_imagem": "[http://127.0.0.1:8000/media/images/anel_solitario.webp](http://127.0.0.1:8000/media/images/anel_solitario.webp)"
    },
    {
        "id": "uuid-do-produto-2",
        "nome": "Colar de Pérolas",
        "preco": "450.00",
        "categorias": [
            {
                "id": "a9b8c7d6-e5f4-3210-fedc-ba9876543210",
                "nome_categoria": "Colar"
            }
        ],
        "primeira_imagem": "[http://127.0.0.1:8000/media/images/colar_perolas.webp](http://127.0.0.1:8000/media/images/colar_perolas.webp)"
    }
]
```

#### `GET /produtos/<uuid:id>/`

Retorna as informações detalhadas de um único produto.

**Exemplo de Resposta (`200 OK`):**
```json
{
    "id": "uuid-do-produto-1",
    "nome": "Anel Solitário de Prata",
    "descricao": "Um anel elegante feito em prata 925 com uma zircônia central.",
    "preco": "250.00",
    "qtd_disponivel": 10,
    "peso": "0.050",
    "comprimento": "10.00",
    "largura": "10.00",
    "altura": "2.00",
    "dias_para_disponibilizar": 3,
    "categorias": [
        {
            "id": "f4g5h6j7-k8l9-1011-1213-141516abcdef",
            "nome_categoria": "Anel"
        }
    ],
    "imagens": [
        { "imagem": "[http://127.0.0.1:8000/media/images/anel_solitario_frente.webp](http://127.0.0.1:8000/media/images/anel_solitario_frente.webp)" },
        { "imagem": "[http://127.0.0.1:8000/media/images/anel_solitario_lado.webp](http://127.0.0.1:8000/media/images/anel_solitario_lado.webp)" }
    ],
    "detalhes": [
        { "propriedade": "Material", "descricao": "Prata 925" },
        { "propriedade": "Pedra", "descricao": "Zircônia" }
    ],
    "tamanhos": [
        { "id": "uuid-tamanho-15", "tamanho": { "nome": "Anel", "valor": "15" } },
        { "id": "uuid-tamanho-16", "tamanho": { "nome": "Anel", "valor": "16" } }
    ]
}
```

---

### 4. Frete

#### `POST /cotar-frete/`

Calcula as opções de frete para um determinado produto e CEP de destino.

**Exemplo de Request Body:**
```json
{
    "produto_id": "uuid-do-produto-1",
    "cep_destino": "22220-001"
}
```

**Exemplo de Resposta (`200 OK`):**
```json
[
    {
        "id": 1,
        "name": "PAC",
        "price": "21.50",
        "delivery_time": 8,
        "company": {
            "id": 1,
            "name": "Correios",
            "picture": "url-da-imagem-dos-correios"
        }
    },
    {
        "id": 2,
        "name": "SEDEX",
        "price": "35.80",
        "delivery_time": 3,
        "company": {
            "id": 1,
            "name": "Correios",
            "picture": "url-da-imagem-dos-correios"
        }
    }
]
```
**Exemplo de Resposta de Erro (`400 Bad Request`):**
```json
{
    "errors": "CEP de destino inválido."
}
```

---

### 5. Pedidos

#### `POST /pedidos/`

Cria um novo pedido no sistema e gera uma preferência de pagamento no Mercado Pago.

**Exemplo de Request Body:**
```json
{
    "contato_cliente": {
        "nome": "Ana",
        "sobrenome": "Silva",
        "cpf": "111.222.333-44",
        "email": "ana.silva@email.com",
        "whatsapp": "(11) 98888-7777"
    },
    "endereco_entrega": {
        "cep": "01311-000",
        "logradouro": "Avenida Paulista",
        "numero": 1500,
        "complemento": "Apto 505",
        "bairro": "Bela Vista",
        "cidade": "São Paulo",
        "uf": "SP"
    },
    "itens": [
        {
            "tamanho_id": "uuid-tamanho-15",
            "quantidade": 1
        }
    ],
    "frete_escolhido": {
        "transportadora": "Correios",
        "servico_id": 1,
        "preco_frete": "21.50",
        "entrega_estimada_dias": 8
    }
}
```
**Exemplo de Resposta (`201 Created`):**
```json
{
    "id": "uuid-do-novo-pedido",
    "status": "Aguardando Pagamento",
    "url_pagamento": "[https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=](https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=)...",
    "data_hora_criacao": "2025-09-15T05:30:00.123456-03:00"
}
```

**Exemplo de Resposta de Erro (`400 Bad Request`):**
```json
{
    "detail": "Estoque insuficiente para o produto 'Anel Solitário de Prata'."
}
```