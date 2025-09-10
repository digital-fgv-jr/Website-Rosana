import Header from "../components/Header";
import Footer from "../components/Footer";
import DropdownSection from "../components/DropdownSection";

export default function CriadasParaVoce() {
    return (
      <div className="bg-[#faf9f6]">
          <Header />
          <div className="text-center my-12">
          <h1 className="text-6xl font-RoxboroughCFBold text-[#1c2c3c]">Criadas Para Você</h1>
          <p className="text-[180%] mt-4 font-BodoniMT text-[#1c2c3c]">Cada joia tem uma história única</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 my-12 max-w-6xl mx-auto">
        <div className="lg:w-1/2 space-y-4">
        <p className="text-gray-700 font-MontserratRegular text-[130%]">
          Cada joia personalizada é um diálogo entre a sua história e as mãos
          que a moldam. É no encontro entre lembranças, sonhos e afetos que 
          cada peça ganha forma, tornando-se não apenas um adorno, mas um 
          reflexo sensível daquilo que você viveu e deseja carregar consigo.
        </p> 
        <p className="text-gray-700 font-MontserratRegular text-[130%]"> 
          Essas criações nascem para celebrar momentos que não cabem em palavras: 
          uma conquista, um reencontro, uma memória de família, um amor que merece 
          ser eternizado. Assim, cada detalhe é pensado para transformar sentimentos
          em matéria, traduzindo sua essência em linhas de ouro e prata, em brilhos 
          que falam de quem você é.
        </p>
      </div>
      <div className="lg:w-1/2">
          <img src="/blocoimg1.jpg" alt="Joia personalizada 1" className="w-full h-auto" />
      </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-8 my-12 max-w-6xl mx-auto">
      <div className="lg:w-1/2 flex flex-col gap-4">
    <img src="/blocoimg2.jpg" alt="Joia personalizada 2" className="w-full h-auto" />
    <img src="/blocoimg3.jpg" alt="Joia personalizada 3" className="w-full h-auto" />
    </div>
      <div className="lg:w-1/2 space-y-4">
       <p className="text-gray-700 font-MontserratRegular text-[130%]">
          Cada joia personalizada é um diálogo entre a sua história e as mãos
          que a moldam. É no encontro entre lembranças, sonhos e afetos que 
          cada peça ganha forma, tornando-se não apenas um adorno, mas um 
          reflexo sensível daquilo que você viveu e deseja carregar consigo.
        </p> 
        <p className="text-gray-700 font-MontserratRegular text-[130%]"> 
          Essas criações nascem para celebrar momentos que não cabem em palavras: 
          uma conquista, um reencontro, uma memória de família, um amor que merece 
          ser eternizado. Assim, cada detalhe é pensado para transformar sentimentos
          em matéria, traduzindo sua essência em linhas de ouro e prata, em brilhos 
          que falam de quem você é.
        </p>
        <p className="text-gray-700 font-MontserratRegular text-[130%]">
          Cada joia personalizada é um diálogo entre a sua história e as mãos
          que a moldam. É no encontro entre lembranças, sonhos e afetos que 
          cada peça ganha forma, tornando-se não apenas um adorno, mas um 
          reflexo sensível daquilo que você viveu e deseja carregar consigo.
        </p> 
        <p className="text-gray-700 font-MontserratRegular text-[130%]"> 
          Essas criações nascem para celebrar momentos que não cabem em palavras: 
          uma conquista, um reencontro, uma memória de família, um amor que merece 
          ser eternizado. Assim, cada detalhe é pensado para transformar sentimentos
          em matéria, traduzindo sua essência em linhas de ouro e prata, em brilhos 
          que falam de quem você é.
        </p>
    </div>
    </div>        
    <div className="text-center my-12">
  <button
    className="px-6 py-3 bg-[#1c2c3c] text-[#faf9f6] font-MontserratRegular rounded-lg hover:bg-[#25384d] transition"
    onClick={() => console.log("Clique em entrar em contato")}
  >
    Entre em contato
  </button>
</div>
     
          <DropdownSection />
          <Footer />
      </div>
    )
}
