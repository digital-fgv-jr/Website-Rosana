import logo from "../../assets/logo-escura.svg";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <img
          src={logo}
          alt="Rosana Jewellery"
          className={styles.logo}
          loading="lazy"
        />

        <p className={styles.copyright}>
          Copyright © {year} - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
