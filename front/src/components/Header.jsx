export default function Header() {
  return (
    <header className="w-full h-16 flex items-center justify-between px-6 bg-[#1c2c3c] text-white">
      <div className="font-bold text-lg">Logo</div>
      <nav className="flex gap-6">
        <a href="#joias" className="hover:text-gray-300">Joias</a>
        <a href="#encomendas" className="hover:text-gray-300">Encomendas</a>
        <a href="#sobre" className="hover:text-gray-300">Sobre a Loja</a>
        <a href="#eventos" className="hover:text-gray-300">Eventos</a>
      </nav>
    </header>
  );
}
