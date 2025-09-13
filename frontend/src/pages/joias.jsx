import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { buscarEFormatarProdutos } from "../data/produtos";
import { buscarEFormatarCategorias } from "../data/categorias";
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import PreFooter from "../components/PreFooter";
import WhatsApp from "../components/Atoms/WhatsApp";
import FiltroProdutos from "../components/FiltroProdutos";

/* ========================= Helpers ========================= */
const parseNumberSmart = (v) => {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  let s = String(v).replace(/[^0-9.,-]/g, "").trim();
  if (!s) return null;
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  if (hasComma && hasDot) {
    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");
    const decimalSep = lastComma > lastDot ? "," : ".";
    const thousandSep = decimalSep === "," ? "." : ",";
    s = s.replace(new RegExp("\\" + thousandSep, "g"), "");
    s = s.replace(decimalSep, ".");
  } else if (hasComma) {
    s = s.replace(/\./g, "");
    s = s.replace(",", ".");
  } else if (hasDot) {
    const parts = s.split(".");
    if (parts.length > 2) {
      const last = parts.pop();
      s = parts.join("") + "." + last;
    }
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const precoNum = (p) => {
  if (!p) return 0;
  if (typeof p.preco_num === "number") return p.preco_num;
  const parsed = parseNumberSmart(p?.preco);
  return parsed ?? 0;
};

const parsePesoGramas = (raw) => {
  if (!raw) return null;
  const s = String(raw).toLowerCase();
  const n = parseNumberSmart(s);
  if (n === null) return null;
  if (s.includes("kg")) return n * 1000;
  return n;
};
const pesoNum = (p) => (typeof p?.peso_g === "number" ? p.peso_g : parsePesoGramas(p?.peso));
const parseTamanho = (raw) => {
  if (!raw) return null;
  const s = String(raw).toLowerCase();
  const n = parseNumberSmart(s);
  return n;
};
const tamanhoNum = (p) => parseTamanho(p?.tamanho ?? p?.comprimento ?? p?.altura ?? p?.largura);
const norm = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Extrai materiais a partir do seu dataset (usa detalhes[propriedade/descricao]) */
const splitTokens = (txt) =>
  String(txt || "")
    .split(/,|\/|;|\||\s+e\s+|\s+and\s+/i)
    .map((t) => t.trim())
    .filter(Boolean);

const getMateriaisFromProduto = (p) => {
  const out = [];
  const det = Array.isArray(p?.detalhes) ? p.detalhes : [];
  for (const d of det) {
    const prop = String(d?.propriedade || "").toLowerCase();
    if (/(material|materiais|pedra|pedras)/.test(prop)) {
      out.push(...splitTokens(d?.descricao));
    }
  }
  // Se quiser incluir pistas da descrição geral, descomente abaixo:
  // out.push(...splitTokens(p?.descricao));
  return out;
};

/** Categoria do produto (dataset usa { nome_categoria }) */
const getCategoriaSlugFromProduto = (p) =>
  String(p?.categoria?.nome_categoria || p?.categoria || "").toLowerCase();

/** Mapeia aliases da URL/UI -> slug real do dataset */
const mapCategoriaParamToSlug = (param) => {
  if (!param) return "todos";
  // Normaliza o texto: remove acentos e deixa em minúsculo
  const s = String(param)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (s === "aneis" || s === "anel") return "anel";
  if (s === "brincos" || s === "brinco") return "brinco";
  if (s === "colares" || s === "colar" || s === "cordao") return "colar";
  if (s === "pingentes" || s === "pingente") return "pingente";
  if (s === "braceletes" || s === "pulseira") return "bracelete"; // Unificando pulseira/bracelete
  
  // Para outros como 'filigrana' e 'todos', o 's' já estará correto
  return s;
};

/* ========================= Página ========================= */
export default function Joias() {
  const navigate = useNavigate();
  const location = useLocation();

  const [produtos, setProdutos] = useState([]); // Começa como um array vazio
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);   // Estado para controlar o carregamento
  const [error, setError] = useState(null);       // Estado para erros

  const params = new URLSearchParams(location.search);
  const categoriaInicial = mapCategoriaParamToSlug(params.get("categoria") || "todos");

  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
  const [visibleCount, setVisibleCount] = useState(9);

  const [openFiltro, setOpenFiltro] = useState(false);
  const [materiaisSel, setMateriaisSel] = useState([]);
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [pesoMin, setPesoMin] = useState("");
  const [pesoMax, setPesoMax] = useState("");
  const [tamMin, setTamMin] = useState("");
  const [tamMax, setTamMax] = useState("");

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        // Usa Promise.all para carregar produtos e categorias em paralelo
        const [produtosDaApi, categoriasDaApi] = await Promise.all([
          buscarEFormatarProdutos(),
          buscarEFormatarCategorias()
        ]);
        
        setProdutos(produtosDaApi);
        setCategorias(categoriasDaApi);

      } catch (err) {
        setError("Não foi possível carregar os dados da página. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosIniciais();
  }, []);

  // Reage a mudanças na URL e normaliza aliases
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const slug = mapCategoriaParamToSlug(p.get("categoria") || "todos");
    setCategoriaFiltro(slug);
  }, [location.search]);

  // Materiais disponíveis (dedupe case-insensitive, preservando forma mais “bonita”)
  const materiaisDisponiveis = useMemo(() => {
    const seen = new Map(); // key lower -> original
    for (const p of produtos) {
      for (const m of getMateriaisFromProduto(p)) {
        const key = String(m).toLowerCase();
        if (!seen.has(key)) seen.set(key, m.trim());
      }
    }
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, []);

  /* ===================== Filtros ===================== */


const getCategoriasDoProduto = (p) => {
    // A API agora retorna uma lista de categorias
    if (!p?.categorias || p.categorias.length === 0) return [];
    return p.categorias.map(cat => mapCategoriaParamToSlug(cat.nome_categoria));
};

const matchCategoria = (p) => {
    if (categoriaFiltro === "todos") return true;
    const slugsDoProduto = getCategoriasDoProduto(p);
    return slugsDoProduto.includes(categoriaFiltro);
};

  const matchMateriais = (p) => {
    if (!materiaisSel.length) return true;
    const mats = getMateriaisFromProduto(p).map((m) => m.toLowerCase());
    return materiaisSel.some((m) => mats.includes(String(m).toLowerCase()));
  };

  const matchPreco = (p) => {
    const min = parseNumberSmart(precoMin);
    const max = parseNumberSmart(precoMax);
    const v = precoNum(p);
    if (min !== null && v < min) return false;
    if (max !== null && v > max) return false;
    return true;
  };

  const matchPeso = (p) => {
    const min = parseNumberSmart(pesoMin);
    const max = parseNumberSmart(pesoMax);
    const v = pesoNum(p);
    if (min !== null && v < min) return false;
    if (max !== null && v > max) return false;
    return true;
  };

  const matchTam = (p) => {
    const min = parseNumberSmart(tamMin);
    const max = parseNumberSmart(tamMax);
    const v = tamanhoNum(p);
    if (min !== null && v < min) return false;
    if (max !== null && v > max) return false;
    return true;
  };

  const produtosFiltrados = produtos
    .filter(matchCategoria)
    .filter(matchMateriais)
    .filter(matchPreco)
    .filter(matchPeso)
    .filter(matchTam);const mapCategoriaParamToSlug = (param) => {
  if (!param) return "todos";
  // Normaliza o texto: remove acentos e deixa em minúsculo
  const s = String(param)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (s === "aneis" || s === "anel") return "anel";
  if (s === "brincos" || s === "brinco") return "brinco";
  if (s === "colares" || s === "colar" || s === "cordao") return "colar";
  if (s === "pingentes" || s === "pingente") return "pingente";
  if (s === "braceletes" || s === "pulseira") return "bracelete"; // Unificando pulseira/bracelete
  
  // Para outros como 'filigrana' e 'todos', o 's' já estará correto
  return s;
};

  const mudarFiltro = (slugUi) => {
    const slug = mapCategoriaParamToSlug(slugUi);
    setCategoriaFiltro(slug);
    navigate(`/joias?categoria=${slug}`);
    setVisibleCount(9);
  };

  const aplicarDoPainel = (payload = {}) => {
    const {
      materiaisSel: mSel = [],
      precoMin: pMin = "",
      precoMax: pMax = "",
      pesoMin: wMin = "",
      pesoMax: wMax = "",
    } = payload;

    
    setMateriaisSel(mSel);
    setPrecoMin(pMin);
    setPrecoMax(pMax);
    setPesoMin(wMin);
    setPesoMax(wMax);
    setTamMin("");
    setTamMax("");
    setVisibleCount(9);
  };

  if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#faf9f6]">
                <p className="text-xl font-BodoniMT">Carregando joias...</p>
            </div>
        );
  }
  
  if (error) {
      return (
          <div className="min-h-screen flex justify-center items-center bg-[#faf9f6]">
              <p className="text-xl text-red-600 font-BodoniMT">{error}</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header />
      <div id="header-sentinel" style={{ position: "absolute", top: 0, height: 0, margin: 0, padding: 0 }} />
      <HeaderCompact />

      <main className="flex-grow bg-[#faf9f6] py-12 px-6">
        {/* Cabeçalho + chips roláveis no mobile */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-[230%] font-BodoniMT text-[#1c2c3c]">Joias</h1>

            <div className="-mx-6 px-6 sm:mx-0">
              <div className="flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap snap-x snap-mandatory sm:flex-wrap sm:overflow-visible">
                {categorias.map(({ slug, label }) => (
                  <button
                    key={slug}
                    onClick={() => mudarFiltro(slug)}
                    className={`
                      inline-flex shrink-0 snap-start
                      px-4 py-2 text-[95%] font-MontserratRegular transition-all duration-200 ease-in-out
                      rounded-lg
                      ${categoriaFiltro === slug
                        ? "bg-[#1c2c3c] text-white shadow-md scale-105"
                        : "bg-[#faf9f6] text-[#1c2c3c] hover:bg-[#c2b280] hover:text-white hover:shadow-lg hover:scale-105"}
                    `}
                  >
                    {label}
                  </button>
                ))}

                <button
                  onClick={() => setOpenFiltro(true)}
                  className="inline-flex shrink-0 snap-start px-4 py-2 text-[95%] font-MontserratRegular rounded-lg bg-[#faf9f6] text-[#1c2c3c] hover:bg-[#c2b280] hover:text-white hover:shadow-lg hover:scale-105"
                >
                  Filtrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Linha info */}
        <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
          <p className="font-BodoniMT text-[#1c2c3c] text-[140%]">
            {produtosFiltrados.length} produtos encontrados
          </p>
        </div>

        {/* Grid produtos (cards padronizados) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {produtosFiltrados.slice(0, visibleCount).map((produto) => (
            <Link
              key={produto.id}
              to={`/produto/${produto.id}`}
              className="bg-brancoperola font-MontserratRegular overflow-hidden transform transition-all duration-300 rounded-md hover:rounded-xl hover:scale-105 hover:shadow-xl border border-transparent hover:border-[#c2b280]"
            >
              <div className="w-full aspect-square sm:aspect-[4/3] md:h-64 overflow-hidden bg-[#f1efe9]">
                <img src={produto.__thumb} alt={produto.nome} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3 sm:p-4 text-left">
                <h2 className="text-[0.95rem] sm:text-lg font-semibold line-clamp-2">{produto.nome}</h2>
                <p className="text-gray-600 mt-1 sm:mt-2 text-[0.9rem]">{produto.preco}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Carregar mais */}
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

      {/* Painel lateral */}
      <FiltroProdutos
        open={openFiltro}
        onClose={() => setOpenFiltro(false)}
        onApply={aplicarDoPainel}
        onResetAll={() => {
          setCategoriaFiltro("todos");
          navigate("/joias?categoria=todos");
          setVisibleCount(9);
        }}
        materiaisDisponiveis={materiaisDisponiveis}
        initial={{ materiaisSel, precoMin, precoMax, pesoMin, pesoMax }}
      />

      <WhatsApp position={openFiltro ? "left" : "right"} />
      <PreFooter />
      <Footer />
    </div>
  );
}
