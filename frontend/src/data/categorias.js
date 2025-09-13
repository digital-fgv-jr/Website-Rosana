import { getLojas } from '../api/services/lojaService';
import { getCategoriasByIdLoja } from '../api/services/categoriaService';

const mapCategoriaParamToSlug = (param) => {
  if (!param) return "todos";
  // Normaliza o texto: remove acentos e deixa em minúsculo
  const s = String(param)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (s === "aneis" || s === "anel") return "aneis";
  if (s === "brincos" || s === "brinco") return "brincos";
  if (s === "colares" || s === "colar" || s === "cordao") return "colares";
  if (s === "pingentes" || s === "pingente") return "pingentes";
  if (s === "braceletes" || s === "pulseira") return "braceletes"; // Unificando pulseira/bracelete
  
  // Para outros como 'filigrana' e 'todos', o 's' já estará correto
  return s;
};

/**
 * Busca as categorias da primeira loja e as formata para a UI,
 * incluindo a opção "Ver tudo".
 */
export const buscarEFormatarCategorias = async () => {
  try {
    const responseLojas = await getLojas();
    if (!responseLojas.data || responseLojas.data.length === 0) {
      console.warn("Nenhuma loja encontrada na API.");
      return [];
    }

    const primeiraLoja = responseLojas.data[0];
    const lojaId = primeiraLoja.id;
    const responseCatalogo = await getCategoriasByIdLoja(lojaId);
    
    // O serializer da API não retorna os produtos aqui, apenas a lista de categorias da loja
    const categoriasDaApi = responseCatalogo.data.categorias; 

    const categoriasFormatadas = categoriasDaApi.map(cat => ({
      // Usa a função padronizada para gerar o slug
      slug: mapCategoriaParamToSlug(cat.nome_categoria),
      label: cat.nome_categoria
    }));

    const categoriasUnicas = categoriasFormatadas.filter(
        (cat, index, self) => index === self.findIndex(c => c.slug === cat.slug)
    );

    // Adiciona a opção "Ver tudo" no início da lista
    return [
      { slug: "todos", label: "Ver tudo" },
      ...categoriasFormatadas
    ];

  } catch (error) {
    console.error("Erro ao buscar ou formatar as categorias:", error);
    return [{ slug: "todos", label: "Ver tudo" }]; // Retorna o mínimo em caso de erro
  }
};


export const categorias = [
  { id: 1, nome: "Anéis", slug: "aneis" },
  { id: 2, nome: "Brincos", slug: "brincos" },
  { id: 3, nome: "Colares", slug: "colares" },
  { id: 4, nome: "Filigrana", slug: "filigrana" },
  { id: 5, nome: "Pingentes", slug: "pingentes" },
];
