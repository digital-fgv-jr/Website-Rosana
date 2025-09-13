// components/FiltroProdutos.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import MaterialMultiSelect from "./MaterialMultiSelect";

export default function FiltroProdutos({
  open,
  onClose,
  onApply,
  onResetAll,
  materiaisDisponiveis = [],
  initial = {},
}) {
  const [materiaisSel, setMateriaisSel] = useState(initial.materiaisSel || []);
  const [precoMin, setPrecoMin] = useState(initial.precoMin ?? "");
  const [precoMax, setPrecoMax] = useState(initial.precoMax ?? "");
  const [pesoMin, setPesoMin]   = useState(initial.pesoMin ?? "");
  const [pesoMax, setPesoMax]   = useState(initial.pesoMax ?? "");

  useEffect(() => {
    if (open) {
      setMateriaisSel(initial.materiaisSel || []);
      setPrecoMin(initial.precoMin ?? "");
      setPrecoMax(initial.precoMax ?? "");
      setPesoMin(initial.pesoMin ?? "");
      setPesoMax(initial.pesoMax ?? "");
    }
  }, [open]);

  // impede negativos
  const clampNonNegative = (setter) => (e) => {
    const v = e.target.value;
    if (v === "") return setter("");
    const n = Number(v);
    setter(n < 0 ? "0" : v);
  };

  // validação min<=max
  const rangeErr = (min, max) =>
    min !== "" && max !== "" && Number(min) > Number(max);

  const precoRangeError = rangeErr(precoMin, precoMax);
  const pesoRangeError  = rangeErr(pesoMin,  pesoMax);
  const hasAnyError = precoRangeError || pesoRangeError;

  const aplicar = () => {
    if (hasAnyError) return;
    onApply?.({ materiaisSel, precoMin, precoMax, pesoMin, pesoMax });
    onClose?.();
  };

  const limpar = () => {
    setMateriaisSel([]);
    setPrecoMin(""); setPrecoMax("");
    setPesoMin(""); setPesoMax("");

    onApply?.({ materiaisSel: [], precoMin: "", precoMax: "", pesoMin: "", pesoMax: "" });
    onResetAll?.(); // volta para "Ver tudo" no pai
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-BodoniMT text-2xl text-[#1c2c3c]">Filtros</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-[#faf9f6]" aria-label="Fechar filtros">
            <X className="w-5 h-5 text-[#1c2c3c]" />
          </button>
        </div>

        {/* MATERIAIS (dropdown multi-select dinâmico) */}
        <div className="mb-6">
          <MaterialMultiSelect
            options={materiaisDisponiveis}
            value={materiaisSel}
            onChange={setMateriaisSel}
          />
        </div>

        {/* PREÇO */}
        <div className="mb-6">
          <span className="block text-sm text-[#1c2c3c] mb-2 font-MontserratRegular">Preço (R$)</span>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Min"
              value={precoMin}
              onChange={clampNonNegative(setPrecoMin)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#c2b280]"
            />
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Max"
              value={precoMax}
              onChange={clampNonNegative(setPrecoMax)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#c2b280]"
            />
          </div>
          {precoRangeError && (
            <p className="text-xs text-red-600 mt-1 font-MontserratRegular">
              O preço mínimo não pode ser maior que o preço máximo.
            </p>
          )}
        </div>

        {/* PESO */}
        <div className="mb-8">
          <span className="block text-sm text-[#1c2c3c] mb-2 font-MontserratRegular">Peso (g)</span>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Min"
              value={pesoMin}
              onChange={clampNonNegative(setPesoMin)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#c2b280]"
            />
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Max"
              value={pesoMax}
              onChange={clampNonNegative(setPesoMax)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#c2b280]"
            />
          </div>
          {pesoRangeError && (
            <p className="text-xs text-red-600 mt-1 font-MontserratRegular">
              O peso mínimo não pode ser maior que o peso máximo.
            </p>
          )}
        </div>

        {/* AÇÕES */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={limpar}
            className="px-4 py-2 rounded-lg border border-[#c2b280] text-[#1c2c3c] font-MontserratRegular hover:bg-[#faf9f6]"
          >
            Limpar
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-[#1c2c3c] font-MontserratRegular hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={aplicar}
              disabled={hasAnyError}
              className={`px-4 py-2 rounded-lg font-MontserratRegular ${
                hasAnyError
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#1c2c3c] text-white hover:bg-[#25384d]"
              }`}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
