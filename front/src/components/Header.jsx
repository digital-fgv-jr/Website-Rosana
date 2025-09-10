// components/Header.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Instagram, ShoppingCart } from "lucide-react";
import { produtos } from "../data/produtos"; // detectar categorias
import styles from "./Header.module.css";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

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
    const term = query.trim();
    if (!term) return;

    const nterm = norm(term);
    if (categoriasSet.has(nterm)) {
      navigate(`/joias?categoria=${encodeURIComponent(nterm)}&q=${encodeURIComponent(term)}`);
    } else {
      navigate(`/joias?q=${encodeURIComponent(term)}`);
    }
    setQuery("");
    setSearchOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch();
    }
  };

  return (
    <header className={styles.root}>
      <div className={styles.wrap}>
        {/* ===== Barra superior ===== */}
        <div className={styles.topBar}>
          {/* botão CEP (lado esquerdo) */}
          <a className={styles.leftBtn}>
            <MapPin className="h-4 w-4" />
            Informar meu CEP
          </a>

          {/* logo central */}
          <a href="/" className={styles.logoLink} aria-label="Página inicial">
            <img src={"/logo-clara.svg"} alt="Ro Jewellery" className={styles.logo} />
          </a>

          {/* Buscar + Carrinho (lado direito) */}
          <div className={styles.rightCol}>
            {searchOpen ? (
              <input
                type="text"
                placeholder="Buscar joias..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
                autoFocus
                onBlur={() => setSearchOpen(false)}
                onKeyDown={onKeyDown}
              />
            ) : (
              <button
                className={styles.rightBtn}
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                Buscar
              </button>
            )}

            {/* Carrinho */}
            <a
              href="/carrinho"
              className={styles.iconBtn}
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className={styles.iconSvg} />
            </a>
          </div>
        </div>

        {/* ===== NAVBAR ===== */}
        <nav className={styles.nav}>
          <a href="/joias">Joias</a>
          <a href="/criadas-para-voce">Criadas para Você</a>
          <a href="/eventos">Eventos</a>
          <a href="/sobre-nos">Sobre Nós</a>
          <a
            href="https://instagram.com/roalves_jewellery"
            target="_blank"
            rel="noreferrer"
            className={styles.navInsta}
            aria-label="Instagram roalves_jewellery"
          >
            <span className={styles.navInstaIcon}>
              <Instagram className="h-4 w-4" />
            </span>
            <span className={styles.navInstaName}>roalves</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
