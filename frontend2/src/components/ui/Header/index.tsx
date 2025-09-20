import { useState, useEffect, useCallback, KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Search, ShoppingCart } from "lucide-react";
import { SiInstagram } from '@icons-pack/react-simple-icons';

import CepModal from "./CepModal";
import { useApi } from "../../../hooks/UseApi";
import { getCategorias } from "../../../services/CategoriaService";
import { Categoria, Endereco } from "../../../services/interfaces/apiInterfaces";
import { EnderecoViaCepResult } from "../../../services/interfaces/enderecoCepInterfaces";

const LS_CEP_KEY = "roalves_endereco_cep";

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isCepModalOpen, setIsCepModalOpen] = useState(false);
  const [endereco, setEndereco] = useState<Endereco | null>(null);

  const [isCompact, setIsCompact] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const navigate = useNavigate();
  const { data: categorias } = useApi<Categoria[]>(getCategorias);

  // Lógica de Scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Aparece o header compacto se rolar para baixo e estiver longe do topo
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsCompact(true);
      } 
      // Mostra o header completo se rolar para cima
      else if (currentScrollY < lastScrollY) {
        setIsCompact(false);
      }
      
      // Esconde o header completo se estiver muito pra baixo
      setIsHeaderVisible(currentScrollY < 150);

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  // Lógica de CEP e Busca
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_CEP_KEY);
      if (saved) setEndereco(JSON.parse(saved));
    } catch (e) { console.error("Falha ao ler endereço", e); }
  }, []);

  const handleSaveEndereco = (enderecoDaApi: EnderecoViaCepResult) => {
    const novoEndereco: Endereco = { ...enderecoDaApi, numero: "", complemento: null };
    setEndereco(novoEndereco);
    try {
      localStorage.setItem(LS_CEP_KEY, JSON.stringify(novoEndereco));
    } catch (e) { console.error("Falha ao salvar endereço", e); }
  };
  
  const handleSearch = useCallback(() => {
    const term = query.trim();
    if (!term) return;
    const normalizedTerm = normalize(term);
    const categoriaEncontrada = categorias?.find(c => normalize(c.nome_categoria) === normalizedTerm);
    const searchParams = new URLSearchParams({ q: term });
    if (categoriaEncontrada) searchParams.set('categoriaId', categoriaEncontrada.id);
    navigate(`/joias?${searchParams.toString()}`);
    setQuery("");
    setIsSearchOpen(false);
  }, [query, categorias, navigate]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleSearch(); }
  };
  
  const navLinks = [
    { href: "/joias", label: "Joias" },
    { href: "/para-voce", label: "Para Você" },
    { href: "/eventos", label: "Eventos" },
    { href: "/sobre-nos", label: "Sobre Nós" },
  ];

  return (
    <>
      {/* Sentinela para o Header principal sumir */}
      <div id="header-sentinel" className="h-1" />

      {/* === HEADER COMPLETO (Padrão) === */}
      <header className={`bg-brancoPerola text-petroleo relative transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4">
          {/* Barra Superior */}
          <div className="h-16 flex items-center justify-between lg:h-20 lg:relative">
            {/* Esquerda (CEP) */}
            <div className="flex-1 min-w-0">
              <button onClick={() => setIsCepModalOpen(true)} className="hidden sm:inline-flex items-center gap-2 text-sm underline hover:opacity-80 transition-opacity">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{endereco ? `Entregar em: ${endereco.cidade} - ${endereco.uf}` : "Informar meu CEP"}</span>
              </button>
            </div>
            
            {/* Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-[15%]">
               <Link to="/" aria-label="Página inicial">
                 <img src="/logo-petroleo.svg" alt="RoAlves Jewellery" className="h-14 lg:h-20 object-contain" />
               </Link>
            </div>

            {/* Direita (Busca e Carrinho) */}
            <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
              <button onClick={() => setIsSearchOpen(true)} className="hidden sm:inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                  <Search className="h-4 w-4" /> Buscar
              </button>
               <Link to="/carrinho" aria-label="Abrir carrinho" className="grid place-items-center w-8 h-8 border border-petroleo rounded-full hover:bg-petroleo hover:text-white transition-colors">
                <ShoppingCart size={18} />
               </Link>
            </div>
          </div>
        </div>
        
        {/* Barra de Navegação */}
        <nav className="border-t border-b border-petroleo/20">
            <div className="container mx-auto flex items-center justify-center gap-x-8 sm:gap-x-12 lg:gap-x-16 py-3 overflow-x-auto no-scrollbar">
                {navLinks.map(link => (
                    <Link key={link.href} to={link.href} className="font-BodoniMT text-lg whitespace-nowrap hover:opacity-75 transition-opacity">
                        {link.label}
                    </Link>
                ))}
                <a href="https://instagram.com/roalves_jewellery" target="_blank" rel="noreferrer" className="flex items-center gap-2 whitespace-nowrap hover:opacity-75 transition-opacity">
                    <span className="grid place-items-center w-7 h-7 bg-black text-white rounded-full"><SiInstagram size={16} /></span>
                    <span className="font-MontserratRegular font-bold text-sm hidden sm:inline">roalves</span>
                </a>
            </div>
        </nav>
      </header>
      
      {/* === HEADER COMPACTO (Aparece com o scroll) === */}
      <div 
        className={`fixed top-0 left-0 right-0 bg-brancoPerola/95 backdrop-blur-sm z-50 shadow-md transition-all duration-300 ${isCompact ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 h-16">
            {/* Logo */}
            <Link to="/" aria-label="Página inicial">
              <img src="/logo-petroleo.svg" alt="RoAlves Jewellery" className="h-10 object-contain" />
            </Link>

            {/* Busca */}
            <div className="relative w-full max-w-sm mx-auto">
              <input
                type="search"
                placeholder="Buscar por anel, colar, prata..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full h-9 pl-4 pr-10 rounded-full bg-champanheClaro/80 border-none text-sm placeholder:text-petroleo/60 focus:ring-1 focus:ring-petroleo"
              />
              <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-petroleo">
                <Search size={16}/>
              </button>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <a href="https://instagram.com/roalves_jewellery" target="_blank" rel="noreferrer" className="grid place-items-center w-7 h-7 bg-black text-white rounded-full">
                <SiInstagram size={16} />
              </a>
              <Link to="/carrinho" aria-label="Abrir carrinho" className="grid place-items-center w-7 h-7 border border-petroleo rounded-full hover:bg-petroleo hover:text-white transition-colors">
                <ShoppingCart size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CepModal
        isOpen={isCepModalOpen}
        onClose={() => setIsCepModalOpen(false)}
        onSaveEndereco={handleSaveEndereco}
      />
    </>
  );
}