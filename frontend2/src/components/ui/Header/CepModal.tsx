import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";
import { consultarCep } from "../../../services/CepService";
import { EnderecoViaCepResult } from "../../../services/interfaces/enderecoCepInterfaces";

interface CepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEndereco: (endereco: EnderecoViaCepResult) => void;
}

export default function CepModal({ isOpen, onClose, onSaveEndereco }: CepModalProps) {
  const [cepInput, setCepInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleConsultarCep = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: resultado } = await consultarCep(cepInput);
      if (resultado.error) {
        setError(resultado.message);
      } else {
        onSaveEndereco(resultado);
        onClose();
      }
    } catch (err) {
      setError("Não foi possível consultar o CEP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 8) {
      setCepInput(value.replace(/(\d{5})(\d)/, "$1-$2"));
    }
  };
  
  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 grid place-items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-brancoPerola rounded-lg border border-petroleo/20 shadow-xl"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-petroleo/10">
          <h3 className="font-BodoniMT text-lg">Informe seu CEP</h3>
          <button onClick={onClose} aria-label="Fechar" className="text-petroleo hover:opacity-75">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2">
          <label htmlFor="cep-input" className="text-sm font-semibold">
            CEP
          </label>
          <input
            id="cep-input"
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            value={cepInput}
            onChange={handleInputChange}
            className="w-full h-10 border border-petroleo/30 rounded-md px-3 font-MontserratRegular text-base focus:border-petroleo focus:ring-1 focus:ring-petroleo"
          />
          <p className="text-xs text-petroleo/70">Digite apenas os números.</p>
          {error && <p className="text-sm text-red-700 mt-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-petroleo/10">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-md border border-petroleo font-bold text-sm hover:bg-petroleo/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConsultarCep}
            disabled={loading}
            className="h-9 px-4 rounded-md bg-petroleo text-white font-bold text-sm hover:bg-petroleo/90 transition-colors flex items-center gap-2 disabled:bg-petroleo/50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Usar CEP
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}