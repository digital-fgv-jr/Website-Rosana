import { getProdutos } from "../api/services/produtoService"
import { formatarProdutoParaFrontend } from "../utils/formatters"

export const buscarEFormatarProdutos  = async () => {
  try {
    // 1. Busca os produtos da API
    const response = await getProdutos();
    const produtosDaApi = response.data;

    // 2. Verifica se a resposta é uma lista
    if (!Array.isArray(produtosDaApi)) {
      console.error("A resposta da API de produtos não é uma lista.");
      return [];
    }

    // 3. Usa o adaptador para formatar cada produto da lista
    const produtosFormatados = produtosDaApi.map(formatarProdutoParaFrontend);

    return produtosFormatados;

  } catch (error) {
    console.error("Erro ao buscar e formatar produtos:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

export const produtos = [
  {
    id: 1,
    nome: "Anel Ouro 18K",
    descricao: "Anel em ouro 18K, acabamento polido e design sofisticado para todas as ocasiões.",
    preco: "R$ 1.200,00",
    qtd_disponivel: 1,
    categoria: { nome_categoria: "anel" },
    imagens: [{ imagem: "/produtos/produto1.jpg" }],
    tamanho: [{ id: 1, nome: "Anel 18", valor: "18" }],
    detalhes: [{ propriedade: "Material", descricao: "Ouro 18K" }],
    peso: "300.00",
    comprimento: "5.00",
    largura: "5.00",
    altura: "5.00"
  },
  {
    id: 2,
    nome: "Brincos de Pérola",
    descricao: "Brincos clássicos com pérolas naturais, delicados e elegantes.",
    preco: "R$ 850,00",
    qtd_disponivel: 5,
    categoria: { nome_categoria: "brincos" },
    imagens: [{ imagem: "/produtos/produto2.jpg" }],
    tamanho: [],
    detalhes: [{ propriedade: "Material", descricao: "Pérola natural e ouro 18K" }],
    peso: "50.00",
    comprimento: "2.00",
    largura: "1.50",
    altura: "1.50"
  },
  {
    id: 3,
    nome: "Colar Filigrana",
    descricao: "Colar em prata filigranada, acabamento artesanal que garante exclusividade.",
    preco: "R$ 1.500,00",
    qtd_disponivel: 3,
    categoria: { nome_categoria: "cordao" },
    imagens: [{ imagem: "/produtos/produto3.jpg" }],
    tamanho: [{ id: 1, nome: "45 cm", valor: "45" }],
    detalhes: [{ propriedade: "Material", descricao: "Prata 925" }],
    peso: "120.00",
    comprimento: "45.00",
    largura: "0.30",
    altura: "0.30"
  },
  {
    id: 4,
    nome: "Pingente Coração",
    descricao: "Pingente delicado em ouro, perfeito para presentear quem você ama.",
    preco: "R$ 420,00",
    qtd_disponivel: 10,
    categoria: { nome_categoria: "pingente" },
    imagens: [{ imagem: "/produtos/produto4.jpg" }],
    tamanho: [],
    detalhes: [{ propriedade: "Material", descricao: "Ouro 18K" }],
    peso: "15.00",
    comprimento: "2.00",
    largura: "1.50",
    altura: "0.50"
  },
  {
    id: 5,
    nome: "Anel Solitário",
    descricao: "Anel com pedra central de alta qualidade, ideal para ocasiões especiais.",
    preco: "R$ 2.300,00",
    qtd_disponivel: 2,
    categoria: { nome_categoria: "anel" },
    imagens: [{ imagem: "/produtos/produto5.jpg" }],
    tamanho: [{ id: 1, nome: "Anel 16", valor: "16" }],
    detalhes: [{ propriedade: "Pedra", descricao: "Diamante lapidado" }],
    peso: "250.00",
    comprimento: "5.00",
    largura: "5.00",
    altura: "5.00"
  },
  {
    id: 6,
    nome: "Brincos Geométricos",
    descricao: "Brincos modernos com design geométrico, feitos em prata 925.",
    preco: "R$ 670,00",
    qtd_disponivel: 4,
    categoria: { nome_categoria: "brincos" },
    imagens: [{ imagem: "/produtos/produto6.jpg" }],
    tamanho: [],
    detalhes: [{ propriedade: "Material", descricao: "Prata 925" }],
    peso: "60.00",
    comprimento: "2.50",
    largura: "1.00",
    altura: "0.50"
  },
  {
    id: 7,
    nome: "Colar Minimalista",
    descricao: "Colar discreto e elegante, perfeito para usar no dia a dia ou em eventos.",
    preco: "R$ 980,00",
    qtd_disponivel: 6,
    categoria: { nome_categoria: "cordao" },
    imagens: [{ imagem: "/produtos/produto7.jpg" }],
    tamanho: [{ id: 1, nome: "50 cm", valor: "50" }],
    detalhes: [{ propriedade: "Material", descricao: "Prata 925" }],
    peso: "110.00",
    comprimento: "50.00",
    largura: "0.25",
    altura: "0.25"
  },
  {
    id: 8,
    nome: "Pingente Estrela",
    descricao: "Pingente em ouro, com design delicado em formato de estrela.",
    preco: "R$ 510,00",
    qtd_disponivel: 12,
    categoria: { nome_categoria: "pingente" },
    imagens: [{ imagem: "/produtos/produto8.jpg" }],
    tamanho: [],
    detalhes: [{ propriedade: "Material", descricao: "Ouro 18K" }],
    peso: "18.00",
    comprimento: "2.00",
    largura: "1.50",
    altura: "0.50"
  },
  {
    id: 9,
    nome: "Anel Duplo",
    descricao: "Anel duplo com acabamento polido, ideal para quem gosta de ousar.",
    preco: "R$ 1.050,00",
    qtd_disponivel: 2,
    categoria: { nome_categoria: "anel" },
    imagens: [{ imagem: "/produtos/produto9.jpg" }],
    tamanho: [{ id: 1, nome: "Anel 17", valor: "17" }],
    detalhes: [{ propriedade: "Design", descricao: "Modelo duplo estilizado" }],
    peso: "280.00",
    comprimento: "5.00",
    largura: "5.00",
    altura: "5.00"
  },
  {
    id: 10,
    nome: "Pulseira Elegance",
    descricao: "Pulseira delicada em ouro branco, com fecho reforçado e design atemporal.",
    preco: "R$ 1.100,00",
    qtd_disponivel: 3,
    categoria: { nome_categoria: "pulseira" },
    imagens: [{ imagem: "/produtos/produto10.jpg" }],
    tamanho: [{ id: 1, nome: "19 cm", valor: "19" }],
    detalhes: [{ propriedade: "Material", descricao: "Ouro branco 18K" }],
    peso: "90.00",
    comprimento: "19.00",
    largura: "0.30",
    altura: "0.30"
  },
  {
    id: 11,
    nome: "Brincos de Esmeralda",
    descricao: "Brincos em ouro com pedras de esmeralda natural, sofisticados e vibrantes.",
    preco: "R$ 2.800,00",
    qtd_disponivel: 2,
    categoria: { nome_categoria: "brincos" },
    imagens: [{ imagem: "/produtos/produto11.jpg" }],
    tamanho: [],
    detalhes: [{ propriedade: "Pedra", descricao: "Esmeralda natural" }],
    peso: "55.00",
    comprimento: "2.20",
    largura: "1.80",
    altura: "0.60"
  },
  {
    id: 12,
    nome: "Colar Pérola Clássico",
    descricao: "Colar de pérolas cultivadas, tradicional e elegante para ocasiões formais.",
    preco: "R$ 3.200,00",
    qtd_disponivel: 1,
    categoria: { nome_categoria: "cordao" },
    imagens: [{ imagem: "/produtos/produto12.jpg" }],
    tamanho: [{ id: 1, nome: "42 cm", valor: "42" }],
    detalhes: [{ propriedade: "Material", descricao: "Pérolas cultivadas e ouro 18K" }],
    peso: "200.00",
    comprimento: "42.00",
    largura: "0.40",
    altura: "0.40"
  },
  {
    id: 13,
    nome: "Pingente Flor de Lis",
    descricao: "Pingente artesanal em prata com design inspirado na flor de lis.",
    preco: "R$ 360,00",
    qtd_disponivel: 8,
    categoria: { nome_categoria: "pingente" },
    imagens: [{ imagem: "/produtos/produto13.jpg" }],
    tamanho: [],
    detalhes: [{ propriedade: "Material", descricao: "Prata 925" }],
    peso: "20.00",
    comprimento: "2.50",
    largura: "2.00",
    altura: "0.50"
  },
  {
    id: 14,
    nome: "Anel Rubi Imperial",
    descricao: "Anel imponente em ouro amarelo com rubi central de alta qualidade.",
    preco: "R$ 4.500,00",
    qtd_disponivel: 1,
    categoria: { nome_categoria: "anel" },
    imagens: [{ imagem: "/produtos/produto14.jpg" }],
    tamanho: [{ id: 1, nome: "Anel 19", valor: "19" }],
    detalhes: [{ propriedade: "Pedra", descricao: "Rubi natural" }],
    peso: "310.00",
    comprimento: "5.50",
    largura: "5.00",
    altura: "5.00"
  },
  {
    id: 15,
    nome: "Pulseira Corrente Fina",
    descricao: "Pulseira corrente em prata, simples e versátil para uso diário.",
    preco: "R$ 480,00",
    qtd_disponivel: 6,
    categoria: { nome_categoria: "pulseira" },
    imagens: [{ imagem: "/produtos/produto15.jpg" }],
    tamanho: [{ id: 1, nome: "20 cm", valor: "20" }],
    detalhes: [{ propriedade: "Material", descricao: "Prata 925" }],
    peso: "75.00",
    comprimento: "20.00",
    largura: "0.20",
    altura: "0.20"
  },
  {
    id: 16,
    nome: "Brincos de Diamante",
    descricao: "Brincos clássicos em ouro branco com diamantes lapidados.",
    preco: "R$ 6.200,00",
    qtd_disponivel: 2,
    categoria: { nome_categoria: "brincos" },
    imagens: [{ imagem: "/produtos/produto16.jpg" }],
    tamanho: [],
    detalhes: [{ propriedade: "Pedra", descricao: "Diamante lapidado 0.5 ct" }],
    peso: "45.00",
    comprimento: "1.50",
    largura: "1.50",
    altura: "0.50"
  },
  {
    id: 17,
    nome: "Colar Estrela do Norte",
    descricao: "Colar em ouro com pingente de estrela cravejada de zircônias.",
    preco: "R$ 1.750,00",
    qtd_disponivel: 4,
    categoria: { nome_categoria: "cordao" },
    imagens: [{ imagem: "/produtos/produto17.jpg" }],
    tamanho: [{ id: 1, nome: "48 cm", valor: "48" }],
    detalhes: [{ propriedade: "Pedras", descricao: "Zircônias brancas" }],
    peso: "130.00",
    comprimento: "48.00",
    largura: "0.35",
    altura: "0.35"
  },
  {
    id: 18,
    nome: "Pingente Lua Crescente",
    descricao: "Pingente estilizado em prata com formato de lua crescente.",
    preco: "R$ 400,00",
    qtd_disponivel: 7,
    categoria: { nome_categoria: "pingente" },
    imagens: [{ imagem: "/produtos/produto18.jpg" }],
    tamanho: [],
    detalhes: [{ propriedade: "Material", descricao: "Prata 925 polida" }],
    peso: "22.00",
    comprimento: "2.00",
    largura: "1.50",
    altura: "0.40"
  }
];
