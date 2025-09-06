import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DropdownSection from "../components/DropdownSection";
import { produtos } from "../data/produtos";
import { useState } from "react";

export default function Joias() {
  const [visibleCount, setVisibleCount] = useState(9);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-12 px-6">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 max-w-6xl mx-auto">
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
        Joias
        </h1>

        {/* Botões de categorias */}
        <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 text-sm font-medium bg-white shadow rounded hover:bg-gray-200 transition">
            Ver Tudo
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-white shadow rounded hover:bg-gray-200 transition">
            Anéis
        </button>
         <button className="px-4 py-2 text-sm font-medium bg-white shadow rounded hover:bg-gray-200 transition">
            Brincos
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-white shadow rounded hover:bg-gray-200 transition">
            Cordões
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-white shadow rounded hover:bg-gray-200 transition">
            Filigrana
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-white shadow rounded hover:bg-gray-200 transition">
            Pingentes
        </button>
        </div>
        </div>

        {/* Linha de informações: total de produtos e botão de filtro */}
        <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        {/* Total de produtos */}
        <p className="text-gray-600 text-sm">
        {produtos.length} produtos encontrados
        </p>

        {/* Botão de filtro */}
        <button className="px-4 py-2 bg-white shadow rounded hover:bg-gray-200 transition text-sm font-medium">
            Filtrar
        </button>
        </div>


        {/*Grid de produtos*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {produtos.slice(0, visibleCount).map((produto) => (
            <Link
              key={produto.id}
              to={`/produto/${produto.id}`} 
              className="bg-white overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold">{produto.nome}</h2>
                <p className="text-gray-600 mt-2">{produto.preco}</p>
              </div>
            </Link>
            ))}
        </div>
      
        {/* Botão carregar mais */}
        {visibleCount <= produtos.length && (
            <div className="flex justify-center mt-6">
            <button
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="px-6 py-2 bg-[#1c2c3c] text-white rounded hover:bg-[#25384d] transition"
            > Carregar mais
            </button>
        </div>
        )}
      </main>
      
      <DropdownSection />
      
      <Footer />
    </div>
  );
}

