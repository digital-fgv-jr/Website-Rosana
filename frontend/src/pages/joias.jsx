import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { buscarEFormatarProdutos } from "../data/produtos";
import { buscarEFormatarCategorias } from "../data/categorias";
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import PreFooter from "../components/PreFooter";
import WhatsApp from "../components/Atoms/WhatsApp";
import Filtros from "../components/Filtros/Filtros";
import FiltroProdutos from "../components/FiltroProdutos";

/* ========================= Helpers ========================= */
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const PLACEHOLDER = '/placeholder.svg';

function normalizeImageUrl(url) {
  if (!url) return PLACEHOLDER;
  if (API_BASE.startsWith('http')) {
    try { return new URL(url, API_BASE).toString(); } 
    catch (e) { return url; }
  }
  return url;
}

const mapCategoriaParamToSlug = (param) => {
  if (!param) return "todos";
  return String(param).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getMateriaisFromProduto = (p) => {
  const out = new Set();
  const det = Array.isArray(p?.detalhes) ? p.detalhes : [];
  for (const d of det) {
    const prop = String(d?.propriedade || "").toLowerCase();
    if (/(material|materiais|pedra|pedras)/.test(prop)) {
      String(d?.descricao || "").split(/,|\/|;|\|/).forEach(m => {
        if (m.trim()) out.add(m.trim());
      });
    }
  }
  return Array.from(out);
};

const norm = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/* ========================= Página ========================= */
export default function Joias() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const categoriaQuery = params.get("categoria") || "todos";
  const termoBuscaQuery = params.get("q") || "";

  const [categoriaFiltro, setCategoriaFiltro] = useState(mapCategoriaParamToSlug(categoriaQuery));
  const [visibleCount, setVisibleCount] = useState(9);
  
  const [openFiltro, setOpenFiltro] = useState(false);
  const [materiaisSel, setMateriaisSel] = useState([]);
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setLoading(true);
      setError(null);
      try {
        const [produtosDaApi, categoriasDaApi] = await Promise.all([
          buscarEFormatarProdutos(),
          buscarEFormatarCategorias()
        ]);
        setProdutos(produtosDaApi);
        setCategorias(categoriasDaApi);
      } catch (err) {
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    setCategoriaFiltro(mapCategoriaParamToSlug(categoriaQuery));
  }, [categoriaQuery]);

  const materiaisDisponiveis = useMemo(() => {
      const seen = new Map();
      if(produtos && produtos.length > 0) {
        for (const p of produtos) {
          for (const m of getMateriaisFromProduto(p)) {
            const key = String(m).toLowerCase();
            if (!seen.has(key)) seen.set(key, m.trim());
          }
        }
      }
      return Array.from(seen.values()).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    const termoBuscaNormalizado = norm(termoBuscaQuery);

    return produtos.filter(p => {
      if (!p) return false;
      const matchCategoria = categoriaFiltro === "todos" || (p.categorias && p.categorias.some(cat => mapCategoriaParamToSlug(cat.nome_categoria) === categoriaFiltro));
      if (!matchCategoria) return false;

      if (termoBuscaNormalizado) {
        const nomeNormalizado = norm(p.nome);
        const descricaoNormalizada = norm(p.descricao);
        const categoriasNormalizadas = (p.categorias || []).map(c => norm(c.nome_categoria)).join(' ');
        const matchBusca =
          nomeNormalizado.includes(termoBuscaNormalizado) ||
          descricaoNormalizada.includes(termoBuscaNormalizado) ||
          categoriasNormalizadas.includes(termoBuscaNormalizado);
        if (!matchBusca) return false;
      }

      const matchMateriais = materiaisSel.length === 0 || materiaisSel.some(m => getMateriaisFromProduto(p).map(mat => norm(mat)).includes(norm(m)));
      if (!matchMateriais) return false;

      const precoProduto = parseFloat(String(p.preco).replace('R$', '').replace(/\./g, '').replace(',', '.'));
      const matchPreco = (precoMin === '' || isNaN(parseFloat(precoMin)) || precoProduto >= parseFloat(precoMin)) && (precoMax === '' || isNaN(parseFloat(precoMax)) || precoProduto <= parseFloat(precoMax));
      if (!matchPreco) return false;

      return true;
    });
  }, [produtos, categoriaFiltro, termoBuscaQuery, materiaisSel, precoMin, precoMax]);
  
  // ==================== FUNÇÃO CORRIGIDA ====================
  const mudarFiltroCategoria = (slug) => {
    // Se o slug for "todos", limpa todos os filtros e navega para a página base.
    if (slug === 'todos') {
        navigate("/joias");
    } else {
        // Para outras categorias, mantém os outros filtros (como a busca `q`) e apenas ajusta a categoria.
        const newParams = new URLSearchParams(location.search);
        newParams.set('categoria', slug);
        navigate(`/joias?${newParams.toString()}`);
    }
    setVisibleCount(9); // Reseta a contagem de produtos visíveis em ambos os casos
  };
  // ==========================================================
  
  const aplicarFiltrosAvancados = (payload = {}) => {
    setMateriaisSel(payload.materiaisSel || []);
    setPrecoMin(payload.precoMin || "");
    setPrecoMax(payload.precoMax || "");
    setVisibleCount(9);
  };

  if (loading) { return <div className="min-h-screen flex justify-center items-center bg-[#faf9f6]"><p className="text-xl font-BodoniMT">Carregando joias...</p></div>; }
  if (error) { return <div className="min-h-screen flex justify-center items-center bg-[#faf9f6]"><p className="text-xl text-red-600 font-BodoniMT">{error}</p></div>; }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header />
      <div id="header-sentinel" />
      <HeaderCompact />

      <main className="flex-grow bg-[#faf9f6] py-12 px-6">
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-[230%] font-BodoniMT text-[#1c2c3c]">Joias</h1>
            <div className="-mx-6 px-6 sm:mx-0 sm:flex sm:items-center sm:gap-2">
              <Filtros
                categorias={categorias}
                categoriaAtiva={categoriaFiltro}
                onFiltroClick={mudarFiltroCategoria}
              />
              <button
                onClick={() => setOpenFiltro(true)}
                className="hidden sm:inline-flex shrink-0 snap-start px-4 py-2 text-[95%] font-MontserratRegular rounded-lg bg-[#faf9f6] text-[#1c2c3c] hover:bg-[#c2b280] hover:text-white hover:shadow-lg hover:scale-105 border border-gray-300"
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
          <p className="font-BodoniMT text-[#1c2c3c] text-[140%]">
            {termoBuscaQuery ? `Resultados para "${termoBuscaQuery}": ` : ''}
            {produtosFiltrados.length} produtos encontrados
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {produtosFiltrados.slice(0, visibleCount).map((produto) => (
            <Link key={produto.id} to={`/produto/${produto.id}`} className="bg-brancoperola font-MontserratRegular overflow-hidden transform transition-all duration-300 rounded-md hover:rounded-xl hover:scale-105 hover:shadow-xl border border-transparent hover:border-[#c2b280]">
              <div className="w-full aspect-square sm:aspect-[4/3] md:h-64 overflow-hidden bg-[#f1efe9]">
                <img src={normalizeImageUrl(produto.__thumb)} alt={produto.nome} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }} />
              </div>
              <div className="p-3 sm:p-4 text-left">
                <h2 className="text-[0.95rem] sm:text-lg font-semibold line-clamp-2">{produto.nome}</h2>
                <p className="text-gray-600 mt-1 sm:mt-2 text-[0.9rem]">{produto.preco}</p>
              </div>
            </Link>
          ))}
        </div>
        
        {visibleCount < produtosFiltrados.length && (
          <div className="flex justify-center mt-6">
            <button onClick={() => setVisibleCount(prev => prev + 9)} className="px-6 py-2 bg-[#1c2c3c] text-[#faf9f6] font-MontserratRegular rounded hover:bg-[#25384d] transition">
              Exibir mais
            </button>
          </div>
        )}
      </main>

      <FiltroProdutos
        open={openFiltro}
        onClose={() => setOpenFiltro(false)}
        onApply={aplicarFiltrosAvancados}
        onResetAll={() => navigate("/joias")}
        materiaisDisponiveis={materiaisDisponiveis}
        initial={{ materiaisSel, precoMin, precoMax }}
      />
      
      <WhatsApp position={openFiltro ? "left" : "right"} />
      <PreFooter />
      <Footer />
    </div>
  );
}