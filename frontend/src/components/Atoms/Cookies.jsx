import { useState } from "react";
import style from "./Cookies.module.css";

export default function Cookies() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className={style.banner}>
      <div className={style.inner}>
        <p className={style.text}>
          Utilizamos cookies para melhorar a sua experiência no site.
          <br />
          <a
            className={style.link}
            href="/politica-de-cookies"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acesse a nossa Política de Cookies
          </a>{" "}
          para saber mais.
        </p>

        <button className={style.btn} onClick={() => setVisible(false)}>
          CONTINUAR E FECHAR
        </button>
      </div>
    </div>
  );
}
