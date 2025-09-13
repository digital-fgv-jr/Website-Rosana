export const formatarProdutoParaFrontend = (produtoDaApi) => {
  if (!produtoDaApi) return null;

  // Pega a URL completa da primeira imagem.
  // O caminho correto é produto.imagens[0].imagem.imagem
  const imagemPrincipal = produtoDaApi.imagens?.[0]?.imagem?.imagem || '/placeholder.jpg';

  // Formata o preço para o padrão brasileiro (R$ 1.234,56)
  const precoFormatado = `R$ ${parseFloat(produtoDaApi.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // Constrói o objeto final no formato que a página Joias.jsx espera
  return {
    id: produtoDaApi.id,
    nome: produtoDaApi.nome,
    descricao: produtoDaApi.descricao,
    preco: precoFormatado,
    preco_num: parseFloat(produtoDaApi.preco), // Adiciona um campo numérico para filtros
    qtd_disponivel: produtoDaApi.qtd_disponivel,
    
    // Simplifica o objeto de categoria
    categoria: { 
      nome_categoria: produtoDaApi.categorias?.map(c => c.nome_categoria).join(', ') || 'sem-categoria' 
    },
    
    // Simplifica a lista de imagens para o formato esperado
    imagens: produtoDaApi.imagens.map(img => ({ imagem: img.imagem?.imagem })),
    
    // Simplifica a lista de tamanhos
    tamanho: produtoDaApi.tamanhos.map(t => ({
      id: t.id,
      nome: `${t.tamanho.nome} ${t.tamanho.valor}`,
      valor: t.tamanho.valor
    })),
    
    // Simplifica a lista de detalhes
    detalhes: produtoDaApi.detalhes.map(d => ({
      propriedade: d.propriedade,
      descricao: d.descricao
    })),

    // Pega as informações de transporte do objeto aninhado
    peso: produtoDaApi.informacoes_transporte?.peso,
    comprimento: produtoDaApi.informacoes_transporte?.comprimento,
    largura: produtoDaApi.informacoes_transporte?.largura,
    altura: produtoDaApi.informacoes_transporte?.altura,
    
    // Cria o campo __thumb que o componente Joias.jsx usa
    __thumb: imagemPrincipal
  };
};