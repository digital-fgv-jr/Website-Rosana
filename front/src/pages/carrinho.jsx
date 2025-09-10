import { useState, useEffect } from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import { produtos } from "../data/produtos";
import WhatsApp from "../components/Atoms/WhatsApp";

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

  //
  const aumentarQuantidade = (id) => {
  setCarrinho(prev =>
    prev.map(item => {
      if (item.id === id) {
        const produtoBanco = produtos.find(p => p.id === id);
        if (!produtoBanco) return item; // fallback
        const novaQtd = item.quantidade + 1;
        return {
          ...item,
          quantidade: novaQtd > produtoBanco.qtd_disponivel 
            ? produtoBanco.qtd_disponivel 
            : novaQtd,
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
      <Header/>     

      {/* SENTINELA: é ele que dispara a aparição do header compacto */}
      <div id="header-sentinel" style={{ position: 'absolute', top: 0, height: 0, margin: 0, padding: 0 }} />

      <HeaderCompact />


        <main className="flex-grow py-12 px-6 max-w-6xl lg:px-12 mx-auto bg-[#faf9f6]">
        {/* Título principal */}
        <h1 className="text-6xl font-MontserratRegular text-[#1c2c3c] mb-12">Carrinho</h1>

        {carrinho.length === 0 ? (
            <p className="text-gray-600 text-xl">Seu carrinho está vazio.</p>
        ) : (
            <>
            {/* Lista de itens */}
            <div className="flex flex-col gap-8 mb-12">
                {carrinho.map(item => (
                <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white p-6 rounded shadow-sm"
                >
                    {/* Imagem e detalhes */}
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                    <img
                        src={item.imagem}
                        alt={item.nome}
                        className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded"
                    />
                    <div className="flex flex-col">
                        <p className="font-semibold text-[#1c2c3c] text-lg">{item.nome}</p>
                        <p className="text-gray-600 text-base">R$ {item.preco_num.toFixed(2)}</p>
                    </div>
                    </div>

                    {/* Contador de quantidade */}
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <button onClick={() => alterarQuantidade(item.id, -1)}>
                        <CircleMinus
                        className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280] cursor-pointer"
                        />
                    </button>
                    <span className="w-6 text-center text-gray-700 font-medium">{item.quantidade}</span>
                    <button onClick={() => aumentarQuantidade(item.id)}>
                        <CirclePlus
                        className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280] cursor-pointer"
                        />
                    </button>
                    </div>


                    {/* Subtotal e remover */}
                    <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
                    <p className="font-semibold text-[#1c2c3c]">R$ {(item.preco_num * item.quantidade).toFixed(2)}</p>
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
                <p className="font-bold text-2xl text-[#1c2c3c]">Total: R$ {total.toFixed(2)}</p>
                <div className="flex gap-4 mt-4 sm:mt-0">
                <button
                    onClick={limparCarrinho}
                    className="px-6 py-3 bg-red-600 text-white font-MontserratRegular rounded-lg hover:bg-red-700 transition"
                >
                    Limpar Carrinho
                </button>
                <button
                    className="px-6 py-3 bg-[#1c2c3c] text-white font-MontserratRegular rounded-lg hover:bg-[#25384d] transition"
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