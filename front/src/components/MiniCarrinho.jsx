import { useNavigate } from "react-router-dom";

export default function MiniCarrinho({ carrinho, fechar, irParaCarrinho }) {
  const navigate = useNavigate();

  if (!carrinho?.length) return null;

  const itensValidos = carrinho.filter((i) => (i?.quantidade ?? 0) > 0);

  const total = itensValidos.reduce(
    (acc, item) => acc + Number(item.preco_num || item.preco || 0) * Number(item.quantidade || 1),
    0
  );

  const formatBRL = (n) =>
    Number(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function finalizarCompra() {
    // Normaliza para o checkout (Wallet/Preference)
    const items = itensValidos.map((i) => ({
      id: i.id || i.sku || i.slug, // opcional
      title: i.nome,
      unit_price: Number(i.preco_num || i.preco || 0),
      quantity: Number(i.quantidade || 1),
      picture_url: i.imagem || i.foto || i.picture_url || "",
    }));

    localStorage.setItem("cart", JSON.stringify(items));
    if (typeof fechar === "function") fechar();
    navigate("/checkout");
  }

  return (
    <div
      className="fixed top-20 right-5 w-80 bg-white shadow-xl rounded-lg p-4 z-[70] border border-[#c2b280]/30"
      role="dialog"
      aria-label="Mini carrinho"
    >
      <h2 className="font-BodoniMT text-[#1c2c3c] text-xl mb-2">Carrinho</h2>

      <ul className="divide-y divide-gray-200">
        {itensValidos.map((item, idx) => (
          <li key={idx} className="flex justify-between py-2">
            <span className="font-MontserratRegular text-[#1c2c3c]">{item.nome}</span>
            <span className="font-MontserratRegular text-gray-700">{item.quantidade}x</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 font-MontserratRegular font-semibold text-[#1c2c3c]">
        Total: R$ {formatBRL(total)}
      </p>

      <button
        onClick={fechar}
        className="mt-4 px-4 py-2 bg-[#1c2c3c] text-white rounded w-full font-MontserratRegular hover:bg-[#25384d] transition"
      >
        Fechar
      </button>

      <button
        onClick={irParaCarrinho}
        className="mt-2 px-4 py-2 bg-[#1c2c3c] text-white rounded w-full font-MontserratRegular hover:bg-[#25384d] transition"
      >
        Ir para o carrinho
      </button>

      <button
        onClick={finalizarCompra}
        className="mt-2 px-4 py-2 bg-[#1c2c3c] text-white rounded w-full font-MontserratRegular hover:bg-[#25384d] transition"
      >
        Finalizar compra
      </button>
    </div>
  );
}
