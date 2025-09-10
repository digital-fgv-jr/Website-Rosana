/* import Header from "../components/Header/Header"
import HeaderCompact from "../components/HeaderCompact/HeaderCompact";
import PreFooter from "../components/PreFooter/PreFooter"
import Footer from "../components/Footer/Footer";
import WhatsApp from "../components/Atoms/WhatsApp/WhatsApp"; */

export default function CriadasParaVoce() {
    return (
      <div className="bg-[#faf9f6]">
          {/*<Header/>*/}         
                
          {/* SENTINELA: é ele que dispara a aparição do header compacto */}
          <div id="header-sentinel" style={{ position: 'absolute', top: 0, height: 0, margin: 0, padding: 0 }} />
          
          {/*<HeaderCompact />*/}

          {/* Título principal */}
          <div className="text-center my-12">
            <h1 className="text-6xl font-BodoniMT text-[#1c2c3c]">
                Criadas Para <span className="text-[#c2b280]">Você</span>
            </h1>
            <p className="text-lg mt-4 font-MontserratRegular text-[#1c2c3c]">
              Cada joia tem uma história única
            </p>
          </div>

          {/* Bloco 1: Texto à esquerda, imagem à direita */}
          <div className="flex flex-col lg:flex-row items-center gap-8 my-12 max-w-6xl mx-auto">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-BodoniMT text-[#1c2c3c] mb-6">
                Cada peça conta uma história
              </h2>
              <p className="text-gray-700 font-MontserratRegular text-[130%] leading-relaxed">
                Cada joia personalizada é um diálogo entre a sua história e as mãos
                que a moldam. É no encontro entre lembranças, sonhos e afetos que 
                cada peça ganha forma, tornando-se não apenas um adorno, mas um 
                reflexo sensível daquilo que você viveu e deseja carregar consigo.
              </p> 
              <p className="text-gray-700 font-MontserratRegular text-[130%] leading-relaxed"> 
                Essas criações nascem para celebrar momentos que não cabem em palavras: 
                uma conquista, um reencontro, uma memória de família, um amor que merece 
                ser eternizado. Assim, cada detalhe é pensado para transformar sentimentos
                em matéria, traduzindo sua essência em linhas de ouro e prata, em brilhos 
                que falam de quem você é.
              </p>
            </div>
            <div className="lg:w-1/2">
                <img src="/blocoimg1.jpg" alt="Joia personalizada 1" className="w-full h-[400px] object-cover rounded-lg" />
            </div>
          </div>

          {/* Bloco 2: Imagens à esquerda, texto à direita */}
          <div className="flex flex-col lg:flex-row items-center gap-8 my-12 max-w-6xl mx-auto">
            <div className="lg:w-1/2 flex flex-col gap-4">
              <img src="/blocoimg2.jpg" alt="Joia personalizada 2" className="w-full h-[300px] object-cover rounded-lg" />
              <img src="/blocoimg3.jpg" alt="Joia personalizada 3" className="w-full h-[300px] object-cover rounded-lg" />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-BodoniMT text-[#1c2c3c] mb-6">
                O artesanal que emociona
              </h2>
              <p className="text-gray-700 font-MontserratRegular text-[130%] leading-relaxed">
                Cada joia personalizada é um diálogo entre a sua história e as mãos
                que a moldam. É no encontro entre lembranças, sonhos e afetos que 
                cada peça ganha forma, tornando-se não apenas um adorno, mas um 
                reflexo sensível daquilo que você viveu e deseja carregar consigo.
              </p> 
              <p className="text-gray-700 font-MontserratRegular text-[130%] leading-relaxed"> 
                Essas criações nascem para celebrar momentos que não cabem em palavras: 
                uma conquista, um reencontro, uma memória de família, um amor que merece 
                ser eternizado. Assim, cada detalhe é pensado para transformar sentimentos
                em matéria, traduzindo sua essência em linhas de ouro e prata, em brilhos 
                que falam de quem você é.
              </p>
              <p className="text-gray-700 font-MontserratRegular text-[130%] leading-relaxed">
                Cada joia personalizada é um diálogo entre a sua história e as mãos
                que a moldam. É no encontro entre lembranças, sonhos e afetos que 
                cada peça ganha forma, tornando-se não apenas um adorno, mas um 
                reflexo sensível daquilo que você viveu e deseja carregar consigo.
              </p> 
            </div>
          </div>        

          {/* Botão */}
          <div className="text-center my-12">
            <button
              className="px-6 py-3 bg-[#1c2c3c] text-[#faf9f6] font-MontserratRegular rounded-lg hover:bg-[#25384d] transition"
              onClick={() => console.log("Clique em entrar em contato")}
            >
              Entre em contato
            </button>
          </div>
     
          {/*<WhatsApp />
          <PreFooter />
          <Footer />*/}
      </div>
    )
}

