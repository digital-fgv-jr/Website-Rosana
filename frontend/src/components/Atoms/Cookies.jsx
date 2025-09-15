// Cookies.jsx
import { useEffect, useState, useCallback } from "react";
import style from "./Cookies.module.css";

// ===== Helpers locais =====
const CONSENT_KEY = "cookie_consent";
const CONSENT_VALUE = "accepted";
const CONSENT_MAX_AGE_DAYS = 180;

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function setCookie(name, value, days) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60; // em segundos
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function hasConsent() {
  if (typeof window === "undefined") return false;
  const c = getCookie(CONSENT_KEY) === CONSENT_VALUE;
  let l = false;
  try {
    l = window.localStorage.getItem(CONSENT_KEY) === CONSENT_VALUE;
  } catch {}
  return c || l;
}

function giveConsent() {
  try {
    window.localStorage.setItem(CONSENT_KEY, CONSENT_VALUE);
  } catch {}
  setCookie(CONSENT_KEY, CONSENT_VALUE, CONSENT_MAX_AGE_DAYS);
}

export default function Cookies() {
  const [visible, setVisible] = useState(false);

  // Decide se mostra o banner ao montar
  useEffect(() => {
    if (hasConsent()) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  // “Continuar e fechar” = ACEITAR
  const accept = useCallback(() => {
    giveConsent();     // grava cookie + localStorage
    setVisible(false); // esconde o banner
  }, []);

  if (!visible) return null;

  return (
    <div
      className={style.banner}
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
    >
      <div className={style.inner}>
        <p className={style.text}>
          Utilizamos cookies para melhorar a sua experiência no site.
          <br />
          <a className={style.link} href="/privacidade#cookies">
            Acesse a nossa Política de Cookies
          </a>{" "}
          para saber mais.
        </p>

        <button className={style.btn} onClick={accept}>
          CONTINUAR E FECHAR
        </button>
      </div>
    </div>
  );
}
