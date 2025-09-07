export default function DropdownSection() {
  const dropdowns = [
    { title: "Categoria 1", items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"] },
    { title: "Categoria 2", items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"] },
    { title: "Categoria 3", items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"] },
  ];

  return (
    <section className="my-16 max-w-[90%] mx-auto flex justify-between items-start bg-[#faf9f6]">
      {/* Blocos de categorias */}
      <div className="flex gap-36">
        {dropdowns.map((dd, idx) => (
          <div key={idx}>
            <h3 className="font-semibold mb-3 text-[#1c2c3c]">{dd.title}</h3>
            <ul className="space-y-2">
              {dd.items.map((item, idx) => (
                <li key={idx} className="text-[#1c2c3c] hover:text-[#c2b280] cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Botões de Instagram e WhatsApp */}
      <div className="flex flex-col gap-4 ml-8">
        <button className="px-5 py-3 bg-pink-500 text-[#faf9f6] rounded hover:bg-pink-600 transition">
          Instagram
        </button>
        <button className="px-5 py-3 bg-green-500 text-[#faf9f6] rounded hover:bg-green-600 transition">
          WhatsApp
        </button>
      </div>
    </section>
  );
}

