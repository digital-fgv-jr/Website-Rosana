// src/pages/checkout.jsx
import { useEffect, useMemo, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

function getCartFromLocalStorage() {
  try {
    const raw = localStorage.getItem("cart") || "[]";
    const items = JSON.parse(raw);
    // Esperado: [{ id, title, unit_price, quantity, picture_url }]
    if (Array.isArray(items) && items.length) return items;
  } catch (_) {}
  // Fallback para teste manual
  return [{ title: "Pedido Rosana Joias", unit_price: 100, quantity: 1 }];
}

export default function Checkout() {
  const [preferenceId, setPreferenceId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const publicKey = useMemo(
    () => import.meta.env.VITE_MP_PUBLIC_KEY,
    []
  );

  useEffect(() => {
    if (!publicKey) {
      setError("Chave pública do Mercado Pago ausente (VITE_MP_PUBLIC_KEY).");
      setLoading(false);
      return;
    }
    initMercadoPago(publicKey, { locale: "pt-BR" });
  }, [publicKey]);

  useEffect(() => {
    async function bootstrap() {
      try {
        const items = getCartFromLocalStorage();

        // Ajuste o endpoint conforme teu backend
        const res = await fetch("/api/mp/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items, // envia o carrinho; backend cria a preference
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Falha ao criar preferência.");
        }

        const data = await res.json(); // { id: "PREF-ID" }
        if (!data?.id) throw new Error("Resposta sem preference id.");
        setPreferenceId(data.id);
      } catch (e) {
        setError(e.message || "Erro inesperado ao criar preferência.");
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  return (
    <div className="bg-[#faf9f6] text-[#1c2c3c] min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-RoxboroughCFBold mb-2">Checkout</h1>
        <p className="text-sm text-gray-600 mb-6">
          Revise seus dados e finalize o pagamento com segurança.
        </p>

        {loading && <p>Preparando seu pagamento…</p>}
        {!!error && (
          <div className="border border-red-300 bg-red-50 text-red-700 p-3 rounded-md">
            {error}
          </div>
        )}

        {preferenceId && (
          <div className="rounded-2xl border border-[#1c2c3c]/10 p-4">
            {/* Wallet = Checkout Pro */}
            <Wallet
              initialization={{ preferenceId, redirectMode: "self" }}
              customization={{ texts: { valueProp: "smart_option" } }}
            />
            <p className="mt-3 text-xs text-gray-500">
              Você será redirecionado para confirmar o pagamento. Ao finalizar,
              voltará para a página de status do pedido.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
