// src/pages/pagamentoStatus.jsx
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search]);
}

function statusToUI(status) {
  switch (status) {
    case "approved":
      return {
        title: "Pagamento aprovado 🎉",
        desc: "Recebemos seu pagamento. Enviaremos a confirmação por e-mail/WhatsApp.",
        tone: "border-green-300 bg-green-50 text-green-800",
      };
    case "pending":
      return {
        title: "Pagamento pendente ⏳",
        desc: "Seu pagamento está em análise ou aguardando confirmação do banco.",
        tone: "border-amber-300 bg-amber-50 text-amber-800",
      };
    default:
      return {
        title: "Pagamento não aprovado",
        desc: "Não conseguimos aprovar seu pagamento. Tente novamente ou use outro método.",
        tone: "border-red-300 bg-red-50 text-red-800",
      };
  }
}

export default function PagamentoStatus() {
  const q = useQuery();
  const ui = statusToUI(q.status);

  return (
    <div className="bg-[#faf9f6] text-[#1c2c3c] min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-RoxboroughCFBold mb-2">Status do Pagamento</h1>
        <div className={`rounded-xl border p-4 ${ui.tone}`}>
          <h2 className="text-xl font-semibold mb-1">{ui.title}</h2>
          <p className="text-sm">{ui.desc}</p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
            {q.payment_id && (
              <>
                <dt className="font-medium text-[#1c2c3c]">Payment ID</dt>
                <dd className="text-[#1c2c3c]/80">{q.payment_id}</dd>
              </>
            )}
            {q.preference_id && (
              <>
                <dt className="font-medium text-[#1c2c3c]">Preference ID</dt>
                <dd className="text-[#1c2c3c]/80">{q.preference_id}</dd>
              </>
            )}
            {q.merchant_order_id && (
              <>
                <dt className="font-medium text-[#1c2c3c]">Merchant Order</dt>
                <dd className="text-[#1c2c3c]/80">{q.merchant_order_id}</dd>
              </>
            )}
            {q.collection_id && (
              <>
                <dt className="font-medium text-[#1c2c3c]">Collection ID</dt>
                <dd className="text-[#1c2c3c]/80">{q.collection_id}</dd>
              </>
            )}
            {q.status && (
              <>
                <dt className="font-medium text-[#1c2c3c]">Status</dt>
                <dd className="capitalize text-[#1c2c3c]/80">{q.status}</dd>
              </>
            )}
          </dl>

          <div className="mt-6 flex gap-3">
            <Link
              to="/joias"
              className="px-4 py-2 rounded-2xl bg-[#1c2c3c] text-[#faf9f6] hover:opacity-90"
            >
              Continuar comprando
            </Link>
            <Link
              to="/contato"
              className="px-4 py-2 rounded-2xl border border-[#1c2c3c]/20 hover:bg-white"
            >
              Precisa de ajuda?
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Dica: o backend deve processar o <i>webhook</i> (notification_url) para
          confirmar o pedido no banco, independentemente desta página.
        </p>
      </div>
    </div>
  );
}
