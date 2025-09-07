// components/Categorias.jsx
export default function Categorias() {
  const categorias = [
    { nome: "Anéis", img: "/anel1.jpg" },
    { nome: "Brincos", img: "/brinco1.jpg" },
    { nome: "Colares", img: "/colar1.jpg" },
    { nome: "Filigrana", img: "/filigrana1.jpg" },
    { nome: "Pingentes", img: "/pingente1.jpg" },
  ];

  return (
    <section className="mt-16 mb-16 bg-[#faf9f6]">
      <div className="max-w-[90%] mx-auto text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {categorias.map((cat, index) => (
            <div key={index} className="flex flex-col items-center">
              <a href={`/categoria/${cat.nome.toLowerCase()}`}>
                <div className="w-full aspect-square bg-[#faf9f6] overflow-hidden hover:scale-105 transition">
                  <img
                    src={cat.img}
                    alt={cat.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
              <p className="mt-2 font-MontserratRegular text-[#1c2c3c]">{cat.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
