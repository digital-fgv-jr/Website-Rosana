import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { produtos } from "../data/produtos";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DropdownSection from "../components/DropdownSection";

export default function Joias() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const categoriaInicial = params.get("categoria") || "todos";

  const [categoriaFiltro, setCategoriaFiltro] = useState(categoriaInicial);
  const [visibleCount, setVisibleCount] = useState(9);

  // Atualiza o filtro se a URL mudar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategoriaFiltro(params.get("categoria") || "todos");
  }, [location.search]);

  // Produtos filtrados
  const produtosFiltrados = produtos.filter(
    (p) => categoriaFiltro === "todos" || p.categoria.nome_categoria === categoriaFiltro
  );

  // Função para mudar filtro e atualizar URL
  const mudarFiltro = (novaCategoria) => {
    navigate(`/joias?categoria=${novaCategoria}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header />

      <main className="flex-grow bg-[#faf9f6] py-12 px-6">
        {/* Título e botões */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 max-w-6xl mx-auto">
          <h1 className="text-[230%] font-BodoniMT text-[#1c2c3c] mb-4 sm:mb-0">
            Joias
          </h1>

          <div className="flex flex-wrap gap-2">
            {["todos", "anel", "brinco", "colar", "filigrana", "pingente"].map((cat) => (
              <button
                key={cat}
                onClick={() => mudarFiltro(cat)}
                className={`px-4 py-2 text-[110%] font-BodoniMT transition
                  ${
                    categoriaFiltro === cat
                      ? "bg-[#1c2c3c] text-white"
                      : "bg-[#faf9f6] hover:bg-[#c0c0c0] text-[#1c2c3c]"
                  }`}
              >
                {cat === "todos" ? "Ver tudo" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Linha de informações */}
        <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
          <p className="font-BodoniMT text-[#1c2c3c] text-[140%]">
            {produtosFiltrados.length} produtos encontrados
          </p>

          <button className="px-4 py-2 text-[110%] font-BodoniMT bg-[#faf9f6] hover:bg-[#c0c0c0] transition">
            Filtrar
          </button>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {produtosFiltrados.slice(0, visibleCount).map((produto) => (
            <Link
              key={produto.id}
              to={`/produto/${produto.id}`}
              className="bg-[#faf9f6] font-MontserratRegular overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
            >
              <img
                src={produto.imagens[0].imagem}
                alt={produto.nome}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 text-left">
                <h2 className="text-lg font-semibold">{produto.nome}</h2>
                <p className="text-gray-600 mt-2">{produto.preco}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Botão carregar mais */}
        {visibleCount < produtosFiltrados.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className="px-6 py-2 bg-[#1c2c3c] text-[#faf9f6] font-MontserratRegular rounded hover:bg-[#25384d] transition"
            >
              Exibir mais
            </button>
          </div>
        )}
      </main>

      <DropdownSection />
      <Footer />
    </div>
  );
}
