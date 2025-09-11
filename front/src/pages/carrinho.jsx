import { useState, useEffect } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import WhatsApp from "../components/Atoms/WhatsApp";
import { produtos } from "../data/produtos";

export default function Carrinho() {
  const navigate = useNavigate();

  // Estado inicial lendo do localStorage
  const [carrinho, setCarrinho] = useState(() => {
    const dados = localStorage.getItem("carrinho");
    return dados ? JSON.parse(dados) : [];
  });

  // Sincroniza o estado com o localStorage ao montar
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setCarrinho(dados);
  }, []);

  // Persiste sempre que o carrinho muda
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  // Utils
  const formatBRL = (n) =>
    Number(n || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const parseBRL = (s = "") => {
    if (typeof s === "number") return s;
    return Number(
      String(s).replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".")
    ) || 0;
  };

  // Busca imagem: prioriza a salva no item; senão, pega do "produtos"
  const getImagem = (item) => {
    if (item?.imagem) return item.imagem;
    const p = produtos.find((x) => x.id === item.id);
    return p?.imagens?.[0]?.imagem || "/placeholder.jpg";
  };

  const getEstoque = (id) =>
    produtos.find((p) => p.id === id)?.qtd_disponivel ?? Infinity;

  const getUnitPrice = (item) =>
    typeof item.preco_num === "number" ? item.preco_num : parseBRL(item.preco);

  // Quantidade:
  // - respeita estoque
  // - se a nova quantidade cair para 0 ou menos, REMOVE o item
  const alterarQuantidade = (id, delta) => {
    setCarrinho((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const estoque = getEstoque(id);
          const atual = Number(item.quantidade || 1);
          const nova = atual + delta;
          if (nova <= 0) return null; // remove
          const limitada = Math.min(nova, estoque);
          return { ...item, quantidade: limitada };
        })
        .filter(Boolean) // remove os nulos (itens removidos)
    );
  };

  const aumentarQuantidade = (id) => alterarQuantidade(id, +1);

  // Remover item
  const removerItem = (id) => setCarrinho((prev) => prev.filter((i) => i.id !== id));

  // Limpar carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem("carrinho");
  };

  // Finalizar compra → normaliza e redireciona para checkout
  function finalizarCompra() {
    const items = carrinho.map((i) => ({
      id: i.id || i.sku || i.slug,
      title: i.nome,
      unit_price: Number(getUnitPrice(i) || 0),
      quantity: Number(i.quantidade || 1),
      picture_url: i.imagem || i.foto || i.picture_url || "",
    }));

    localStorage.setItem("cart", JSON.stringify(items));
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
          // ===== COM ITENS =====
          <>
            {/* Título */}
            <div className="max-w-6xl mx-auto mb-8">
              <h1 className="text-[230%] font-BodoniMT text-[#1c2c3c]">Carrinho</h1>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Lista de itens */}
              <div className="flex flex-col gap-8 mb-12">
                {carrinho.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white p-6 rounded-md shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Imagem + detalhes */}
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <img
                        src={getImagem(item)}
                        alt={item.nome}
                        className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <p className="text-[#1c2c3c] text-lg font-semibold font-MontserratRegular">{item.nome}</p>
                        <p className="text-gray-700 text-base font-MontserratRegular">
                          R$ {formatBRL(getUnitPrice(item))}
                        </p>
                      </div>
                    </div>

                    {/* Quantidade */}
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                      <button
                        onClick={() => alterarQuantidade(item.id, -1)}
                        aria-label="Diminuir quantidade"
                        className="p-1 rounded hover:bg-[#faf9f6] transition"
                      >
                        <CircleMinus className="w-6 h-6 text-gray-700 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280]" />
                      </button>

                      <span className="w-8 text-center text-gray-800 font-medium font-MontserratRegular">
                        {item.quantidade}
                      </span>

                      <button
                        onClick={() => aumentarQuantidade(item.id)}
                        aria-label="Aumentar quantidade"
                        className="p-1 rounded hover:bg-[#faf9f6] transition"
                      >
                        <CirclePlus className="w-6 h-6 text-gray-700 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280]" />
                      </button>
                    </div>

                    {/* Subtotal + remover */}
                    <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
                      <p className="font-MontserratRegular font-semibold text-[#1c2c3c]">
                        R$ {formatBRL(getUnitPrice(item) * Number(item.quantidade || 1))}
                      </p>
                      <button
                        onClick={() => removerItem(item.id)}
                        className="text-[#8b1c1c] hover:underline text-sm font-MontserratRegular"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="font-BodoniMT text-[140%] text-[#1c2c3c]">
                  Total: <span className="font-MontserratRegular">R$ {formatBRL(total)}</span>
                </p>
                <div className="flex gap-4 mt-2 sm:mt-0">
                  <button
                    onClick={limparCarrinho}
                    className="px-6 py-2 text-[95%] font-MontserratRegular rounded-lg bg-[#faf9f6] text-[#1c2c3c] hover:bg-[#c2b280] hover:text-white hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Limpar Carrinho
                  </button>
                  <button
                    onClick={finalizarCompra}
                    className="px-6 py-2 text-[95%] font-MontserratRegular rounded-lg bg-[#1c2c3c] text-white hover:bg-[#25384d] hover:shadow-md transition"
                  >
                    Finalizar Compra
                  </button>
                </div>
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
