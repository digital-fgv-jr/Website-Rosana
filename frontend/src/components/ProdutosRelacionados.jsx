import { Link } from "react-router-dom";

export default function ProdutosRelacionados({ produtos }) {
  if (!produtos || produtos.length === 0) return null;

  return (
    <div className="mt-12 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-RoxboroughCFRegular text-gray-800 mb-4">
        Produtos Relacionados
      </h2>
      <hr className="border-t-2 border-gray-300 mb-6 w-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map((produto) => (
          <Link
            key={produto.id}
            to={`/produto/${produto.id}`}
            className="bg-[#faf9f6] overflow-hidden rounded hover:scale-105 transform transition-shadow shadow-sm"
          >
            <img
              src={produto.imagens[0].imagem}
              alt={produto.nome}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{produto.nome}</h3>
              <p className="text-gray-600 mt-1">{produto.preco}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
