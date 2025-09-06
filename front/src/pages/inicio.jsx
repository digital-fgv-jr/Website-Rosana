import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";
import Categorias from "../components/Categorias";
import ThreeImagesSection from "../components/BlocoImagens";
import DropdownSection from "../components/DropdownSection";

export default function Inicio() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />         
      <HeroCarousel />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">
          SUA NOVA JOIA
        </h1>
      </main>

      <Categorias />
      
      <ThreeImagesSection />

      < DropdownSection />
      
      <Footer />
    </div>
  );
}