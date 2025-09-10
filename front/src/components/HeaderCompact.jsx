// components/HeaderCompact.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Instagram, ShoppingCart } from "lucide-react";
import { produtos } from "../data/produtos"; // usado só para detectar categorias
import s from "./HeaderCompact.module.css";

export default function HeaderCompact() {
  const [show, setShow] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sentinel = document.getElementById("header-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const norm = (str) =>
    (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const categoriasSet = useMemo(() => {
    const cs = new Set(
      produtos
        .map((p) => (typeof p?.categoria === "string" ? p.categoria : p?.categoria?.nome_categoria))
        .filter(Boolean)
        .map((c) => norm(c))
    );
    return cs;
  }, []);

  const goSearch = () => {
    const term = q.trim();
    if (!term) return;

    const nterm = norm(term);

    // Se usuário digitou exatamente o nome de uma categoria, mande pra categoria
    if (categoriasSet.has(nterm)) {
      navigate(`/joias?categoria=${encodeURIComponent(nterm)}&q=${encodeURIComponent(term)}`);
      setQ("");
      return;
    }

    // Caso geral: ir para a página de listagem com o termo.
    // A ordenação por relevância é feita na página /joias (snippet abaixo).
    navigate(`/joias?q=${encodeURIComponent(term)}`);
    setQ("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch();
    }
  };

  return (
    <div className={`${s.root} ${show ? s.show : s.hide}`} aria-hidden={!show} role="banner">
      <div className={s.wrap}>
        <div className={s.row1}>
          <a href="/" className={s.logoLink} aria-label="Página inicial">
            <img src={"/logo-clara.svg"} alt="Ro Jewellery" className={s.logo} />
          </a>

          <div className={s.searchBox}>
            <input
              type="search"
              placeholder="Encontre a sua joia (ex.: anel, pingente, prata, filigrana)"
              className={s.searchInput}
              aria-label="Buscar joias"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <Search
              className={s.searchIcon}
              aria-hidden
              onMouseDown={(e) => {
                e.preventDefault();
                goSearch();
              }}
            />
          </div>

          <div className={s.actions}>
            <a
              href="https://instagram.com/roalves_jewellery"
              target="_blank"
              rel="noreferrer"
              className={s.instaBtn}
              aria-label="Instagram roalves_jewellery"
            >
              <Instagram />
            </a>

            <a href="/carrinho" className={s.iconBtn} aria-label="Abrir carrinho">
              <ShoppingCart />
            </a>
          </div>
        </div>

        <nav className={s.nav} aria-label="Navegação principal">
          <a href="/joias">Joias</a>
          <a href="/criadas-para-voce">Criadas para Você</a>
          <a href="/eventos">Eventos</a>
          <a href="/sobre-nos">Sobre Nós</a>
        </nav>
      </div>
    </div>
  );
}
