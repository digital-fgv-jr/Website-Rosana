// src/ScrollToHash.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    // espera o conteúdo montar
    const id = hash.replace('#','');
    const el = document.getElementById(id) || document.querySelector(hash);
    if (!el) return;
    // timeout pequeno para não "brigar" com ScrollToTop
    setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }, [hash]);

  return null;
}
