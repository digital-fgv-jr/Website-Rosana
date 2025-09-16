// components/Header.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Instagram, ShoppingCart, X, Loader2 } from "lucide-react";
import { produtos } from "../data/produtos";
import { consultarCep } from "../api/services/cepService";
import styles from "./Header.module.css";

const LS_KEY = "cep_endereco";

function normalize(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function onlyDigits(v = "") {
  return String(v).replace(/\D/g, "");
}
function maskCEP(v = "") {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export default function Header() {
  // ===== Busca =====
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const categoriasSet = useMemo(() => {
    const cs = new Set(
      produtos
        .map((p) =>
          typeof p?.categoria === "string" ? p.categoria : p?.categoria?.nome_categoria
        )
        .filter(Boolean)
        .map((c) => normalize(c))
    );
    return cs;
  }, []);

  const goSearch = useCallback(() => {
    const term = query.trim();
    if (!term) return;
    const nterm = normalize(term);
    if (categoriasSet.has(nterm)) {
      navigate(`/joias?categoria=${encodeURIComponent(nterm)}&q=${encodeURIComponent(term)}`);
    } else {
      navigate(`/joias?q=${encodeURIComponent(term)}`);
    }
    setQuery("");
    setSearchOpen(false);
  }, [query, categoriasSet, navigate]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch();
    }
  };

  // ===== CEP / Endereço =====
  const [cepModalOpen, setCepModalOpen] = useState(false);
  const [cepInput, setCepInput] = useState("");
  const [endereco, setEndereco] = useState(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  // carrega do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setEndereco(parsed);
        setCepInput(maskCEP(parsed?.cep || ""));
      }
    } catch {}
  }, []);

  // trava o scroll do body enquanto o modal está aberto
  useEffect(() => {
    if (!cepModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [cepModalOpen]);

  const abrirModalCEP = () => {
    setCepError("");
    setCepModalOpen(true);
  };
  const fecharModalCEP = () => {
    setCepModalOpen(false);
    setCepError("");
    setCepLoading(false);
  };

  const buscarEnderecoPorCEP = async () => {
    setCepLoading(true);
    setCepError("");
    try {
      const res = await consultarCep(cepInput);
      if (res?.error) {
        setCepError(res.message || "CEP inválido. Tente novamente.");
        return;
      }
      const info = {
        cep: onlyDigits(res.cep),
        cidade: res.cidade,
        uf: res.uf,
        bairro: res.bairro || "",
        logradouro: res.logradouro || "",
      };
      setEndereco(info);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(info));
      } catch {}
      setCepModalOpen(false);
    } catch {
      setCepError("Não foi possível consultar o CEP. Tente novamente mais tarde.");
    } finally {
      setCepLoading(false);
    }
  };

  // ===== Estilos inline do modal (z-index altíssimo) =====
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.28)",
    display: "grid",
    placeItems: "center",
    zIndex: 2147483000,           // bem alto para ficar acima de qualquer banner/carrossel
    padding: "16px",
  };
  const modalStyle = {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid rgba(28,44,60,.18)",
    boxShadow: "0 10px 30px rgba(0,0,0,.18)",
  };
  const modalHeader = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderBottom: "1px solid rgba(28,44,60,.12)",
  };
  const modalBody = { padding: "14px" };
  const modalTitle = {
    fontFamily: "'Bodoni Moda', serif",
    fontSize: "1.05rem",
    margin: 0,
  };
  const inputWrap = { display: "grid", gap: 8 };
  const input = {
    width: "100%",
    height: 36,
    border: "1px solid rgba(28,44,60,.26)",
    borderRadius: 8,
    padding: "0 10px",
    outline: "none",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: ".95rem",
  };
  const help = { fontSize: ".82rem", color: "rgba(28,44,60,.75)" };
  const error = { fontSize: ".86rem", color: "#8b1c1c", marginTop: 6 };
  const footer = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: "10px 14px 14px",
  };
  const btn = {
    height: 34,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #1c2c3c",
    fontWeight: 700,
    letterSpacing: ".02em",
    cursor: "pointer",
  };
  const btnOutline = { ...btn, background: "#fff", color: "#1c2c3c" };
  const btnPrimary = {
    ...btn,
    background: "#1c2c3c",
    color: "#fff",
    borderColor: "#1c2c3c",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  // ===== JSX =====
  return (
    <header className={styles.root}>
      <div className={styles.wrap}>
        {/* ===== Barra superior ===== */}
        <div className={styles.topBar}>
          {/* CEP (esquerda) */}
          <button type="button" className={styles.leftBtn} onClick={abrirModalCEP}>
            <MapPin className="h-4 w-4" />
            {endereco ? (
              <>Entregar em: {endereco.cidade} - {endereco.uf}</>
            ) : (
              "Informar meu CEP"
            )}
          </button>

          {/* Logo central */}
          <a href="/" className={styles.logoLink} aria-label="Página inicial">
            <img src="/logo-clara.svg" alt="Ro Jewellery" className={styles.logo} />
          </a>

          {/* Buscar + Carrinho (direita) */}
          <div className={styles.rightCol}>
            {searchOpen ? (
              <input
                type="search"
                placeholder="Buscar joias"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
                autoFocus
                onBlur={() => setSearchOpen(false)}
                onKeyDown={onKeyDown}
                aria-label="Buscar"
              />
            ) : (
              <button
                type="button"
                className={styles.rightBtn}
                onClick={() => setSearchOpen(true)}
                aria-label="Abrir busca"
              >
                <Search className="h-4 w-4" />
                Buscar
              </button>
            )}

            <a href="/carrinho" className={styles.iconBtn} aria-label="Abrir carrinho">
              <ShoppingCart className={styles.iconSvg} />
            </a>
          </div>
        </div>

        {/* ===== NAVBAR ===== */}
        <nav className={styles.nav} aria-label="Navegação principal">
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

      {/* ===== Modal CEP via Portal (sempre na frente) ===== */}
      {cepModalOpen &&
        createPortal(
          <div
            style={overlayStyle}
            role="dialog"
            aria-modal="true"
            aria-label="Informar CEP"
            onClick={(e) => {
              // close ao clicar fora do modal
              if (e.target === e.currentTarget) fecharModalCEP();
            }}
          >
            <div style={modalStyle}>
              <div style={modalHeader}>
                <h3 style={modalTitle}>Informe seu CEP</h3>
                <button
                  type="button"
                  onClick={fecharModalCEP}
                  aria-label="Fechar"
                  style={{ background: "transparent", border: 0, cursor: "pointer", color: "#1c2c3c" }}
                >
                  <X />
                </button>
              </div>

              <div style={modalBody}>
                <div style={inputWrap}>
                  <label htmlFor="cep-input" style={{ fontSize: ".86rem", fontWeight: 600 }}>
                    CEP
                  </label>
                  <input
                    id="cep-input"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    value={maskCEP(cepInput)}
                    onChange={(e) => setCepInput(e.target.value)}
                    style={input}
                  />
                  <p style={help}>Somente números. Ex.: 01311-000</p>
                  {cepError && <p style={error}>{cepError}</p>}
                </div>
              </div>

              <div style={footer}>
                <button type="button" style={btnOutline} onClick={fecharModalCEP}>
                  Cancelar
                </button>
                <button
                  type="button"
                  style={btnPrimary}
                  onClick={buscarEnderecoPorCEP}
                  disabled={cepLoading}
                >
                  {cepLoading && <Loader2 className="animate-spin" size={16} />}
                  Usar CEP
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
