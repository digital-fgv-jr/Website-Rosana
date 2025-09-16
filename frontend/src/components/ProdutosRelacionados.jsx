import { Link } from "react-router-dom";

// Helper para garantir a URL completa da imagem
const backendOrigin = (() => {
  try {
    const url = new URL(import.meta.env.VITE_API_URL);
    return url.origin;
  } catch (_e) {
    try { return window.location.origin; } catch (_e2) { return ""; }
  }
})();

const toBackendUrl = (input) => {
  const placeholder = "/placeholder.svg";
  if (!input) return placeholder;
  try {
    const parsed = new URL(input, backendOrigin || undefined);
    return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch (_e) {
    const path = String(input).startsWith("/") ? String(input) : `/${String(input)}`;
    return `${backendOrigin}${path}`;
  }
};

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
            className="
              bg-[#faf9f6] overflow-hidden rounded-lg 
              transform transition-all duration-200 ease-in-out
              shadow-sm hover:shadow-xl hover:scale-105 hover:border hover:border-[#c2b280]
            "
          >
            <img
              // A CORREÇÃO ESTÁ AQUI:
              // Usamos produto.__thumb, que é o campo padronizado pelo nosso formatador.
              src={toBackendUrl(produto.__thumb)}
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