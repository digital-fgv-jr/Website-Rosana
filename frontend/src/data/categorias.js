import { getCategorias as getCategoriasFromApi } from '../api/services/categoriaService';

const mapCategoriaParamToSlug = (param) => {
  if (!param) return "todos";
  return String(param).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const buscarEFormatarCategorias = async () => {
  try {
    const response = await getCategoriasFromApi();
    if (!Array.isArray(response.data)) {
      return [];
    }
    const categoriasFormatadas = response.data.map(cat => ({
      slug: mapCategoriaParamToSlug(cat.nome_categoria),
      label: cat.nome_categoria
    }));
    return [
      { slug: "todos", label: "Ver tudo" },
      ...categoriasFormatadas
    ];
  } catch (error) {
    console.error("Erro ao buscar ou formatar as categorias:", error);
    return [{ slug: "todos", label: "Ver tudo" }];
  }
};