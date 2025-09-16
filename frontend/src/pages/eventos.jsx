import Header from "../components/Header"
import HeaderCompact from "../components/HeaderCompact";
import PreFooter from "../components/PreFooter"
import Footer from "../components/Footer";
import WhatsApp from "../components/Atoms/WhatsApp";

export default function Eventos() {
    return (
      <div className="bg-[#faf9f6]">

       <Header/> 
            
      {/* SENTINELA: é ele que dispara a aparição do header compacto */}
      <div id="header-sentinel" style={{ position: 'absolute', top: 0, height: 0, margin: 0, padding: 0 }} />
      
      <HeaderCompact />

      {/* Títulos e subtítulo */}
      <section className="text-center py-5 bg-brancoperola mt-2">
        <h1 className="text-6xl font-BodoniMT mb-4">Eventos </h1>
        <p className="text-lg text-gray-700 font-MontserratRegular">
           Onde podemos nos conectar com <span className="text-[#c2b280]"> você.</span>
        </p>
      </section>

      <main className="bg-[#faf9f6] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-24">

        {/* ===== Bloco 1: Texto à esquerda, imagens à direita ===== */}
        <section className="flex flex-col md:flex-row gap-8 items-center">
          {/* Texto */}
          <div className="flex-1">
            <h2 className="text-4xl font-BodoniMT text-[#1c2c3c] mb-10">
              Participar de um evento é sempre mais do que expor joias
            </h2>
            <p className=" text-[#1c2c3c] font-MontserratRegular text-[130%] leading-relaxed text-justify">
              Cada peça que levamos carrega consigo a essência do nosso trabalho: o afeto, a memória e a identidade. Quando essas criações encontram pessoas, nascem novas conexões, novos significados e novas possibilidades de personalização.
            </p>
            <p className=" text-[#1c2c3c] font-MontserratRegular text-[130%] leading-relaxed mt-4 text-justify">
              Nossos eventos são espaços de troca. É ali que conversamos, ouvimos histórias e descobrimos inspirações que muitas vezes se transformam em joias únicas. O brilho nos olhos de quem encontra uma peça que traduz exatamente um sentimento é o que nos move a continuar criando.
            </p>
            <p className=" text-[#1c2c3c] font-MontserratRegular text-[130%] leading-relaxed mt-4 text-justify">
              Feiras, exposições e encontros coletivos nos permitem compartilhar a força do trabalho artesanal. São ocasiões em que celebramos a beleza do feito à mão, mostrando que cada detalhe é pensado com cuidado, sem pressa e sem fórmulas prontas. Em um mundo acelerado, nossos eventos são convites para desacelerar e valorizar o que é único.
            </p>
          </div>

          {/* Imagens */}
          <div className="flex-1 flex flex-col gap-4 rounded-lg">
            <img src="/filigrana1.jpg" alt="Evento 1" className="w-full h-[370px] object-cover " />
            <img src="/pingente1.jpg" alt="Evento 2" className="w-full h-[370px] object-cover " />
          </div>
        </section>

        {/* ===== Bloco 2: Imagens à esquerda, texto à direita ===== */}
        <section className="flex flex-col md:flex-row-reverse gap-8 items-center">
          {/* Texto */}
          <div className="flex-1">
            <h2 className="text-4xl font-BodoniMT text-[#1c2c3c] mb-10">
              Mais do que mostrar nossas joias, queremos apresentar nossa essência
            </h2>
            <p className="text-[#1c2c3c] font-MontserratRegular text-[130%] leading-relaxed text-justify">
              Quem visita um evento nosso não encontra apenas uma coleção, mas um universo de significados: peças que podem ser adaptadas, personalizadas ou criadas a partir de uma memória pessoal. Cada conversa pode se tornar o ponto de partida para uma nova história em ouro e prata.
            </p>
            <p className="text-[#1c2c3c] font-MontserratRegular text-[130%] leading-relaxed mt-4 text-justify">
              Também acreditamos que os eventos têm um papel de aproximação. É ali que clientes se tornam amigos, que ideias ganham forma e que o afeto encontra espaço para ser celebrado. São encontros que nos permitem crescer não apenas como marca, mas como parte de uma comunidade que valoriza o artesanal, o autoral e o verdadeiro.
            </p>
            <p className="text-[#1c2c3c] font-MontserratRegular text-[130%] leading-relaxed mt-4 text-justify">
              Porque, no fim, cada evento é uma celebração da vida. Uma oportunidade de transformar lembranças em joias, encontros em inspirações e instantes em eternidade. E é por isso que cada participação nossa carrega o mesmo propósito: emocionar, conectar e eternizar histórias.
            </p>
          </div>

          {/* Imagens */}
          <div className="flex-1 flex flex-col gap-4">
            <img src="/anel1.jpg" alt="Evento 3" className="w-full h-[380px] object-cover" />
            <img src="/colar1.jpg" alt="Evento 4" className="w-full h-[380px] object-cover" />
          </div>
        </section>
      </div>
      </main>
        
        <WhatsApp />
        <PreFooter />
        <Footer />
      </div>
    )
}
