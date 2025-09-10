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
    <div className="min-h-screen flex flex-col space-y-8 bg-[#faf9f6]">
      <Header/>     

      {/* SENTINELA: é ele que dispara a aparição do header compacto */}
      <div id="header-sentinel" style={{ position: 'absolute', top: 0, height: 0, margin: 0, padding: 0 }} />

      <HeaderCompact />

      <HeroCarousel />
      <main className="flex-grow flex items-center justify-center bg-[#faf9f6]">
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