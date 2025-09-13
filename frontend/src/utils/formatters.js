/**
 * Pega um objeto de produto complexo da API e o transforma em um formato
 * mais simples e direto para uso nos componentes do frontend.
 * @param {object} produtoDaApi - O objeto de produto vindo do seu ProdutoSerializer.
 * @returns {object} Um objeto de produto formatado.
 */
export const formatarProdutoParaFrontend = (produtoDaApi) => {
  if (!produtoDaApi) return null;

  // Pega a primeira imagem ou um placeholder
  const imagemPrincipal = produtoDaApi.imagens?.[0]?.imagem?.imagem || '/caminho/para/imagem_padrao.jpg';

  // Formata o preço para o padrão brasileiro
  const precoFormatado = `R$ ${parseFloat(produtoDaApi.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // Constrói o objeto final no formato desejado
  return {
    id: produtoDaApi.id,
    nome: produtoDaApi.nome,
    descricao: produtoDaApi.descricao,
    preco: precoFormatado,
    qtd_disponivel: produtoDaApi.qtd_disponivel,
    // Campo auxiliar usado pela página de Joias para exibir a miniatura
    __thumb: imagemPrincipal,
    // Alias opcional para usos futuros
    __image: imagemPrincipal,
    // Pega o nome da categoria do objeto aninhado
    categoria: { 
      nome_categoria: produtoDaApi.categoria?.nome_categoria?.toLowerCase() || 'sem-categoria' 
    },
    // Extrai e simplifica a lista de imagens
    imagens: produtoDaApi.imagens.map(img => ({ imagem: img.imagem?.imagem })),
    // Extrai e simplifica a lista de tamanhos
    tamanho: produtoDaApi.tamanhos.map(t => ({
      id: t.id,
      nome: `${t.tamanho.nome} ${t.tamanho.valor}`,
      valor: t.tamanho.valor
    })),
    // Extrai e simplifica a lista de detalhes
    detalhes: produtoDaApi.detalhes.map(d => ({
      propriedade: d.propriedade,
      descricao: d.descricao
    })),
    // Pega as informações de transporte do objeto aninhado
    peso: produtoDaApi.informacoes_transporte?.peso,
    comprimento: produtoDaApi.informacoes_transporte?.comprimento,
    largura: produtoDaApi.informacoes_transporte?.largura,
    altura: produtoDaApi.informacoes_transporte?.altura,
  };
};
