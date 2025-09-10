import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DropdownSection from "../components/DropdownSection";
import MiniCarrinho from "../components/MiniCarrinho";
import { produtos } from "../data/produtos";
import ProdutosRelacionados from "../components/ProdutosRelacionados";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

export default function Produto() {

  const { id } = useParams();
  const produto = produtos.find((p) => p.id === parseInt(id));

  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState(() => {
  const dados = localStorage.getItem("carrinho");
  return dados ? JSON.parse(dados) : [];
  });

  const [abrirMiniCarrinho, setAbrirMiniCarrinho] = useState(false);


  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  const aumentar = () => {
    if (quantidade < produto.qtd_disponivel) setQuantidade(quantidade + 1);
  };

  const diminuir = () => {
    if (quantidade > 1) setQuantidade(quantidade - 1);
  };

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Produto não encontrado.</p>
      </div>
    );
  }

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
    return; // impede de adicionar
  }

    if (existe) {
      existe.quantidade += quantidade;
    } else {
      carrinhoAtual.push(item);
    }

    setCarrinho(carrinhoAtual);
    setAbrirMiniCarrinho(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brancoperola">
      <Header />

      <main className="flex-grow bg-brancoperola py-12 px-6">
        <div className="flex justify-center w-full">
          <div className="flex flex-col lg:flex-row max-w-6xl w-full px-4 gap-16">
            {/* Lado esquerdo: imagem + breadcrumb */}
            <div className="flex flex-col items-start w-full lg:w-auto max-w-md">
              <p className="text-gray-500 text-sm mb-2">
                Início / Joias / {produto.categoria.nome_categoria} / {produto.nome}
              </p>
              <img
                src={produto.imagens[0].imagem}
                alt={produto.nome}
                className="w-full h-auto object-cover "
              />
            </div>

            {/* Lado direito: detalhes */}
            <div className="flex flex-col justify-start lg:justify-between w-full lg:w-1/2 lg:pl-12">
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
              
              {/* Contador de quantidade */}
              <div className="flex items-center gap-2 mt-6 mb-3">
                <button
                  onClick={diminuir}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="px-3 py-1 border text-gray-800">{quantidade}</span>
                <button
                  onClick={aumentar}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>

              {/* Quantidade disponível */}
              <p className="text-sm text-gray-600 mb-4">
                Quantidade disponível em estoque: {produto.qtd_disponivel}
              </p>

              {/* Botão adicionar ao carrinho */}
              <button
                onClick={adicionarAoCarrinho}
                className="mt-auto px-6 py-3 bg-[#1c2c3c] max-w-[400px] font-MontserratRegular text-brancoperola hover:bg-[#25384d] transition"
              >
                Adicionar à sacola
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Seção de descrição e detalhes */}
        <div className="mt-12 max-w-6xl mx-auto px-4">
          {/* Título */}
          <h2 className="text-2xl font-RoxboroughCFRegular text-gray-800 mb-3">
            Detalhes
          </h2>
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

      {/* Mini carrinho popup */}
        {abrirMiniCarrinho && (
          <MiniCarrinho  
          carrinho={carrinho}
            fechar={() => setAbrirMiniCarrinho(false)}
            irParaCarrinho={() => {
              setAbrirMiniCarrinho(false); // fecha o popup
              navigate("/carrinho");       // redireciona para a página de carrinho
            }}
          />
        )}
      <ProdutosRelacionados 
        produtos={produtos.filter(p => p.categoria.nome_categoria === produto.categoria.nome_categoria && p.id !== produto.id)}
      />
      <DropdownSection />
      <Footer />
    </div>
  );
}
