import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CirclePlus, CircleMinus } from "lucide-react";
import MiniCarrinho from "../components/MiniCarrinho";
import { produtos } from "../data/produtos";
import ProdutosRelacionados from "../components/ProdutosRelacionados";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import PreFooter from "../components/PreFooter";
import WhatsApp from "../components/Atoms/WhatsApp";

export default function Produto() {


  const navigate = useNavigate();
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
      <Header/>     

      {/* SENTINELA: é ele que dispara a aparição do header compacto */}
      <div id="header-sentinel" style={{ position: 'absolute', top: 0, height: 0, margin: 0, padding: 0 }} />

      <HeaderCompact />

      <main className="flex-grow bg-brancoperola py-12 px-6">
        <div className="flex justify-center w-full">
          <div className="flex flex-col-reverse lg:flex-row max-w-6xl w-full px-4 gap-16">
            
            {/* Lado esquerdo (desktop) / abaixo da imagem (mobile): detalhes */}
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
              
              {/* Contador de quantidade */}
              <div className="flex items-center gap-2 mt-6 mb-5">
                <button onClick={diminuir}>
                  <CircleMinus
                    className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:scale-110 hover:[#c2b280] cursor-pointer"
                  />
                </button>
                <span className="w-6 text-center text-gray-700 font-medium">{quantidade}</span>
                <button onClick={aumentar}>
                  <CirclePlus
                    className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:scale-110 hover:text-[#c2b280] cursor-pointer"
                  />
                </button>
              </div>

              {/* Quantidade disponível */}
              <p className="text-sm text-gray-600 mb-4">
                Quantidade em estoque: {produto.qtd_disponivel}
              </p>

              {/* Botão adicionar ao carrinho */}
              <button
                onClick={adicionarAoCarrinho}
                className="
                  mt-auto px-6 py-3 bg-[#1c2c3c] max-w-[200px] font-MontserratRegular
                  text-brancoperola rounded-lg shadow-sm hover:bg-[#25384d] hover:shadow-md
                  transform transition duration-300 ease-in-out"
              >
                Adicionar à sacola
              </button>
            </div>

            {/* Lado direito (desktop) / acima dos detalhes (mobile): imagem + breadcrumb */}
            <div className="flex flex-col items-start w-full lg:w-auto max-w-md lg:ml-auto">
              <p className="text-gray-500 text-sm mb-2">
                Início / Joias / {produto.categoria.nome_categoria} / {produto.nome}
              </p>
              <div className="w-full border border-[#c0c0c0] shadow-sm bg-white">
                <img
                  src={produto.imagens[0].imagem}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Seção de descrição e detalhes */}
       <div className="mt-12 max-w-6xl w-[60%] px-4 lg:pl-12">
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

      <WhatsApp />
      <PreFooter />
      <Footer />
    </div>
  );
}
