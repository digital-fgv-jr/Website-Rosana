import { MapPin, Search, Instagram } from "lucide-react";
import logo from "../../assets/logo-clara.svg";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.root}>
      <div className={styles.wrap}>
        {/* Barra superior */}
        <div className={styles.topBar}>
          <button className={styles.leftBtn} aria-label="Informar meu CEP">
            <MapPin className="h-4 w-4" />
            Informar meu CEP
          </button>

          <a href="/" className={styles.logoLink} aria-label="Página inicial">
            <img src={logo} alt="Ro Jewellery" className={styles.logo} />
          </a>

          <div className={styles.rightCol}>
            <button className={styles.rightBtn} aria-label="Buscar">
              <Search className="h-4 w-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* Navegação com 5 itens */}
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
            <span className={styles.navInstaName}>roalves_jewellery</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
