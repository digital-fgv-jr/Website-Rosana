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
    <section className="mt-16 mb-16">
      <div className="max-w-[90%] mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8">Nossas Categorias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {categorias.map((cat, index) => (
            <div key={index} className="flex flex-col items-center">
              <a href={`/categoria/${cat.nome.toLowerCase()}`}>
                <div className="w-full aspect-square bg-gray-300 overflow-hidden hover:scale-105 transition">
                  <img
                    src={cat.img}
                    alt={cat.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
              <p className="mt-2 font-medium text-gray-700">{cat.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
