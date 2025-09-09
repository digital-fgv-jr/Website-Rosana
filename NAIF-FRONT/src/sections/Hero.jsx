
export default function Hero() {


  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-2xl px-6">
        {/* Título principal */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Toda joia tem uma história ✨
        </h1>

        {/* Subtítulo */}
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          Descubra joias criadas especialmente para você, com significado e
          beleza atemporais.
        </p>

        {/* Botão de ação */}
        <button className="mt-8 px-6 py-3 rounded-lg bg-[#1c2c3c] text-white font-medium shadow-lg hover:bg-[#25384d] transition">
          Encontre sua joia afetiva
        </button>

      </div>
    </section>
  );
}
