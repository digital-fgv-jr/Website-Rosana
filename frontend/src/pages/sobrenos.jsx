import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import PreFooter from "../components/PreFooter";
import Footer from "../components/Footer";
import WhatsApp from "../components/Atoms/WhatsApp";

export default function SobreNos() {
  return (
    <div className="bg-[#faf9f6]">
      <Header />

      {/* SENTINELA: dispara o HeaderCompact quando a barra some do topo */}
      <div
        id="header-sentinel"
        style={{ position: "absolute", top: 0, height: 0, margin: 0, padding: 0 }}
      />
      <HeaderCompact />

      {/* Cabeçalho */}
      <section className="text-center py-5" id="sobre-nos">
        <h1 className="text-6xl font-BodoniMT mb-4">
          Sobre <span className="text-[#c2b280]">Nós</span>
        </h1>
        <p className="text-lg text-gray-700 font-MontserratRegular">
          Toda joia tem uma história — nós também temos uma.
        </p>
      </section>

      {/* === MISSÃO === */}
      <section
        id="missao"
        aria-labelledby="missao-title"
        className="scroll-mt-28 flex flex-col lg:flex-row items-center py-12 px-6 max-w-6xl mx-auto gap-8"
      >
        <div className="lg:w-1/2">
          <h2
            id="missao-title"
            className="text-4xl font-BodoniMT text-[#1c2c3c] mb-10"
          >
            Nossa <span className="text-[#c2b280]">Missão</span>
          </h2>
          <p className="text-gray-700 text-xl font-MontserratRegular leading-relaxed text-justify">
            Nossa história nasceu de um sonho antigo: transformar a paixão por joias
            artesanais em um espaço onde cada criação carrega memórias, afetos e
            identidade. Depois de anos de dedicação ao ofício, percebemos que o que
            realmente dá valor a uma joia não é apenas o material, mas a história que
            ela tem a contar. Trabalhamos com produção autoral e artesanal, em pequena
            escala, porque acreditamos que o verdadeiro luxo está na singularidade.
            Cada peça é criada com cuidado, unindo tradição e modernidade, para
            refletir a essência de quem a recebe. Aqui, não existem coleções
            padronizadas: cada detalhe pode ser adaptado para traduzir sentimentos
            únicos.
          </p>
        </div>
        <div className="lg:w-1/2">
          <img
            src="blocoimg1.jpg"
            alt="Joalheria artesanal representando a missão da marca"
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      </section>

      {/* === HISTÓRIA === */}
      <section
        id="historia"
        aria-labelledby="historia-title"
        className="scroll-mt-28 flex flex-col lg:flex-row-reverse items-center py-12 px-6 max-w-6xl mx-auto gap-8"
      >
        <div className="lg:w-1/2">
          <h2
            id="historia-title"
            className="text-4xl font-BodoniMT text-[#1c2c3c] mb-10"
          >
            Nossa <span className="text-[#c2b280]">História</span>
          </h2>
          <p className="text-gray-700 text-xl font-MontserratRegular leading-relaxed text-justify">
            Nosso propósito é criar joias que vão além da estética. São símbolos de
            conquistas, celebrações, memórias familiares e momentos inesquecíveis.
            Queremos que cada cliente se veja em sua joia, que encontre nela uma
            extensão de sua própria história.
          </p>
          <p className="text-gray-700 text-xl font-MontserratRegular leading-relaxed mt-4 text-justify">
            Mais do que uma marca, somos um ateliê de significados. Um espaço onde o
            brilho do ouro e da prata se mistura com a beleza das lembranças,
            transformando emoções em peças que duram para sempre. Porque acreditamos
            que cada vida merece ser celebrada — e cada história, eternizada.
          </p>
        </div>
        <div className="lg:w-1/2">
          <img
            src="blocoimg2.jpg"
            alt="Linha do tempo visual da história da marca"
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      </section>

      <WhatsApp />
      <PreFooter />
      <Footer />
    </div>
  );
}
