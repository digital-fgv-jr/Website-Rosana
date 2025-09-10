import React from "react";

export default function Filtros({ categoriaFiltro, setCategoriaFiltro }) {
  // categorias que você mencionou
  const categorias = ["todos", "anel", "brinco", "colar", "filigrana", "pingente"];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {categorias.map(cat => (
        <button
          key={cat}
          onClick={() => setCategoriaFiltro(cat)}
          className={`px-4 py-2 rounded font-medium transition 
            ${
              categoriaFiltro === cat
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)} {/* primeira letra maiúscula */}
        </button>
      ))}
    </div>
  );
}
