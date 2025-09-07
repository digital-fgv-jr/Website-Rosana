import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";
import Categorias from "../components/Categorias";
import ThreeImagesSection from "../components/BlocoImagens";
import DropdownSection from "../components/DropdownSection";

export default function Inicio() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header />         
      <HeroCarousel />
      <main className="flex-grow flex items-center justify-center bg-[#faf9f6]">
        <h1 className="font-RoxboroughCFBold text-8xl text-[#1c2c3c]">
          SUA NOVA JOIA
        </h1>
      </main>

      <Categorias />

      <ThreeImagesSection />

      <DropdownSection />
      
      <Footer />
    </div>
  );
}