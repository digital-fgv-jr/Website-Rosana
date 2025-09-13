// components/BlocoImagens.jsx
export default function ThreeImagesSection() {
  return (
    <section className="flex justify-center w-full bg-[#faf9f6] px-4 pt-0 pb-8 xl:px-0 xl:pt-4 xl:pb-16">
      {/* Container principal do bloco */}
      <div className="flex flex-col xl:flex-row w-full max-w-[1200px] mx-auto xl:gap-x-16">
        {/* Bloco de imagens à esquerda (desktop) */}
        <div className="hidden xl:flex w-full xl:w-2/3 2xl:w-1/2 gap-4 items-stretch">
          {/* Imagem em pé */}
          <img
            src="/blocoimg1.jpg"
            alt="Imagem 1"
            className="w-[352px] h-[560px] object-cover rounded-lg"
          />
          {/* Imagens deitadas empilhadas */}
          <div className="flex flex-col gap-4">
            <img
              src="/blocoimg2.jpg"
              alt="Imagem 2"
              className="w-[504px] h-[272px] object-cover rounded-lg"
            />
            <img
              src="/blocoimg3.jpg"
              alt="Imagem 3"
              className="w-[504px] h-[272px] object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Bloco de texto à direita */}
        <div className="flex-1 flex flex-col justify-center items-center xl:items-start text-center xl:text-left mt-8 xl:mt-0 w-full xl:w-1/3 2xl:w-1/2">
          <h2 className="text-3xl md:text-4xl font-RoxboroughCFBold text-[#1c2c3c] mb-2">
            Descubra nossas joias exclusivas
          </h2>
          <p className="text-base md:text-lg font-MontserratRegular text-[#1c2c3c] mb-4">
            Cada peça é criada para você, com cuidado e atenção aos detalhes.
          </p>
          <button
            className="px-6 py-3 bg-[#1c2c3c] text-[#faf9f6] font-MontserratRegular rounded-lg hover:bg-[#25384d] transition"
            onClick={() => (window.location.href = "/contato")}
          >
            Entre em Contato
          </button>
        </div>
      </div>
    </section>
  );
}
