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

const PLACEHOLDER = '/placeholder.svg';
const toTitleCase = (str = "") => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const mapCategoria = (cat) => {
  const nome = cat?.nome_categoria || "joias";
  const slug = nome.toLowerCase().normalize("NFD").replace(/[\u300-\u036f]/g, "");
  return { slug, label: toTitleCase(nome) };
};

export default function Produto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState(() => {
    try { return JSON.parse(localStorage.getItem("carrinho") || "[]"); }
    catch { return []; }
  });
  const [abrirMiniCarrinho, setAbrirMiniCarrinho] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      setError(null);
      document.body.scrollTop = 0; // Para garantir que a página comece no topo
      document.documentElement.scrollTop = 0;
      try {
        const resProduto = await getProdutoById(id);
        
        if (resProduto?.data) {
          const produtoFormatado = formatarProdutoParaFrontend(resProduto.data);
          setProduto(produtoFormatado);
          
          // Carrega todos os produtos apenas se o produto principal foi carregado com sucesso
          const lista = await buscarEFormatarProdutos();
          setTodosProdutos(lista || []);
        } else {
          setError("Produto não encontrado.");
        }
      } catch (e) {
        console.error("Erro ao carregar dados do produto:", e);
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
    return <div className="min-h-screen flex items-center justify-center font-BodoniMT text-xl">Carregando produto...</div>;
  }

  if (error || !produto) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <p className="text-gray-600 text-xl font-BodoniMT">{error || "Produto não encontrado."}</p>
        <Link to="/joias" className="mt-4 px-4 py-2 bg-[#1c2c3c] text-white rounded font-MontserratRegular">Voltar para a loja</Link>
      </div>
    );
  }

  const aumentar = () => setQuantidade((q) => Math.min(q + 1, produto.qtd_disponivel));
  const diminuir = () => setQuantidade((q) => Math.max(1, q - 1));

  const adicionarAoCarrinho = () => {
    const precoNumerico = parseFloat(String(produto.preco).replace('R$', '').replace(/\./g, '').replace(',', '.'));
    
    const itemNoCarrinho = {
      id: produto.id,
      nome: produto.nome,
      quantidade: quantidade,
      preco_num: isNaN(precoNumerico) ? 0 : precoNumerico,
      imagem: produto.imagens?.[0]?.imagem || PLACEHOLDER
    };

    setCarrinho(prevCarrinho => {
      const carrinhoAtualizado = [...prevCarrinho];
      const itemExistente = carrinhoAtualizado.find(p => p.id === itemNoCarrinho.id);

      if (itemExistente) {
        itemExistente.quantidade += quantidade;
      } else {
        carrinhoAtualizado.push(itemNoCarrinho);
      }
      return carrinhoAtualizado;
    });

    setAbrirMiniCarrinho(true);
  };
  
  const primeiraCategoria = produto.categorias?.[0] || {};
  const { slug: catSlug, label: catLabel } = mapCategoria(primeiraCategoria);
  const productTitleCase = toTitleCase(produto.nome);
  const semEstoque = Number(produto.qtd_disponivel || 0) <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-brancoperola">
      <Header />
      <div id="header-sentinel" />
      <HeaderCompact />

      <main className="flex-grow bg-brancoperola py-10 sm:py-12">
        <div className="container mx-auto max-w-6xl w-full px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="order-2 lg:order-1 sticky top-24">
              <nav aria-label="breadcrumb" className="text-gray-500 text-sm mb-3">
                <ol className="flex flex-wrap items-center gap-1 font-MontserratRegular">
                  <li><Link to="/" className="hover:text-[#1c2c3c]">Início</Link></li>
                  <li>/</li>
                  <li><Link to="/joias" className="hover:text-[#1c2c3c]">Joias</Link></li>
                  <li>/</li>
                  <li><Link to={`/joias?categoria=${catSlug}`} className="hover:text-[#1c2c3c]">{catLabel}</Link></li>
                  <li>/</li>
                  <li aria-current="page" className="text-gray-700">{productTitleCase}</li>
                </ol>
              </nav>
              <div className="w-full bg-white border border-gray-200/80 shadow-sm rounded-lg overflow-hidden">
                <div className="w-full aspect-[4/5] bg-[#f4f4f4]">
                  <img src={produto.imagens?.[0]?.imagem || PLACEHOLDER} alt={produto.nome} className="w-full h-full object-cover"/>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-RoxboroughCFRegular text-[#1c2c3c] mb-2">
                  {produto.nome}
                </h1>
                <p className="text-2xl text-[#1c2c3c] font-MontserratRegular">
                  {produto.preco}
                </p>
              </div>
              <p className="text-gray-700 mt-6 leading-relaxed font-MontserratRegular">
                {produto.descricao}
              </p>
              <div className="flex items-center gap-3 mt-6 mb-4">
                <button onClick={diminuir} disabled={quantidade <= 1}><CircleMinus className="w-6 h-6 text-gray-700" /></button>
                <span className="font-semibold text-lg">{quantidade}</span>
                <button onClick={aumentar} disabled={quantidade >= produto.qtd_disponivel}><CirclePlus className="w-6 h-6 text-gray-700" /></button>
              </div>
              <p className="text-sm text-gray-600 mb-5 font-MontserratRegular">
                {semEstoque ? "Produto indisponível" : `Disponível: ${produto.qtd_disponivel} unidades`}
              </p>
              <button onClick={adicionarAoCarrinho} disabled={semEstoque} className="mt-1 px-6 py-3 font-MontserratRegular rounded-lg shadow-sm transition bg-[#1c2c3c] text-white hover:bg-[#25384d] disabled:bg-gray-400 disabled:cursor-not-allowed">
                {semEstoque ? "Indisponível" : "Adicionar à sacola"}
              </button>
            </div>
          </div>
        </div>
        
        {(produto.detalhes && produto.detalhes.length > 0) && (
          <section className="mt-16">
            <div className="container mx-auto max-w-6xl w-full px-4">
              <h2 className="text-2xl font-RoxboroughCFRegular text-gray-800 mb-3 text-center">Detalhes</h2>
              <hr className="border-t-2 border-gray-300 mb-6 w-full max-w-2xl mx-auto" />
              <div className="max-w-3xl mx-auto w-full bg-white/50 border border-gray-200/80 rounded-lg p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {produto.detalhes.map((detalhe, idx) => (
                    <div key={idx}>
                      <dt className="font-semibold text-[#1c2c3c] font-MontserratRegular">{detalhe.propriedade}</dt>
                      <dd className="text-gray-600 font-MontserratRegular">{detalhe.descricao}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        )}
      </main>

      {abrirMiniCarrinho && <MiniCarrinho carrinho={carrinho} fechar={() => setAbrirMiniCarrinho(false)} />}
      
      <ProdutosRelacionados
        produtos={todosProdutos.filter(p => p.id !== produto.id && p.categorias.some(c => c.id === primeiraCategoria?.id))}
      />

      <WhatsApp />
      <PreFooter />
      <Footer />
    </div>
  );
}