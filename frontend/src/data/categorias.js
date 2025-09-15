import { getCategorias as getCategoriasFromApi } from '../api/services/categoriaService';

/**
 * Normaliza o nome de uma categoria para um 'slug' (identificador em minúsculas e sem acentos).
 * @param {string} param - O nome da categoria.
 * @returns {string} O slug normalizado.
 */
export const mapCategoriaParamToSlug = (param) => {
  if (!param) return "todos";
  return String(param)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

/**
 * Busca as categorias da API e as formata para uso na UI (filtros, etc.),
 * incluindo a opção "Ver tudo".
 */
export const buscarEFormatarCategorias = async () => {
  try {
    // 1. Busca todas as categorias diretamente da API.
    const response = await getCategoriasFromApi();
    const categoriasDaApi = response.data;

    // 2. Garante que a resposta é uma lista.
    if (!Array.isArray(categoriasDaApi)) {
      console.warn("API não retornou uma lista de categorias.");
      return [];
    }
    
    // 3. Formata cada categoria para o formato { slug, label }.
    const categoriasFormatadas = categoriasDaApi.map(cat => ({
      slug: mapCategoriaParamToSlug(cat.nome_categoria),
      label: cat.nome_categoria // Usamos o nome original para exibição
    }));

    // 4. Adiciona a opção "Ver tudo" no início da lista.
    return [
      { slug: "todos", label: "Ver tudo" },
      ...categoriasFormatadas
    ];

  } catch (error) {
    console.error("Erro ao buscar ou formatar as categorias:", error);
    // Retorna um valor padrão para a UI não quebrar em caso de erro.
    return [{ slug: "todos", label: "Ver tudo" }];
  }
};