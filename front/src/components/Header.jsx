// src/components/Header.jsx
import { Link } from "react-router-dom";
import { MapPin, Search, Instagram, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-[#faf9f6]">
      {/* ===== Barra superior ===== */}
      <div className="relative w-full max-w-7xl mx-auto px-6 py-2 grid grid-cols-3 items-center">
          {/* Botão esquerdo */}
          <button className="flex items-center gap-1 justify-start text-[#1c2c3c] hover:text-[#c2b280] text- md:text-xl">
            <MapPin className="h-5 w-5" />
            Informar meu CEP
          </button>

          {/* Logo central */}
          <div className="flex justify-center">
            <Link to="/">
              <img 
                src="/logo1.png" 
                alt="RoAlves Joalheria" 
                className="h-24 w-auto" 
              />
            </Link>
          </div>

          {/* Botões direito */}
          <div className="flex justify-end items-center gap-4">
            <button className="text-[#1c2c3c] hover:text-[#c2b280] text-2xl">
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/carrinho"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#1c2c3c] text-[#1c2c3c] hover:text-[#c2b280] hover:bg-gray-200 transition"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </div>
        </div>

      {/* ===== Menu com Instagram ===== */}
      <nav className="flex justify-around items-center w-full max-w-7xl mx-auto px-6 py-3">
        <Link to="/joias" className="text-[#1c2c3c] font-RoxboroughCFRegular hover:text-[#c2b280] text-[150%]">
          Joias
        </Link>
        <Link to="/criadas-para-voce" className="text-[#1c2c3c] font-RoxboroughCFRegular hover:text-[#c2b280] text-[150%]">
          Criadas para você
        </Link>
        <Link to="/eventos" className="text-[#1c2c3c] font-RoxboroughCFRegular hover:text-[#c2b280] text-[150%]">
          Eventos
        </Link>
        <Link to="/sobre-nos" className="text-[#1c2c3c] font-RoxboroughCFRegular hover:text-[#c2b280] text-[150%]">
          Sobre nós
        </Link>
        <a
          href="https://instagram.com/roalves_jewellery"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[#1c2c3c] hover:text-[#c2b280] text-[120%]"
        >
          <Instagram className="h-5 w-5" />
          roalves_jewellery
        </a>
      </nav>
    </header>
  );
}
