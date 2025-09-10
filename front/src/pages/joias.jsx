import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { produtos } from "../data/produtos";
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import PreFooter from "../components/PreFooter";
import WhatsApp from "../components/Atoms/WhatsApp";
import FiltroProdutos from "../components/FiltroProdutos";


const parseNumberSmart = (v) => {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;

  let s = String(v).replace(/[^0-9.,-]/g, "").trim(); // mantém só dígitos, . , e -
  if (!s) return null;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if (hasComma && hasDot) {
    // decimal = o separador que aparece por ÚLTIMO
    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");
    const decimalSep = lastComma > lastDot ? "," : ".";
    const thousandSep = decimalSep === "," ? "." : ",";
    s = s.replace(new RegExp("\\" + thousandSep, "g"), ""); // remove milhares
    s = s.replace(decimalSep, "."); // padroniza decimal para ponto
  } else if (hasComma) {
    // só vírgula -> vírgula é decimal
    s = s.replace(/\./g, ""); // remove quaisquer pontos de milhar perdidos
    s = s.replace(",", ".");
  } else if (hasDot) {
    // só ponto -> ponto é decimal; se houver mais de um, só o último é decimal
    const parts = s.split(".");
    if (parts.length > 2) {
      const last = parts.pop();
      s = parts.join("") + "." + last;
    }
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

// Preço (mantém como estava, mas usando parseNumberSmart)
const precoNum = (p) => {
  if (!p) return 0;
  if (typeof p.preco_num === "number") return p.preco_num;
  const parsed = parseNumberSmart(p?.preco);
  return parsed ?? 0;
};

// Pesa qualquer formato "50.00 g", "0,05 kg", "50g", "50" (assume g) -> sempre em GRAMAS
const parsePesoGramas = (raw) => {
  if (raw === undefined || raw === null || raw === "") return null;
  const s = String(raw).toLowerCase();
  const n = parseNumberSmart(s);
  if (n === null) return null;
  if (s.includes("kg")) return n * 1000;
  // se mencionar "g" ou nada, tratamos como gramas
  return n;
};

const pesoNum = (p) => {
  // prioridade: campo numérico em gramas -> depois string
  if (typeof p?.peso_g === "number") return p.peso_g;
  return parsePesoGramas(p?.peso ?? p?.peso_texto ?? p?.especificacoes?.peso);
};

// Tamanho (se usar cm/mm, converta o que for preciso; aqui só normaliza número)
const parseTamanho = (raw) => {
  if (raw === undefined || raw === null || raw === "") return null;
  const s = String(raw).toLowerCase();
  const n = parseNumberSmart(s);
  if (n === null) return null;
  // exemplo: se vier "2.00 cm" e quiser mm, faça: return s.includes("cm") ? n * 10 : n;
  return n; // mantemos unidade como estiver; ajuste se precisar padronizar
};

const tamanhoNum = (p) => {
  const raw = p?.tamanho_mm ?? p?.tamanho ?? p?.comprimento ?? p?.altura ?? p?.largura;
  return parseTamanho(raw);
};

const getCategoria = (p) => {
  const c = p?.categoria;
  return typeof c === "string" ? c : c?.nome_categoria;
};

// Materiais: aceita array ou string "A e B", "A/B", "A, B" etc
const splitMaterials = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  return String(v)
    .split(/,|\/|;|\||\s+e\s+|\s+and\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
};

const norm = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const toArr = (v) => (Array.isArray(v) ? v : String(v || "").split(",")).map((x)=>x.trim()).filter(Boolean);


const getMateriaisFromProduto = (p) => {
  const out = [];
  if (!p) return out;
  if (p.materiais) out.push(...splitMaterials(p.materiais));
  if (p.materials) out.push(...splitMaterials(p.materials));
  if (p.material) out.push(...splitMaterials(p.material));
  if (p.Material) out.push(...splitMaterials(p.Material));
  const esp = p.especificacoes || p.especificações || p.specs;
  if (esp) {
    for (const k of ["material", "Material", "materiais", "Materiais"]) {
      if (esp[k]) out.push(...splitMaterials(esp[k]));
      if (typeof esp[k] === "object" && esp[k]?.valor) out.push(...splitMaterials(esp[k].valor));
    }
  }
  return out;
};
/* ====================================================================== */


export default function Joias() {
  const navigate = useNavigate();
  const location = useLocation();

  const qParam = new URLSearchParams(location.search).get("q") || "";
  const searchTokens = useMemo(() => norm(qParam).split(/\s+/).filter(Boolean), [qParam]);


  const params = new URLSearchParams(location.search);
  const categoriaInicial = params.get("categoria") || "todos";


  const [categoriaFiltro, setCategoriaFiltro] = useState(categoriaInicial);
  const [visibleCount, setVisibleCount] = useState(9);

  // Filtros adicionais (podem começar vazios e só funcionar quando o back trouxer dados)
  const [openFiltro, setOpenFiltro] = useState(false);
  const [materiaisSel, setMateriaisSel] = useState([]);
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [pesoMin, setPesoMin] = useState("");
  const [pesoMax, setPesoMax] = useState("");
  const [tamMin, setTamMin] = useState("");
  const [tamMax, setTamMax] = useState("");

  // Reagir à URL
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setCategoriaFiltro(p.get("categoria") || "todos");
  }, [location.search]);

  // Thumb segura para todos os produtos
  const produtosComThumb = useMemo(() => {
    return produtos.map((p, i) => {
      const byArray = p?.imagens?.[0]?.imagem;
      const byField = p?.imagem;
      const byId = typeof p?.id === "number" ? `/produtos/produto${p.id}.jpg` : null;
      const byIndex = `/produtos/produto${(i % 9) + 1}.jpg`;
      const thumb = byArray || byField || byId || byIndex || "/placeholder.jpg";
      return { ...p, __thumb: thumb };
    });
  }, []);

const materiaisDisponiveis = useMemo(() => {
  const s = new Set();
  for (const p of produtos) {
    for (const m of getMateriaisFromProduto(p)) {
      const v = String(m || "").trim();
      if (v) s.add(v);
    }
  }
  return Array.from(s).sort((a, b) => a.localeCompare(b, "pt-BR"));
}, []);


  /* ===================== Predicados de filtro ===================== */
  const matchCategoria = (p) =>
    categoriaFiltro === "todos" || getCategoria(p) === categoriaFiltro;


const matchMateriais = (p) => {
  if (!materiaisSel.length) return true;
  const mats = getMateriaisFromProduto(p).map((m) => String(m).toLowerCase());
  return materiaisSel.some((m) => mats.includes(String(m).toLowerCase()));
};


// dentro do componente Joias, substitua estes três:

  const matchPreco = (p) => {
    const min = parseNumberSmart(precoMin);
    const max = parseNumberSmart(precoMax);
    if (min === null && max === null) return true;
    const v = precoNum(p);
    if (v === null) return false;
    if (min !== null && v < min) return false;
    if (max !== null && v > max) return false;
    return true;
};

  const matchPeso = (p) => {
    const min = parseNumberSmart(pesoMin); // em gramas
    const max = parseNumberSmart(pesoMax);
    if (min === null && max === null) return true;
    const v = pesoNum(p); // já em gramas (via parsePesoGramas)
    if (v === null) return false;
    if (min !== null && v < min) return false;
    if (max !== null && v > max) return false;
    return true;
};

  const matchTam = (p) => {
    const min = parseNumberSmart(tamMin);
    const max = parseNumberSmart(tamMax);
    if (min === null && max === null) return true;
    const v = tamanhoNum(p);
    if (v === null) return false;
    if (min !== null && v < min) return false;
    if (max !== null && v > max) return false;
    return true;
};

 const scoreProduto = (p) => {
  const nome = norm(p?.nome);
  const desc = norm(p?.descricao);
  const cat = norm(typeof p?.categoria === "string" ? p.categoria : p?.categoria?.nome_categoria);
  const mats = (getMateriaisFromProduto?.(p) || []).map(norm);
  const tags = toArr(p?.tags).map(norm);
  const palavras = toArr(p?.palavras_chave).map(norm);

  const hitField = (field, w=1) => searchTokens.reduce((acc,t)=> acc + (field.includes(t)? w : 0), 0);
  const hitArr   = (arr,   w=1) => searchTokens.reduce((acc,t)=> acc + (arr.some(x=>x.includes(t))? w : 0), 0);

  return (
    hitField(cat, 3) +
    hitArr(mats, 3) +
    hitArr(tags, 2) +
    hitArr(palavras, 2) +
    hitField(nome, 1) +
    hitField(desc, 1)
  );
};

  /* =============================================================== */

  const produtosFiltrados = produtosComThumb
    .filter(matchCategoria)
    .filter(matchMateriais)
    .filter(matchPreco)
    .filter(matchPeso)
    .filter(matchTam);
  
  const produtosOrdenados = useMemo(() => {
  if (!searchTokens.length) return produtosFiltrados;
  const scored = produtosFiltrados
    .map((p) => ({ p, s: scoreProduto(p) }))
    .sort((a, b) => b.s - a.s)
    .map(({ p }) => p);
  return scored;
}, [produtosFiltrados, searchTokens]);


  const mudarFiltro = (novaCategoria) => {
    navigate(`/joias?categoria=${novaCategoria}`);
  };

// Substitua sua função por:
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

  // como tamanho não está no painel, zera para não "herdar" filtros antigos
  setTamMin("");
  setTamMax("");

  setVisibleCount(9);
};


  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header />
      <div id="header-sentinel" style={{ position: "absolute", top: 0, height: 0, margin: 0, padding: 0 }} />
      <HeaderCompact />

      <main className="flex-grow bg-[#faf9f6] py-12 px-6">
        {/* Título e botões (mesma posição/estilo) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 max-w-6xl mx-auto">
          <h1 className="text-[230%] font-BodoniMT text-[#1c2c3c] mb-4 sm:mb-0">Joias</h1>

          <div className="flex flex-wrap gap-2">
            {["todos", "anel", "brinco", "colar", "filigrana", "pingente"].map((cat) => (
              <button
                key={cat}
                onClick={() => mudarFiltro(cat)}
                className={`
                  px-4 py-2 text-[95%] font-MontserratRegular transition-all duration-200 ease-in-out
                  rounded-lg
                  ${categoriaFiltro === cat
                    ? "bg-[#1c2c3c] text-white shadow-md scale-105"
                    : "bg-[#faf9f6] text-[#1c2c3c] hover:bg-[#c2b280] hover:text-white hover:shadow-lg hover:scale-105"}
                `}
              >
                {cat === "todos" ? "Ver tudo" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}

            <button
              onClick={() => setOpenFiltro(true)}
              className="px-4 py-2 text-[95%] font-MontserratRegular transition-all duration-200 ease-in-out
                         rounded-lg bg-[#faf9f6] text-[#1c2c3c] hover:bg-[#c2b280] hover:text-white hover:shadow-lg hover:scale-105"
            >
              Filtrar
            </button>
          </div>
        </div>

        {/* Linha de informações */}
        <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
          <p className="font-BodoniMT text-[#1c2c3c] text-[140%]">
            {produtosFiltrados.length} produtos encontrados
          </p>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {produtosOrdenados.slice(0, visibleCount).map((produto) => (
            <Link
              key={produto.id}
              to={`/produto/${produto.id}`}
              className="bg-brancoperola font-MontserratRegular overflow-hidden transform transition-all duration-300
                         rounded-md hover:rounded-xl hover:scale-105 hover:shadow-xl p-4 cursor-pointer hover:border hover:border-[#c2b280]"
            >
              <img
                src={produto.__thumb}
                alt={produto.nome}
                className="w-full h-64 object-cover"
                loading="lazy"
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

      {/* Painel lateral de filtros (mesmo visual/posição, apenas lógica robusta) */}

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
