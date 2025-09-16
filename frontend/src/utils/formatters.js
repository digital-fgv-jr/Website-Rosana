// Normaliza URLs de imagens vindas do backend para o ambiente atual (dev/prod)
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const PLACEHOLDER = '/placeholder.svg';

function normalizeImageUrl(url) {
  if (!url) return PLACEHOLDER;
  // Em dev, a VITE_API_URL é '/api', que não é uma base de URL válida.
  // Nesse caso, o proxy do Vite já resolve o caminho, então o caminho relativo já funciona.
  if (API_BASE.startsWith('http')) {
    try {
      // Em produção, montamos a URL completa.
      return new URL(url, API_BASE).toString();
    } catch (e) {
      return url; // Fallback
    }
  }
  // Para ambiente de dev com proxy, o caminho relativo como está já é o correto.
  return url;
}

/**
 * Pega um objeto de produto da API e o transforma em um formato padronizado.
 * @param {object} produtoDaApi - O objeto de produto vindo do backend.
 * @returns {object} Um objeto de produto formatado.
 */

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

  const imagemPrincipal = normalizeImageUrl(
    produtoDaApi.primeira_imagem || produtoDaApi.imagens?.[0]?.imagem
  );

  const precoFormatado = `R$ ${parseFloat(produtoDaApi.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return {
    id: produtoDaApi.id,
    nome: produtoDaApi.nome,
    preco: precoFormatado,
    categorias: produtoDaApi.categorias || [],
    __thumb: imagemPrincipal, // Alias para a lista de produtos

    // Campos de detalhe com fallback
    descricao: produtoDaApi.descricao || '',
    qtd_disponivel: produtoDaApi.qtd_disponivel || 0,
    
    imagens: (produtoDaApi.imagens || []).map(img => ({ 
      imagem: normalizeImageUrl(img.imagem) 
    })),
    
    tamanhos: (produtoDaApi.tamanhos || []).map(t => ({
      id: t.id,
      nome: `${t.tamanho.nome} ${t.tamanho.valor}`,
      valor: t.tamanho.valor
    })),
    
    detalhes: (produtoDaApi.detalhes || []).map(d => ({
      propriedade: d.propriedade,
      descricao: d.descricao
    })),
    
    peso: produtoDaApi.peso,
    comprimento: produtoDaApi.comprimento,
    largura: produtoDaApi.largura,
    altura: produtoDaApi.altura,
  };
};
