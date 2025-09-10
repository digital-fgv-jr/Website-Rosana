import { useNavigate } from "react-router-dom";
import irParaCarrinho from "../pages/produto"

export default function MiniCarrinho({ carrinho, fechar}) {
  
  const navigate = useNavigate();

  if (!carrinho.length) return null;

  const total = carrinho.reduce(
    (acc, item) => acc + item.preco_num * item.quantidade,
    0
  );

  return (
    <div className="fixed top-20 right-5 w-80 bg-white shadow-xl rounded p-4 z-50">
      <h2 className="font-bold text-lg mb-2">Carrinho</h2>

      <ul>
        {carrinho.map((item, idx) => (
          <li key={idx} className="flex justify-between mb-2">
            <span>{item.nome}</span>
            <span>{item.quantidade}x</span>
          </li>
        ))}
      </ul>

      <p className="mt-2 font-bold">Total: R$ {total.toFixed(2)}</p>

      <button
        onClick={fechar}
        className="mt-4 px-4 py-2 bg-[#1c2c3c] text-white rounded w-full"
      >
        Fechar
      </button>

      {/* NOVO BOTÃO */}
        <button
          onClick={irParaCarrinho}  // usa a prop passada
          className="mt-2 px-4 py-2 bg-[#1c2c3c] text-white rounded w-full hover:bg-[#25384d]"
        >
          Ir para o carrinho
        </button>
    </div>
  );
}