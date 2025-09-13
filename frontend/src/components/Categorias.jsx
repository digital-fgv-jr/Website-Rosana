import { useNavigate } from "react-router-dom";

export default function Categorias() {
  const categorias = [
    { nome: "Anel", img: "/anel1.jpg" },
    { nome: "Brinco", img: "/brinco1.jpg" },
    { nome: "Colar", img: "/colar1.jpg" },
    { nome: "Filigrana", img: "/filigrana1.jpg" },
    { nome: "Pingente", img: "/pingente1.jpg" },
  ];

  // CategoriaItem agora é um componente funcional independente
  const CategoriaItem = ({ cat }) => {
    const navigate = useNavigate(); // <- aqui dentro funciona

    return (
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate(`/joias?categoria=${cat.nome.toLowerCase()}`)}
      >
        <div className="w-full max-w-[250px] xl:max-w-[380px] aspect-square bg-[#faf9f6] overflow-hidden hover:scale-105 transition-transform">
          <img
            src={cat.img}
            alt={cat.nome}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-2 font-BodoniMT text-[#1c2c3c] text-[clamp(2rem,2.5vw,3rem)]">
          {cat.nome}
        </p>
      </div>
    );
  };

  return (
    <section className="w-full px-6 py-8 bg-[#faf9f6]">
      <div className="mb-0 md:mb-8 lg:mb-10 w-[90%] max-w-screen-3xl mx-auto text-center">
        {/* Mobile: 1 coluna */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {categorias.map((cat) => (
            <CategoriaItem key={cat.nome} cat={cat} />
          ))}
        </div>

        {/* Tablet: 3 + 2 centralizados */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {categorias.slice(0, 3).map((cat) => (
              <CategoriaItem key={cat.nome} cat={cat} />
            ))}
          </div>
          <div className="grid grid-cols-2 justify-center">
            {categorias.slice(3).map((cat) => (
              <CategoriaItem key={cat.nome} cat={cat} />
            ))}
          </div>
        </div>

        {/* Desktop: 5 colunas */}
        <div className="hidden lg:grid grid-cols-5 gap-4">
          {categorias.map((cat) => (
            <CategoriaItem key={cat.nome} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
