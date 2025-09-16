// components/MaterialMultiSelect.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Search as IconSearch, X } from "lucide-react";

export default function MaterialMultiSelect({
  options = [],      // lista de materiais (strings)
  value = [],        // materiais selecionados
  onChange,          // (newValue: string[]) => void
  label = "Materiais",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const uniqueOptions = useMemo(() => {
    const s = new Set(options.filter(Boolean).map((o) => o.trim()));
    return Array.from(s).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [options]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return uniqueOptions;
    return uniqueOptions.filter((o) => o.toLowerCase().includes(term));
  }, [q, uniqueOptions]);

  const toggle = (item) => {
    const exists = value.includes(item);
    const next = exists ? value.filter((v) => v !== item) : [...value, item];
    onChange?.(next);
  };

  const clearSelection = () => onChange?.([]);
  const selectAllVisible = () => onChange?.(Array.from(new Set([...value, ...filtered])));

  const summary =
    value.length === 0
      ? label
      : `${label} (${value.length} selecionado${value.length > 1 ? "s" : ""})`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-[#c2b280] text-[#1c2c3c] font-MontserratRegular hover:bg-[#faf9f6]"
      >
        <span>{summary}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 sm:w-80 bg-white shadow-xl border border-neutral-200 rounded-lg p-3">
          <div className="relative mb-3">
            <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1c2c3c]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar material (ex.: ouro, pérola, prata)"
              className="w-full border rounded-md pl-8 pr-8 py-2 outline-none focus:ring-2 focus:ring-[#c2b280]"
            />
            {q && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded"
                onClick={() => setQ("")}
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-end mb-2 gap-2">
            <button
              onClick={selectAllVisible}
              className="text-xs px-2 py-1 rounded border border-[#c2b280] hover:bg-[#faf9f6]"
            >
              Selecionar visíveis
            </button>
            <button
              onClick={clearSelection}
              className="text-xs px-2 py-1 rounded border border-neutral-300 hover:bg-neutral-50"
            >
              Limpar seleção
            </button>
          </div>

          <div className="max-h-64 overflow-auto rounded border border-neutral-200">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-neutral-500 font-MontserratRegular">
                Nenhum material encontrado.
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {filtered.map((item) => {
                  const selected = value.includes(item);
                  return (
                    <li
                      key={item}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#faf9f6]"
                      onClick={() => toggle(item)}
                    >
                      <span
                        className={`grid place-items-center w-4 h-4 rounded border ${
                          selected ? "bg-[#1c2c3c] border-[#1c2c3c]" : "border-neutral-400"
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span className="text-sm text-[#1c2c3c] font-MontserratRegular">
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded bg-[#1c2c3c] text-white text-sm font-MontserratRegular hover:bg-[#25384d]"
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
