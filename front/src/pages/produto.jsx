import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DropdownSection from "../components/DropdownSection";
import { produtos } from "../data/produtos";

export default function Produto() {
  const { id } = useParams();
  const produto = produtos.find((p) => p.id === parseInt(id));

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagem */}
          <div className="flex justify-center items-center">
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full max-w-md h-auto object-cover"
            />
          </div>

          {/* Detalhes */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{produto.nome}</h1>
            <p className="text-2xl text-[#1c2c3c] font-semibold mb-6">{produto.preco}</p>
            <p className="text-gray-600 leading-relaxed mb-8">
              {produto.descricao || "Descrição detalhada do produto será exibida aqui."}
            </p>
            <button className="px-6 py-3 bg-[#1c2c3c] text-white rounded-lg hover:bg-[#25384d] transition">
              Comprar Agora
            </button>
          </div>
        </div>
      </main>
      <DropdownSection />
      <Footer />
    </div>
  );
}