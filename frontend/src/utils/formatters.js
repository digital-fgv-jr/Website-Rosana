// Normaliza URLs de imagens vindas do backend para o ambiente atual (dev/prod)
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const PLACEHOLDER = '/placeholder.svg';

function normalizeImageUrl(url) {
  if (!url) return PLACEHOLDER;
  
  // Se a URL já for absoluta (começa com http), não faz nada
  if (url.startsWith('http')) {
    return url;
  }
  
  // Se for relativa, constrói a URL completa usando a base da API
  try {
    // Garante que a VITE_API_URL seja uma base válida
    const base = API_BASE.startsWith('http') ? API_BASE : window.location.origin;
    return new URL(url, base).toString();
  } catch (e) {
    return url; // Fallback
  }
}

/**
 * Pega um objeto de produto da API e o transforma em um formato padronizado.
 * @param {object} produtoDaApi - O objeto de produto vindo do backend.
 * @returns {object} Um objeto de produto formatado.
 */
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