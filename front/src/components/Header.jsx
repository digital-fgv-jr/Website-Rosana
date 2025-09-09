// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-[#faf9f6] text-base sm:text-lg md:text-xl lg:text-2xl">
      {/* Logo e botões */}
      <div className="flex justify-between w-full max-w-7xl mx-auto px-6 py-2">
        
        <button className="text-[#1c2c3c] hover:text-[#c2b280] text-2xl">
          🔍
        </button>

        <Link to="/">
          <img 
            src="/logo1.png" 
            alt="RoAlves Joalheria" 
            className="h-24 w-auto" 
          />
        </Link>
      
        <button className="text-[#1c2c3c] hover:text-[#c2b280] text-2xl">
          🛒
        </button>

      </div>

      {/* Menu */}
      <nav className="flex justify-between w-full max-w-7xl mx-auto px-6 py-2">
        <Link
          to="/joias"
          className="text-[#1c2c3c] font-RoxboroughCFRegular hover:text-[#c2b280] text-[120%] cursor-pointer"
        >
          Joias
        </Link>
        <Link
          to="/criadas-para-voce"
          className="text-[#1c2c3c] font-RoxboroughCFRegular hover:text-[#c2b280] text-[120%] cursor-pointer"
        >
          Criadas para você
        </Link>
        <Link
          to="/eventos"
          className="text-[#1c2c3c] font-RoxboroughCFRegular hover:text-[#c2b280] text-[120%] cursor-pointer"
        >
          Eventos
        </Link>
        <Link
          to="/sobre-nos"
          className="text-[#1c2c3c] font-RoxboroughCFRegular hover:text-[#c2b280] text-[120%] cursor-pointer"
        >
          Sobre nós
        </Link>
      </nav>
    </header>
  );
}

