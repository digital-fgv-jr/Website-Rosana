import styles from "./WhatsApp.module.css";

/**
 * Botão flutuante do WhatsApp
 * @param {string} phone - número no formato internacional, ex: "5599999999999"
 * @param {string} message - mensagem pré-preenchida opcional
 * @param {string} position - "right" | "left" (default: right)
 */
export default function WhatsApp({ phone, message = "", position = "right" }) {
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  const href = message ? `${base}?text=${encodeURIComponent(message)}` : base;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className={`${styles.root} ${
        position === "left" ? styles.left : styles.right
      }`}
    >
      <span className={styles.iconWrap}>
        <img src={"/whatsapp.svg"} alt="WhatsApp" className={styles.icon} />
      </span>
    </a>
  );
}
