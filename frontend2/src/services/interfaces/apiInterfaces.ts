export type UUID = string;

export interface LojaNested {
  id: UUID;
  apelido: string;
}

export interface Contato {
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  whatsapp: string;
}

export interface ContatoLoja {
  contato: Contato;
  instagram: string;
  cnpj: string;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Loja {
  id: UUID;
  apelido: string;
  contato_loja: ContatoLoja;
  enderecos: Endereco[];
}

export interface CategoriaNested {
  id: UUID;
  nome_categoria: string;
}

export interface Categoria {
  id: UUID;
  nome_categoria: string;
  nome_plural: string;
  loja: LojaNested;
  primeira_imagem: string | null; // URL ou null
}

export interface ImagemProduto {
  imagem: string; // URL
}

export interface DetalheProduto {
  propriedade: string;
  descricao: string;
}

export interface Tamanho {
  nome: string;
  valor: string;
}

export interface TamanhoProduto {
  id: UUID;
  tamanho: Tamanho;
}

export interface ProdutoListItem {
  id: UUID;
  nome: string;
  preco: number;
  categorias: CategoriaNested[];
  primeira_imagem: string | null; // URL ou null
}

export interface ProdutoDetail {
  id: UUID;
  nome: string;
  descricao: string;
  preco: number;
  qtd_disponivel: number;
  peso: number;
  comprimento: number;
  largura: number;
  altura: number;
  dias_para_disponibilizar: number;
  categorias: CategoriaNested[];
  imagens: ImagemProduto[];
  detalhes: DetalheProduto[];
  tamanhos: TamanhoProduto[];
}

// Para Frete (resposta da API externa Melhor Envio, estrutura aproximada baseada no código)
// A resposta real pode variar, mas tipamos como any[] por enquanto, ou refine com base em docs da API.
export interface FreteOption {
  // Exemplo genérico; ajuste conforme a resposta real da Melhor Envio
  id: number;
  name: string;
  price: number;
  delivery_time: number;
  // ... outras propriedades da API
}

export interface FreteItemInput {
  produto_id: UUID;
  quantidade: number;
}

export interface FreteQuoteInput {
  cep_destino: string;
  itens: FreteItemInput[];
}

export interface ItemPedidoInput {
  tamanho_id: UUID;
  quantidade: number;
}

export interface FreteEscolhidoInput {
  transportadora: string;
  servico_id: number;
  preco_frete: number;
  entrega_estimada_dias: number;
}

export interface ContatoClienteInput extends Contato {} // Reusa Contato

export interface EnderecoEntregaInput extends Endereco {} // Reusa Endereco, mas sem id/loja

export interface PedidoCreateInput {
  contato_cliente: ContatoClienteInput;
  endereco_entrega: EnderecoEntregaInput;
  itens: ItemPedidoInput[];
  frete_escolhido: FreteEscolhidoInput;
}

export interface PedidoCreated {
  id: UUID;
  status: string;
  url_pagamento: string;
  data_hora_criacao: string; // ISO date string
}