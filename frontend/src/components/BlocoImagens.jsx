// components/BlocoImagens.jsx
export default function ThreeImagesSection() {
  return (
    <section className="flex justify-center w-full bg-[#faf9f6] px-4 pt-16 pb-12 xl:px-0">
      <div className="flex flex-col xl:flex-row w-full max-w-6xl mx-auto xl:gap-x-12 items-center">
        
        {/* Bloco de imagens à esquerda (desktop) */}
        <div className="hidden xl:flex w-full xl:w-1/2 gap-4 items-center">
          {/* Imagem em pé (tamanho reduzido) */}
          <img
            src="/blocoimg1.jpg"
            alt="Joia sendo criada artesanalmente"
            className="w-[300px] h-[480px] object-cover rounded-lg"
          />
          {/* Imagens deitadas empilhadas (tamanho reduzido) */}
          <div className="flex flex-col gap-4">
            <img
              src="/blocoimg2.jpg"
              alt="Detalhe de polimento de uma joia"
              className="w-[430px] h-[232px] object-cover rounded-lg"
            />
            <img
              src="/blocoimg3.jpg"
              alt="Chaveiro personalizado com cortiça de vinho"
              className="w-[430px] h-[232px] object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Bloco de texto à direita */}
        <div className="flex-1 flex flex-col justify-center items-center xl:items-start text-center xl:text-left mt-8 xl:mt-0 w-full xl:w-1/2">
          <h2 className="text-3xl md:text-4xl font-RoxboroughCFBold text-[#1c2c3c] mb-4">
            Joias com Significado
          </h2>
          {/* Texto justificado e com maior espaçamento entre linhas */}
          <p className="text-base md:text-lg font-MontserratRegular text-[#1c2c3c] mb-6 text-justify leading-relaxed">
            Cada peça é criada para você, com cuidado e atenção aos detalhes. Transformamos memórias e desejos em joias únicas que contam a sua história, unindo a tradição do artesanato com um design moderno e atemporal.
          </p>
          <button
            className="px-6 py-3 bg-[#1c2c3c] text-[#faf9f6] font-MontserratRegular rounded-lg hover:bg-[#25384d] transition"
            onClick={() => (window.location.href = "/criadas-para-voce")}
          >
            Conheça o Processo
          </button>
        </div>
      </div>
    </section>
  );
}