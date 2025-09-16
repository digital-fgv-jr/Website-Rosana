import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";
import Categorias from "../components/Categorias";
import ThreeImagesSection from "../components/BlocoImagens";
import PreFooter from "../components/PreFooter";
import Cookies from "../components/Atoms/Cookies"; 
import WhatsApp from "../components/Atoms/WhatsApp";

export default function Inicio() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header/> 
            
      {/* SENTINELA: dispara a aparição do header compacto */}
      <div 
        id="header-sentinel" 
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "1px", 
          margin: 0, 
          padding: 0 
        }} 
      />
      
      <HeaderCompact />

      <HeroCarousel />

      <main className="flex-grow flex flex-col items-center justify-center bg-[#faf9f6] space-y-8">
        <h1 className="font-RoxboroughCFBold text-[clamp(2rem,8vw,7rem)] text-center text-[#1c2c3c]">
          SUA NOVA JOIA
        </h1>
      </main>

      <Categorias />
      <ThreeImagesSection />
      <WhatsApp />
      <Cookies />
      <PreFooter />
      <Footer />
    </div>
  );
}
