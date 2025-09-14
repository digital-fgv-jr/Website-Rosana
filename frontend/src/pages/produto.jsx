import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CirclePlus, CircleMinus } from "lucide-react";

// --- 1. IMPORTAÇÕES DA API ---
import { getProdutoById } from "../api/services/produtoService";
import { buscarEFormatarProdutos } from "../data/produtos"; // Busca e formata a lista completa
import { formatarProdutoParaFrontend } from "../utils/formatters"; // Formata um único produto

import MiniCarrinho from "../components/MiniCarrinho";
import { produtos } from "../data/produtos";
import ProdutosRelacionados from "../components/ProdutosRelacionados";
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import PreFooter from "../components/PreFooter";
import WhatsApp from "../components/Atoms/WhatsApp";

/* ========================= Helpers ========================= */
// Garante que a imagem sempre use a origem do backend, preservando apenas path/query/hash do campo vindo da API
const backendOrigin = (() => {
  try {
    const url = new URL(import.meta.env.VITE_API_URL);
    return url.origin; // ex.: http://localhost:8000
  } catch (_e) {
    try { return window.location.origin; } catch (_e2) { return ""; }
  }
})();

const toBackendUrl = (input) => {
  const placeholder = "/placeholder.svg";
  if (!input) return placeholder;
  try {
    const parsed = new URL(input, backendOrigin || undefined);
    return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch (_e) {
    const path = String(input).startsWith("/") ? String(input) : `/${String(input)}`;
    return `${backendOrigin}${path}`;
  }
};

// Title Case com suporte a acentos e respeitando números/siglas (ex.: 18K)
const toTitleCase = (str = "") =>
  str
    .split(/(\s+|-)/) // mantém espaços e hifens como separadores preservados
    .map((part) => {
      const ch = part[0];
      if (!ch) return part;
      // se começar com letra (inclui acentuadas), faz Title Case
      if (/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(ch)) {
        return ch.toLocaleUpperCase("pt-BR") + part.slice(1).toLocaleLowerCase("pt-BR");
      }
      return part; // números/símbolos permanecem (ex.: 18K)
    })
    .join("");

const normSlug = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** 
 * Padroniza categoria do produto para:
 *  - label (exibição bonitinha)
 *  - slug (para a URL de /joias?categoria=)
 * Inclui mapeamentos úteis (ex.: "cordao" -> slug "colar")
 */
const mapCategoria = (raw) => {
  const base =
    typeof raw === "string" ? raw : raw?.nome_categoria || "";
  const s = normSlug(base);

  const map = {
    // anéis
    aneis: { slug: "anel", label: "Anel" },
    anel: { slug: "anel", label: "Anel" },

    // brincos
    brinco: { slug: "brinco", label: "Brinco" },
    brincos: { slug: "brinco", label: "Brinco" },

    // colares/cordões
    colar: { slug: "colar", label: "Colar" },
    colares: { slug: "colar", label: "Colar" },
    cordao: { slug: "colar", label: "Colar" },

    // demais
    filigrana: { slug: "filigrana", label: "Filigrana" },
    pingente: { slug: "pingente", label: "Pingente" },
    pingentes: { slug: "pingente", label: "Pingente" },
    pulseira: { slug: "pulseira", label: "Pulseira" },
    pulseiras: { slug: "pulseira", label: "Pulseira" },
  };

  if (map[s]) return map[s];
  // fallback: usa o próprio texto normalizado
  const label = toTitleCase(s || "Categoria");
  return { slug: s || "todos", label };
};

/* ========================================================== */

export default function Produto() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL

  // --- 2. ESTADOS PARA DADOS DA API ---
  const [produto, setProduto] = useState(null); // Para o produto principal da página
  const [todosProdutos, setTodosProdutos] = useState([]); // Para a seção "Relacionados"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de interação do usuário (carrinho, quantidade)
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState(() => {
    const dados = localStorage.getItem("carrinho");
    return dados ? JSON.parse(dados) : [];
  });
  const [abrirMiniCarrinho, setAbrirMiniCarrinho] = useState(false);

  // --- 3. LÓGICA PARA BUSCAR OS DADOS DA API ---
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      setError(null);
      try {
        // Busca o produto específico E a lista de todos os produtos em paralelo
        const [respostaProduto, listaCompletaFormatada] = await Promise.all([
          getProdutoById(id),
          buscarEFormatarProdutos()
        ]);

        if (respostaProduto.data) {
          const produtoFormatado = formatarProdutoParaFrontend(respostaProduto.data);
          setProduto(produtoFormatado);
          setTodosProdutos(listaCompletaFormatada);
        } else {
          setError("Produto não encontrado.");
        }
      } catch (err) {
        setError("Não foi possível carregar o produto. Tente novamente mais tarde.");
        console.error("Erro ao buscar dados do produto:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]); // Roda a busca sempre que o ID na URL mudar

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  // --- 4. RENDERIZAÇÃO CONDICIONAL (LOADING, ERRO, SUCESSO) ---
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando produto...</div>;
  }

  if (error || !produto) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <p className="text-gray-600 text-xl">{error || "Produto não encontrado."}</p>
        <Link to="/joias" className="mt-4 px-4 py-2 bg-[#1c2c3c] text-white rounded">Voltar para a loja</Link>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Produto não encontrado.</p>
      </div>
    );
  }

  const aumentar = () => {
    if (quantidade < produto.qtd_disponivel) setQuantidade((q) => q + 1);
  };
  const diminuir = () => {
    if (quantidade > 1) setQuantidade((q) => q - 1);
  };

  const adicionarAoCarrinho = () => {
    const precoNum = parseFloat(
      produto.preco.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
    );

    const item = {
      id: produto.id,
      nome: produto.nome,
      quantidade,
      preco_num: precoNum,
    };

    const carrinhoAtual = [...carrinho];
    const existe = carrinhoAtual.find((p) => p.id === item.id);
    const quantidadeExistente = existe ? existe.quantidade : 0;

    if (quantidadeExistente + quantidade > produto.qtd_disponivel) {
      alert(`Não é possível adicionar mais do que ${produto.qtd_disponivel} unidades deste produto.`);
      return;
    }

    if (existe) {
      existe.quantidade += quantidade;
    } else {
      carrinhoAtual.push(item);
    }

    setCarrinho(carrinhoAtual);
    setAbrirMiniCarrinho(true);
  };

  // Dados para o breadcrumb
  const { slug: catSlug, label: catLabel } = mapCategoria(produto.categoria);
  const productTitleCase = toTitleCase(produto.nome);

  return (
    <div className="min-h-screen flex flex-col bg-brancoperola">
      <Header />
      {/* SENTINELA: dispara a aparição do header compacto */}
      <div id="header-sentinel" style={{ position: "absolute", top: 0, height: 0, margin: 0, padding: 0 }} />
      <HeaderCompact />

      <main className="flex-grow bg-brancoperola py-12 px-6">
        <div className="flex justify-center w-full">
          <div className="flex flex-col-reverse lg:flex-row max-w-6xl w-full px-4 gap-16">

            {/* Lado esquerdo: detalhes e compra */}
            <div className="flex flex-col justify-start lg:justify-between w-full lg:w-1/2 lg:pr-12">
              <div>
                <h1 className="text-3xl font-RoxboroughCFRegular text-gray-800 mt-5 ml-auto mb-4">
                  {produto.nome}
                </h1>
                <p className="text-2xl text-[#1c2c3c] font-MontserratRegular">
                  {produto.preco}
                </p>
              </div>

              {/* Descrição */}
              <p className="text-gray-700 mt-8">{produto.descricao}</p>

              {/* Quantidade */}
              <div className="flex items-center gap-2 mt-6 mb-5">
                <button onClick={diminuir} aria-label="Diminuir quantidade">
                  <CircleMinus className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280] cursor-pointer" />
                </button>
                <span className="w-6 text-center text-gray-700 font-medium">{quantidade}</span>
                <button onClick={aumentar} aria-label="Aumentar quantidade">
                  <CirclePlus className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280] cursor-pointer" />
                </button>
              </div>

              {/* Estoque */}
              <p className="text-sm text-gray-600 mb-4">
                Quantidade em estoque: {produto.qtd_disponivel}
              </p>

              {/* Adicionar à sacola */}
              <button
                onClick={adicionarAoCarrinho}
                className="mt-auto px-6 py-3 bg-[#1c2c3c] max-w-[200px] font-MontserratRegular text-brancoperola rounded-lg shadow-sm hover:bg-[#25384d] hover:shadow-md transition"
              >
                Adicionar à sacola
              </button>
            </div>

            {/* Lado direito: breadcrumb + imagem */}
            <div className="flex flex-col items-start w-full lg:w-auto max-w-md lg:ml-auto">
              {/* Breadcrumb clicável em Title Case */}
              <nav aria-label="breadcrumb" className="text-gray-500 text-sm mb-2">
                <ol className="flex flex-wrap items-center gap-1">
                  <li>
                    <Link to="/" className="hover:text-[#1c2c3c] underline underline-offset-2">
                      Início
                    </Link>
                  </li>
                  <li className="opacity-60">/</li>
                  <li>
                    <Link
                      to="/joias?categoria=todos"
                      className="hover:text-[#1c2c3c] underline underline-offset-2"
                    >
                      Joias
                    </Link>
                  </li>
                  <li className="opacity-60">/</li>
                  <li>
                    <Link
                      to={`/joias?categoria=${encodeURIComponent(catSlug)}`}
                      className="hover:text-[#1c2c3c] underline underline-offset-2"
                    >
                      {catLabel}
                    </Link>
                  </li>
                  <li className="opacity-60">/</li>
                  <li aria-current="page" className="text-gray-700">
                    {productTitleCase}
                  </li>
                </ol>
              </nav>

              <div className="w-full border border-[#c0c0c0] shadow-sm bg-white">
                <img
                  src={toBackendUrl(produto.imagens?.[0]?.imagem)}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Seção de detalhes técnicos */}
      <div className="mt-12 max-w-6xl w-[60%] px-4 lg:pl-12">
        <h2 className="text-2xl font-RoxboroughCFRegular text-gray-800 mb-3">Detalhes</h2>
        <hr className="border-t-2 border-gray-300 mb-6 w-full" />

        {/* Detalhes gerais */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
          {produto.detalhes.map((detalhe, idx) => (
            <div key={idx} className="bg-[#f5f5f5] p-3 rounded">
              <p className="font-semibold text-gray-800">{detalhe.propriedade}</p>
              <p className="text-gray-600">{detalhe.descricao}</p>
            </div>
          ))}
        </div>

        {/* Medidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
          <div className="bg-[#f5f5f5] p-3 rounded">
            <p className="font-semibold text-gray-800">Peso</p>
            <p className="text-gray-600">{produto.peso} g</p>
          </div>
          <div className="bg-[#f5f5f5] p-3 rounded">
            <p className="font-semibold text-gray-800">Comprimento</p>
            <p className="text-gray-600">{produto.comprimento} cm</p>
          </div>
          <div className="bg-[#f5f5f5] p-3 rounded">
            <p className="font-semibold text-gray-800">Largura</p>
            <p className="text-gray-600">{produto.largura} cm</p>
          </div>
          <div className="bg-[#f5f5f5] p-3 rounded">
            <p className="font-semibold text-gray-800">Altura</p>
            <p className="text-gray-600">{produto.altura} cm</p>
          </div>
        </div>
      </div>

      {/* Mini-carrinho */}
      {abrirMiniCarrinho && (
        <MiniCarrinho
          carrinho={carrinho}
          fechar={() => setAbrirMiniCarrinho(false)}
          irParaCarrinho={() => {
            setAbrirMiniCarrinho(false);
            navigate("/carrinho");
          }}
        />
      )}

      {/* Relacionados */}
      <ProdutosRelacionados
        produtos={todosProdutos.filter(
          (p) => p.categoria?.nome_categoria === produto.categoria?.nome_categoria && p.id !== produto.id
        )}
      />

      <WhatsApp />
      <PreFooter />
      <Footer />
    </div>
  );
}
