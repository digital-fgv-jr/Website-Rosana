import React from "react";

export default function Filtros({ categorias, categoriaAtiva, onFiltroClick }) {
  
  // Adicionamos uma verificação para o caso de as categorias ainda não terem carregado
  if (!categorias || categorias.length === 0) {
    return <div>Carregando filtros...</div>;
  }

  return (
    // O container e o map agora usam a prop 'categorias'
    <div className="flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap snap-x snap-mandatory sm:flex-wrap sm:overflow-visible">
      {categorias.map(({ slug, label }) => (
        <button
          key={slug}
          onClick={() => onFiltroClick(slug)} // Chama a função passada pelo pai
          className={`
            inline-flex shrink-0 snap-start
            px-4 py-2 text-[95%] font-MontserratRegular transition-all duration-200 ease-in-out
            rounded-lg
            ${
              categoriaAtiva === slug
                ? "bg-[#1c2c3c] text-white shadow-md scale-105"
                : "bg-[#faf9f6] text-[#1c2c3c] hover:bg-[#c2b280] hover:text-white hover:shadow-lg hover:scale-105"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
