/**
 * Pega um objeto de produto complexo da API e o transforma em um formato
 * mais simples e direto para uso nos componentes do frontend.
 * @param {object} produtoDaApi - O objeto de produto vindo do seu ProdutoSerializer.
 * @returns {object} Um objeto de produto formatado.
 */
// Normaliza URLs de imagens vindas do backend para o ambiente atual (dev/prod)
const API_BASE = (import.meta?.env?.VITE_API_URL || '').replace(/\/+$/, '');
const PLACEHOLDER = '/placeholder.svg';

function normalizeImageUrl(url) {
  if (!url) return PLACEHOLDER;
  try {
    const base = API_BASE ? new URL(API_BASE) : null;
    const parsed = new URL(url, base || window.location.origin);
    // Se temos uma base de API definida e o host do URL não bater, reescreve para a base mantendo o caminho
    if (base && parsed.origin !== base.origin) {
      return new URL(parsed.pathname + parsed.search + parsed.hash, base).toString();
    }
    return parsed.toString();
  } catch (_e) {
    // Se for path relativo, prefixa com a base
    if (API_BASE && String(url).startsWith('/')) {
      return API_BASE + url;
    }
    return url;
  }
}

export const formatarProdutoParaFrontend = (produtoDaApi) => {
  if (!produtoDaApi) return null;

  // Pega a primeira imagem ou um placeholder
  const imagemPrincipal = normalizeImageUrl(
    produtoDaApi.imagens?.[0]?.imagem?.imagem
  );

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
    imagens: produtoDaApi.imagens.map(img => ({ imagem: normalizeImageUrl(img.imagem?.imagem) })),
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
