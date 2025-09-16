import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import PreFooter from "../components/PreFooter";
import Footer from "../components/Footer";
import WhatsApp from "../components/Atoms/WhatsApp";

export default function CriadasParaVoce() {
  return (
    <div className="bg-[#faf9f6]">
      <Header />

      {/* SENTINELA: dispara o HeaderCompact quando some do topo */}
      <div
        id="header-sentinel"
        style={{ position: "absolute", top: 0, height: 0, margin: 0, padding: 0 }}
      />
      <HeaderCompact />

      {/* Título principal */}
      <div className="text-center px-4 sm:px-6 my-8 sm:my-12">
        <h1 className="text-5xl sm:text-6xl font-BodoniMT text-[#1c2c3c]">
          Criadas Para <span className="text-[#c2b280]">Você</span>
        </h1>
        <p className="text-base sm:text-lg mt-4 font-MontserratRegular text-[#1c2c3c]">
          Cada joia tem uma história única
        </p>
      </div>

      {/* Bloco 1: Texto à esquerda, imagem à direita */}
      <div className="flex flex-col lg:flex-row items-center gap-8 my-12 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="lg:w-1/2 space-y-5 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl font-BodoniMT text-[#1c2c3c] mb-2 sm:mb-6">
            Cada peça conta uma história
          </h2>

          <p className="text-gray-700 font-MontserratRegular text-[1.05rem] sm:text-[1.125rem] md:text-[1.25rem] leading-relaxed md:leading-8 text-justify break-words [hyphens:auto]">
            Joia personalizada é conversa e escuta: você traz memórias, referências e desejos; nós
            traduzimos tudo em forma, textura e brilho. O resultado não é apenas um acessório, mas
            um símbolo íntimo — algo que guarda um momento, uma pessoa, um rito de passagem.
          </p>

          <p className="text-gray-700 font-MontserratRegular text-[1.05rem] sm:text-[1.125rem] md:text-[1.25rem] leading-relaxed md:leading-8 text-justify break-words [hyphens:auto]">
            Criamos peças que nascem do seu repertório: anéis, pingentes, filigranas e outras técnicas
            artesanais que respeitam sua história e seu estilo. Cada detalhe é pensado para que a joia
            acompanhe a vida real — bonita, durável e com significado.
          </p>
        </div>

        <div className="lg:w-1/2 w-full">
          <img
            src="/blocoimg1.jpg"
            alt="Joia personalizada 1"
            className="w-full h-56 sm:h-72 md:h-[400px] object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Bloco 2: Imagens à esquerda, texto à direita (COMO FUNCIONA) */}
      <div
        id="como-funciona"
        className="scroll-mt-28 flex flex-col lg:flex-row items-center gap-8 my-12 max-w-6xl mx-auto px-4 sm:px-6"
      >
        <div className="lg:w-1/2 w-full flex flex-col gap-4">
          <img
            src="/blocoimg2.jpg"
            alt="Joia personalizada 2"
            className="w-full h-48 sm:h-60 md:h-[300px] object-cover rounded-lg"
          />
          <img
            src="/blocoimg3.jpg"
            alt="Joia personalizada 3"
            className="w-full h-48 sm:h-60 md:h-[300px] object-cover rounded-lg"
          />
        </div>

        <div className="lg:w-1/2 space-y-5 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl font-BodoniMT text-[#1c2c3c] mb-2 sm:mb-6">
            O artesanal que emociona
          </h2>

          <p className="text-gray-700 font-MontserratRegular text-[1.05rem] sm:text-[1.125rem] md:text-[1.25rem] leading-relaxed md:leading-8 text-justify break-words [hyphens:auto]">
            <strong>Como funciona:</strong> você fala com a gente pelo WhatsApp e conta o que busca —
            a ocasião, o sentimento, referências visuais e preferências de material. A partir dessa
            conversa entendemos suas dores (prazo, orçamento, estilo) e sugerimos caminhos de criação.
          </p>

          <p className="text-gray-700 font-MontserratRegular text-[1.05rem] sm:text-[1.125rem] md:text-[1.25rem] leading-relaxed md:leading-8 text-justify break-words [hyphens:auto]">
            Depois do alinhamento inicial, enviamos uma <strong>proposta</strong> com conceito,
            estimativa de investimento e <strong>prazo</strong>. Os ajustes são combinados por mensagem,
            de forma simples e transparente. Com tudo aprovado, confirmamos o pedido e você realiza o
            pagamento para dar início à produção.
          </p>

          <p className="text-gray-700 font-MontserratRegular text-[1.05rem] sm:text-[1.125rem] md:text-[1.25rem] leading-relaxed md:leading-8 text-justify break-words [hyphens:auto]">
            A peça é produzida artesanalmente, com acompanhamento por WhatsApp quando necessário.
            Antes do envio, fazemos o controle de qualidade. Sua joia segue embalada com cuidado e,
            se precisar, oferecemos orientações de uso, conservação e eventuais ajustes.
          </p>
        </div>
      </div>

      {/* Contato */}
      <div id="contato" className="scroll-mt-28 text-center px-4 sm:px-6 my-12">
        <h2 className="text-3xl sm:text-4xl font-BodoniMT text-[#1c2c3c] mb-6">
          Vamos conversar?
        </h2>

        <button
          className="px-6 py-3 bg-[#1c2c3c] text-[#faf9f6] font-MontserratRegular rounded-lg hover:bg-[#25384d] transition"
          onClick={() => (window.location.href = "/contato")}
        >
          Entre em contato
        </button>
      </div>

      <WhatsApp />
      <PreFooter />
      <Footer />
    </div>
  );
}
