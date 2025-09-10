import styles from "./WhatsApp.module.css";

/**
 * Botão flutuante do WhatsApp
 * @param {string} phone    - número em formato internacional, ex: "5521999999999"
 * @param {string} message  - mensagem pré-preenchida opcional
 * @param {"right"|"left"} position - lado do botão (default: "right")
 * @param {string|number} top    - override CSS var (--wa-top). Ex: "72%" ou 72
 * @param {string|number} offset - override CSS var (--wa-offset). Ex: "20px" ou 20
 * @param {string|number} size   - override CSS var (--wa-size). Ex: "64px" ou 64
 * @param {string} bg            - override CSS var (--wa-bg). Ex: "#c2b280"
 */
export default function WhatsApp({
  phone,
  message = "",
  position = "right",
  top,
  offset,
  size,
  bg,
}) {
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  const href = message ? `${base}?text=${encodeURIComponent(message)}` : base;

  const styleVars = {
    ...(top !== undefined
      ? { ["--wa-top"]: typeof top === "number" ? `${top}%` : top }
      : {}),
    ...(offset !== undefined
      ? { ["--wa-offset"]: typeof offset === "number" ? `${offset}px` : offset }
      : {}),
    ...(size !== undefined
      ? { ["--wa-size"]: typeof size === "number" ? `${size}px` : size }
      : {}),
    ...(bg ? { ["--wa-bg"]: bg } : {}),
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className={`${styles.root} ${
        position === "left" ? styles.left : styles.right
      }`}
      style={styleVars}
    >
      <span className={styles.iconWrap}>
        <img src="/whatsapp.svg" alt="" className={styles.icon} loading="lazy" />
      </span>
    </a>
  );
}
