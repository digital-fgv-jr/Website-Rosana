export default function ThreeImagesSection() {
  return (
    <section className="mt-16 mb-16 max-w-[90%] mx-auto bg-[#faf9f6]">
      <div className="flex gap-8">
        {/* Bloco de imagens à esquerda */}
        <div className="flex w-[873px] h-[590px] gap-4">
          {/* Imagem 1 */}
          <img
            src="/blocoimg1.jpg"
            alt="Imagem 1"
            className="w-[352px] h-[576px] object-cover"
          />
          {/* Imagens 2 e 3 empilhadas */}
          <div className="flex flex-col gap-4">
            <img
              src="/blocoimg2.jpg"
              alt="Imagem 2"
              className="w-[504px] h-[280px] object-cover"
            />
            <img
              src="/blocoimg3.jpg"
              alt="Imagem 3"
              className="w-[504px] h-[280px] object-cover"
            />
          </div>
        </div>

        {/* Texto à direita */}
        <div className="flex-1 flex flex-col justify-start pl-4">
        <h2 className="text-3xl font-bold text-[#1c2c3c] mb-2">
            Descubra nossas joias exclusivas
        </h2>
        <p className="text-lg text-gray-600 mb-4">
            Cada peça é criada para você, com cuidado e atenção aos detalhes.
        </p>
        <button className="px-6 py-3 bg-[#1c2c3c] text-[#faf9f6] font-medium rounded-lg hover:bg-[#25384d] transition">
            Entre em Contato
        </button>
        </div>

      </div>
    </section>
  );
}
