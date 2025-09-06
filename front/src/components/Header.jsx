// src/components/Header/Header.jsx
import "../index.css";
import { MapPin, Search, Instagram } from "lucide-react";
// se este arquivo está em src/components/Header/ e o logo em src/assets/:
import logo from "../assets/logo-clara.svg";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#faf9f6] text-[#1c2c3c]">
      <div className="mx-auto max-w-6xl px-4">
        {/* Barra superior: CEP (esq) | LOGO central absoluta | Ações (dir) */}
        <div className="relative flex items-center justify-between py-28 md:py-36">
          <button
            className="inline-flex items-center gap-2 text-sm bg-[#faf9f6] border-0 shadow-none ml-2 hover:opacity-80 transition font-montserrat"
            aria-label="Informar meu CEP"
          >
            <MapPin className="h-4 w-4" />
            Informar meu CEP
          </button>

          <a
            href="/"
            className="absolute left-1/2 -translate-x-1/2 top-50"
            aria-label="Página inicial"
          >
            <img
              src={logo}
              alt="Ro Jewellery"
              className="h-[64px] w-auto object-contain"
            />
          </a>


          <div className="flex flex-col items-end gap-2">
            <button
              className="inline-flex items-center gap-2 text-sm bg-[#faf9f6] border-0 shadow-none mr-2 hover:opacity-80 transition font-montserrat"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
              Buscar
            </button>

            <a
              href="https://instagram.com/roalves_jewellery"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition no-underline font-montserrat"
              aria-label="Instagram roalves_jewellery"
            >
              <span className="inline-flex items-center justify-center rounded-full border border-[#1c2c3c]/20 p-1">
                <Instagram className="h-4 w-4" />
              </span>
              <span className="no-underline font-montserrat font-bold">roalves_jewellery</span>
            </a>

          </div>
        </div>

        {/* Navegação (largura total, sem quebra e com espaçamento exagerado) */}
        <nav className="w-full grid grid-cols-4 place-items-center py-10 font-brand whitespace-nowrap">
  <a href="/joias" className="text-xl md:text-2xl lg:text-3xl text-[#1c2c3c] no-underline hover:opacity-80">Joias</a>
  <a href="/criadas-para-voce" className="text-xl md:text-2xl lg:text-3xl text-[#1c2c3c] no-underline hover:opacity-80">Criadas para Você</a>
  <a href="/eventos" className="text-xl md:text-2xl lg:text-3xl text-[#1c2c3c] no-underline hover:opacity-80">Eventos</a>
  <a href="/sobre-nos" className="text-xl md:text-2xl lg:text-3xl text-[#1c2c3c] no-underline hover:opacity-80">Sobre Nós</a>
</nav>

      </div>
    </header>
  );
}
