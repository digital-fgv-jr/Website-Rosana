import Header from "../components/Header";
import Footer from "../components/Footer";
import DropdownSection from "../components/DropdownSection";

export default function SobreNos() {
    return (
      <div className ="bg-[#faf9f6]">
          <Header />
          
          {/* Títulos e subtítulo */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Sobre Nós</h1>
        <p className="text-lg text-gray-700">
          Conheça a história e a essência da RoAlves Joalheria
        </p>
      </section>

      {/* Primeiro bloco: texto à esquerda, imagem à direita */}
      <section className="flex flex-col lg:flex-row items-center py-12 px-6 max-w-6xl mx-auto gap-8">
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Nossa Missão</h2>
          <p className="text-gray-700">
            Criar joias que contem histórias e emocionam cada cliente. 
            Cada peça é pensada com cuidado e carinho.
          </p>
        </div>
        <div className="lg:w-1/2">
          <img 
            src="blocoimg1.jpg" 
            alt="Missão" 
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Segundo bloco: texto à direita, imagem à esquerda */}
      <section className="flex flex-col lg:flex-row-reverse items-center py-12 px-6 max-w-6xl mx-auto gap-8">
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Nossa História</h2>
          <p className="text-gray-700">
            Desde a fundação, buscamos criar joias únicas, conectando tradição
            e modernidade. Cada criação reflete paixão e dedicação.
          </p>
        </div>
        <div className="lg:w-1/2">
          <img 
            src="blocoimg2.jpg" 
            alt="História" 
            className="w-full h-auto"
          />
        </div>
        </section>
          <DropdownSection />
          <Footer />
      </div>
    )
}
