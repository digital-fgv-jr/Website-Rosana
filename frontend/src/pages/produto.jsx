import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CirclePlus, CircleMinus } from "lucide-react";

import { getProdutoById } from "../api/services/produtoService";
import { buscarEFormatarProdutos } from "../data/produtos";
import { formatarProdutoParaFrontend } from "../utils/formatters";

import MiniCarrinho from "../components/MiniCarrinho";
import ProdutosRelacionados from "../components/ProdutosRelacionados";
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import PreFooter from "../components/PreFooter";
import WhatsApp from "../components/Atoms/WhatsApp";

/* ========================= Helpers ========================= */
const backendOrigin = (() => {
  try {
    const url = new URL(import.meta.env.VITE_API_URL);
    return url.origin;
  } catch {
    try {
      return window.location.origin;
    } catch {
      return "";
    }
  }
})();

const toBackendUrl = (input) => {
  const placeholder = "/placeholder.svg";
  if (!input) return placeholder;
  try {
    const parsed = new URL(input, backendOrigin || undefined);
    return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    const path = String(input).startsWith("/") ? String(input) : `/${String(input)}`;
    return `${backendOrigin}${path}`;
  }
};

const toTitleCase = (str = "") =>
  str
    .split(/(\s+|-)/)
    .map((part) => {
      const ch = part[0];
      if (!ch) return part;
      if (/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(ch)) {
        return ch.toLocaleUpperCase("pt-BR") + part.slice(1).toLocaleLowerCase("pt-BR");
      }
      return part;
    })
    .join("");

const normSlug = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const mapCategoria = (raw) => {
  const base = typeof raw === "string" ? raw : raw?.nome_categoria || "";
  const s = normSlug(base);
  const map = {
    aneis: { slug: "anel", label: "Anel" },
    anel: { slug: "anel", label: "Anel" },
    brinco: { slug: "brinco", label: "Brinco" },
    brincos: { slug: "brinco", label: "Brinco" },
    colar: { slug: "colar", label: "Colar" },
    colares: { slug: "colar", label: "Colar" },
    cordao: { slug: "colar", label: "Colar" },
    filigrana: { slug: "filigrana", label: "Filigrana" },
    pingente: { slug: "pingente", label: "Pingente" },
    pingentes: { slug: "pingente", label: "Pingente" },
    pulseira: { slug: "pulseira", label: "Pulseira" },
    pulseiras: { slug: "pulseira", label: "Pulseira" },
  };
  if (map[s]) return map[s];
  const label = toTitleCase(s || "Categoria");
  return { slug: s || "todos", label };
};

/* ========================= Componente ========================= */
export default function Produto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState(() => {
    const dados = localStorage.getItem("carrinho");
    return dados ? JSON.parse(dados) : [];
  });
  const [abrirMiniCarrinho, setAbrirMiniCarrinho] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resProduto, lista] = await Promise.all([
          getProdutoById(id),
          buscarEFormatarProdutos(),
        ]);
        if (resProduto?.data) {
          setProduto(formatarProdutoParaFrontend(resProduto.data));
          setTodosProdutos(lista || []);
        } else {
          setError("Produto não encontrado.");
        }
      } catch (e) {
        console.error(e);
        setError("Não foi possível carregar o produto. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

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

  const aumentar = () => {
    if (quantidade < produto.qtd_disponivel) setQuantidade((q) => q + 1);
  };
  const diminuir = () => {
    if (quantidade > 1) setQuantidade((q) => q - 1);
  };

  const adicionarAoCarrinho = () => {
    const precoNum = parseFloat(
      String(produto.preco).replace("R$ ", "").replace(/\./g, "").replace(",", ".")
    );
    const item = {
      id: produto.id,
      nome: produto.nome,
      quantidade,
      preco_num: isNaN(precoNum) ? 0 : precoNum,
    };

    const carrinhoAtual = [...carrinho];
    const existe = carrinhoAtual.find((p) => p.id === item.id);
    const quantidadeExistente = existe ? Number(existe.quantidade || 0) : 0;

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

  const { slug: catSlug, label: catLabel } = mapCategoria(produto.categoria);
  const productTitleCase = toTitleCase(produto.nome);
  const semEstoque = Number(produto.qtd_disponivel || 0) <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-brancoperola">
      <Header />
      <div id="header-sentinel" style={{ position: "absolute", top: 0, height: 0 }} />
      <HeaderCompact />

      {/* ========================= CONTEÚDO PRINCIPAL ========================= */}
      <main className="flex-grow bg-brancoperola py-10 sm:py-12">
        <div className="container mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
          {/* Grid principal: infos à esquerda, imagem à direita (em telas grandes) */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ===== Coluna 1: Título, preço, descrição e compra ===== */}
            <div className="order-1">
              {/* Título + Preço */}
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-RoxboroughCFRegular text-gray-800 mb-2">
                  {produto.nome}
                </h1>
                <p className="text-2xl text-[#1c2c3c] font-MontserratRegular">
                  {produto.preco}
                </p>
              </div>

              {/* Descrição */}
              <p className="text-gray-700 mt-6 leading-relaxed">
                {produto.descricao}
              </p>

              {/* Quantidade */}
              <div className="flex items-center gap-3 mt-6 mb-4">
                <button
                  onClick={diminuir}
                  aria-label="Diminuir quantidade"
                  className="p-1 rounded hover:bg-[#faf9f6] transition"
                  disabled={semEstoque}
                >
                  <CircleMinus className="w-6 h-6 text-gray-700 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280]" />
                </button>
                <span className="w-8 text-center text-gray-800 font-medium">{quantidade}</span>
                <button
                  onClick={aumentar}
                  aria-label="Aumentar quantidade"
                  className="p-1 rounded hover:bg-[#faf9f6] transition"
                  disabled={semEstoque || quantidade >= produto.qtd_disponivel}
                >
                  <CirclePlus className="w-6 h-6 text-gray-700 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280]" />
                </button>
              </div>

              {/* Estoque */}
              <p className="text-sm text-gray-600 mb-5">
                {semEstoque ? "Produto indisponível no momento" : `Quantidade em estoque: ${produto.qtd_disponivel}`}
              </p>

              {/* CTA */}
              <button
                onClick={adicionarAoCarrinho}
                disabled={semEstoque}
                className={`mt-1 px-6 py-3 max-w-[220px] font-MontserratRegular rounded-lg shadow-sm transition ${
                  semEstoque
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#1c2c3c] text-white hover:bg-[#25384d] hover:shadow-md"
                }`}
              >
                {semEstoque ? "Indisponível" : "Adicionar à sacola"}
              </button>
            </div>

            {/* ===== Coluna 2: Breadcrumb + Imagem ===== */}
            <div className="order-2">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="text-gray-500 text-sm mb-3">
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

              {/* Imagem com ratio e contenção */}
              <div className="w-full bg-white border border-[#c0c0c0] shadow-sm rounded-lg overflow-hidden">
                <div className="w-full aspect-[4/5] bg-[#f4f4f4]">
                  <img
                    src={toBackendUrl(produto.imagens?.[0]?.imagem)}
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================= DETALHES (ALINHADO AO CENTRO) ========================= */}
        <section className="mt-12">
          <div className="container mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-RoxboroughCFRegular text-gray-800 mb-3 text-center">
              Detalhes
            </h2>
            <hr className="border-t-2 border-gray-300 mb-6 w-full max-w-6xl mx-auto" />

            {/* Bloco centralizado com largura confortável */}
            <div className="max-w-3xl mx-auto w-full">
              {/* Detalhes gerais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Array.isArray(produto.detalhes) && produto.detalhes.length > 0 ? (
                  produto.detalhes.map((detalhe, idx) => (
                    <div key={idx} className="bg-[#f5f5f5] p-3 rounded">
                      <p className="font-semibold text-gray-800">{detalhe.propriedade}</p>
                      <p className="text-gray-600">{detalhe.descricao}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 col-span-full">
                    Este produto não possui detalhes adicionais.
                  </p>
                )}
              </div>

              {/* Medidas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
          </div>
        </section>
      </main>

      {/* ========================= MINI-CARRINHO & RELACIONADOS ========================= */}
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
