// Normaliza URLs de imagens vindas do backend para o ambiente atual (dev/prod)
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const PLACEHOLDER = '/placeholder.svg';

function normalizeImageUrl(url) {
  if (!url) return PLACEHOLDER;
  try {
    // Tenta criar uma URL absoluta. Se a base for um caminho relativo, usa a origem da janela.
    const base = API_BASE.startsWith('http') ? new URL(API_BASE) : new URL(window.location.origin);
    const parsed = new URL(url, base);
    return parsed.toString();
  } catch (_e) {
    if (API_BASE && String(url).startsWith('/')) {
      return API_BASE + url;
    }
    return url;
  }
}

/**
 * Pega um objeto de produto da API (seja da lista ou do detalhe) e o transforma 
 * em um formato padronizado para uso nos componentes do frontend.
 * @param {object} produtoDaApi - O objeto de produto vindo do backend.
 * @returns {object} Um objeto de produto formatado.
 */
export const formatarProdutoParaFrontend = (produtoDaApi) => {
  if (!produtoDaApi) return null;

  // Lógica aprimorada para imagem:
  // Prioriza 'primeira_imagem' (da lista) ou a primeira de 'imagens' (do detalhe).
  const imagemPrincipal = normalizeImageUrl(
    produtoDaApi.primeira_imagem || produtoDaApi.imagens?.[0]?.imagem
  );

  // Formata o preço para o padrão brasileiro
  const precoFormatado = `R$ ${parseFloat(produtoDaApi.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // Constrói o objeto final no formato desejado
  return {
    id: produtoDaApi.id,
    nome: produtoDaApi.nome,
    preco: precoFormatado,
    categorias: produtoDaApi.categorias || [],

    // Campo auxiliar usado pelos cards de produto na lista
    __thumb: imagemPrincipal,

    // --- Campos que podem ou não existir (só vêm na versão de detalhe) ---
    // Usamos '|| []' ou '|| 0' como fallback para evitar erros.
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