import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Carrinho() {
  
    const [carrinho, setCarrinho] = useState(() => {
  const dados = localStorage.getItem("carrinho");
  return dados ? JSON.parse(dados) : [];
    });
    
  // Carregar carrinho do localStorage ao montar a página
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("carrinho")) || [];
    setCarrinho(dados);
  }, []);

  // Atualizar localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  // Alterar quantidade
  const alterarQuantidade = (id, delta) => {
    setCarrinho(prev =>
      prev.map(item => {
        if (item.id === id) {
          const novaQtd = item.quantidade + delta;
          return {
            ...item,
            quantidade: novaQtd < 1 ? 1 : novaQtd, // mínimo 1
          };
        }
        return item;
      })
    );
  };

  // Remover item
  const removerItem = (id) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem("carrinho");
  };

  // Total do carrinho
  const total = carrinho.reduce(
    (acc, item) => acc + item.preco_num * item.quantidade,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-brancoperola">
      <Header />

      <main className="flex-grow py-12 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-RoxboroughCFRegular text-gray-800 mb-8">
          Carrinho
        </h1>

        {carrinho.length === 0 ? (
          <p className="text-gray-600 text-xl">Seu carrinho está vazio.</p>
        ) : (
          <>
            {/* Lista de itens */}
            <div className="flex flex-col gap-6 mb-8">
              {carrinho.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-4 rounded shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.nome}</p>
                      <p className="text-gray-600">R$ {item.preco_num.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Contador de quantidade */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alterarQuantidade(item.id, -1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      onClick={() => alterarQuantidade(item.id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal e remover */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold">R$ {(item.preco_num * item.quantidade).toFixed(2)}</p>
                    <button
                      onClick={() => removerItem(item.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="font-bold text-xl">Total: R$ {total.toFixed(2)}</p>
              <div className="flex gap-4">
                <button
                  onClick={limparCarrinho}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Limpar Carrinho
                </button>
                <button
                  className="px-6 py-2 bg-[#1c2c3c] text-white rounded hover:bg-[#25384d]"
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}