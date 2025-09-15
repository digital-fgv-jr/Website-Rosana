// pages/Carrinho.jsx
import { useState, useEffect } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import WhatsApp from "../components/Atoms/WhatsApp";
import { produtos } from "../data/produtos";

/* ===================== Utils ===================== */
const formatBRL = (n) =>
  Number(n || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const parseBRL = (s = "") => {
  if (typeof s === "number") return s;
  // remove símbolos, mantém vírgula decimal, remove separadores de milhar
  const normalized = String(s)
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  return Number(normalized) || 0;
};

const getImagemFromCatalog = (id) => {
  const p = produtos.find((x) => x.id === id);
  return p?.imagens?.[0]?.imagem || "/placeholder.jpg";
};

const getEstoque = (id) => {
  // caso não encontre, assume Infinito (nunca bloqueia) — ajuste se preferir travar como 0
  const found = produtos.find((p) => p.id === id);
  return typeof found?.qtd_disponivel === "number" ? found.qtd_disponivel : Infinity;
};

const getUnitPrice = (item) =>
  typeof item.preco_num === "number" ? item.preco_num : parseBRL(item.preco);

/* ===================== Componente ===================== */
export default function Carrinho() {
  const navigate = useNavigate();

  // Estado inicial (lazy) lendo do localStorage
  const [carrinho, setCarrinho] = useState(() => {
    try {
      const dados = localStorage.getItem("carrinho");
      return dados ? JSON.parse(dados) : [];
    } catch {
      return [];
    }
  });

  // Persiste sempre que o carrinho muda
  useEffect(() => {
    try {
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
    } catch {}
  }, [carrinho]);

  // ====== Ações de quantidade (com limite de estoque) ======
  const alterarQuantidade = (id, delta) => {
    setCarrinho((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const estoque = getEstoque(id);
          const atual = Number(item.quantidade || 1);
          const nova = atual + delta;

          // remover se <= 0
          if (nova <= 0) return null;

          // travar no estoque
          const limitada = Math.min(nova, estoque);
          return { ...item, quantidade: limitada };
        })
        .filter(Boolean)
    );
  };

  const aumentarQuantidade = (id) => alterarQuantidade(id, +1);
  const diminuirQuantidade = (id) => alterarQuantidade(id, -1);

  // Remover item
  const removerItem = (id) => setCarrinho((prev) => prev.filter((i) => i.id !== id));

  // Limpar carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
    try {
      localStorage.removeItem("carrinho");
    } catch {}
  };

  // Finalizar compra → normaliza e redireciona para checkout
  function finalizarCompra() {
    const items = carrinho.map((i) => ({
      id: i.id || i.sku || i.slug,
      title: i.nome,
      unit_price: Number(getUnitPrice(i) || 0),
      quantity: Number(i.quantidade || 1),
      picture_url: i.imagem || i.foto || i.picture_url || getImagemFromCatalog(i.id),
    }));

    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
    navigate("/checkout");
  }

  // Totais
  const total = carrinho.reduce(
    (acc, item) => acc + getUnitPrice(item) * Number(item.quantidade || 1),
    0
  );

  const vazio = carrinho.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header />

      {/* SENTINELA: dispara o HeaderCompact quando some do topo */}
      <div id="header-sentinel" style={{ position: "absolute", top: 0, height: 0 }} />
      <HeaderCompact />

      <main className="flex-grow bg-[#faf9f6] py-12 px-6">
        {vazio ? (
          // ===== ESTADO VAZIO =====
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center py-24">
            <h1 className="text-[230%] font-BodoniMT text-[#1c2c3c] mb-4">Carrinho</h1>
            <p className="font-MontserratRegular text-gray-700 text-lg">Seu carrinho está vazio.</p>
          </div>
        ) : (
          <>
            {/* Título */}
            <div className="max-w-6xl mx-auto mb-8">
              <h1 className="text-[230%] font-BodoniMT text-[#1c2c3c]">Carrinho</h1>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* ===== Lista de itens (GRID alinhado) ===== */}
              <div className="flex flex-col gap-6 mb-12">
                {carrinho.map((item) => {
                  const estoque = getEstoque(item.id);
                  const qtd = Number(item.quantidade || 1);
                  const precoUnit = getUnitPrice(item);
                  const subtotal = precoUnit * qtd;
                  const atMax = qtd >= estoque;
                  const atMin = qtd <= 1;

                  const imagem =
                    item.imagem || getImagemFromCatalog(item.id) || "/placeholder.jpg";

                  return (
                    <div
                      key={item.id}
                      className="
                        grid gap-4 bg-white p-6 rounded-md shadow-sm hover:shadow-md transition-shadow
                        grid-cols-1
                        sm:grid-cols-[112px_1fr_132px_140px]
                        sm:items-center
                      "
                    >
                      {/* Coluna 1: Imagem */}
                      <div className="w-full sm:w-[112px]">
                        <img
                          src={imagem}
                          alt={item.nome}
                          className="w-28 h-28 sm:w-[112px] sm:h-[112px] object-cover rounded mx-auto sm:mx-0"
                        />
                      </div>

                      {/* Coluna 2: Detalhes */}
                      <div className="flex flex-col justify-center min-w-0">
                        <p className="text-[#1c2c3c] text-lg font-semibold font-MontserratRegular truncate">
                          {item.nome}
                        </p>
                        <p className="text-gray-700 text-base font-MontserratRegular">
                          R$ <span className="tabular-nums">{formatBRL(precoUnit)}</span>
                        </p>
                        {Number.isFinite(estoque) && (
                          <p className="text-xs text-gray-500 mt-1">
                            Em estoque: {estoque}
                          </p>
                        )}
                      </div>

                      {/* Coluna 3: Quantidade */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => diminuirQuantidade(item.id)}
                          aria-label="Diminuir quantidade"
                          className="p-1 rounded hover:bg-[#faf9f6] transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={atMin}
                          title={atMin ? "Quantidade mínima é 1" : "Diminuir"}
                        >
                          <CircleMinus className="w-6 h-6 text-gray-700 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280]" />
                        </button>

                        <span className="w-10 text-center text-gray-800 font-medium font-MontserratRegular tabular-nums">
                          {qtd}
                        </span>

                        <button
                          onClick={() => aumentarQuantidade(item.id)}
                          aria-label="Aumentar quantidade"
                          className="p-1 rounded hover:bg-[#faf9f6] transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={atMax}
                          title={
                            atMax && Number.isFinite(estoque)
                              ? `Limite de estoque: ${estoque}`
                              : "Aumentar"
                          }
                        >
                          <CirclePlus className="w-6 h-6 text-gray-700 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280]" />
                        </button>
                      </div>

                      {/* Coluna 4: Subtotal + Remover */}
                      <div className="flex flex-col items-end justify-center gap-2">
                        <p className="font-MontserratRegular font-semibold text-[#1c2c3c]">
                          R$ <span className="tabular-nums">{formatBRL(subtotal)}</span>
                        </p>
                        <button
                          onClick={() => removerItem(item.id)}
                          className="text-[#8b1c1c] hover:underline text-sm font-MontserratRegular"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ===== Resumo ===== */}
              <div
                className="
                  grid gap-4 items-center
                  grid-cols-1 sm:grid-cols-[1fr_auto_auto]
                "
              >
                <p className="font-BodoniMT text-[140%] text-[#1c2c3c]">
                  Total:{" "}
                  <span className="font-MontserratRegular tabular-nums">
                    R$ {formatBRL(total)}
                  </span>
                </p>

                <button
                  onClick={limparCarrinho}
                  className="justify-self-start sm:justify-self-end px-6 py-2 text-[95%] font-MontserratRegular rounded-lg bg-[#faf9f6] text-[#1c2c3c] hover:bg-[#c2b280] hover:text-white hover:shadow-lg hover:scale-105 transition-all"
                >
                  Limpar Carrinho
                </button>

                <button
                  onClick={finalizarCompra}
                  className="justify-self-start sm:justify-self-end px-6 py-2 text-[95%] font-MontserratRegular rounded-lg bg-[#1c2c3c] text-white hover:bg-[#25384d] hover:shadow-md transition"
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <WhatsApp />
      <Footer />
    </div>
  );
}
