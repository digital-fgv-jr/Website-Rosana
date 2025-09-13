import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Header from "../components/Header"
import HeaderCompact from "../components/HeaderCompact";
import PreFooter from "../components/PreFooter"
import Footer from "../components/Footer";

export default function Contato() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
    // TODO: integrar com backend/email service
  };

  return (
    <>
      <Header />
      <div id="header-sentinel" />
      <HeaderCompact />

      <main className="contact-root">
        <section className="contact-hero">
          <h1>Fale Conosco</h1>
          <p>
            Dúvidas, pedidos especiais ou transformações? Envie sua mensagem —
            vamos adorar atender você.
          </p>
        </section>

        <section className="contact-grid">
          {/* LADO ESQUERDO — Informações */}
          <aside className="info-card">
            <h2>Atendimento</h2>
            <ul className="info-list">
              <li>
                <span className="info-icon"><Mail /></span>
                <div>
                  <strong>E-mail</strong>
                  <a href="mailto:contato@rosanajoias.com">contato@rosanajoias.com</a>
                </div>
              </li>
              <li>
                <span className="info-icon"><Phone /></span>
                <div>
                  <strong>Telefone / WhatsApp</strong>
                  <a href="tel:+550000000000">+55 (00) 00000-0000</a>
                </div>
              </li>
              <li>
                <span className="info-icon"><MapPin /></span>
                <div>
                  <strong>Endereço</strong>
                  <span>São Paulo — SP</span>
                </div>
              </li>
              <li>
                <span className="info-icon"><Clock /></span>
                <div>
                  <strong>Horário</strong>
                  <span>Seg a Sex, 10h — 18h</span>
                </div>
              </li>
            </ul>
          </aside>

          {/* LADO DIREITO — Formulário */}
          <div className="form-card">
            <h2>Envie sua mensagem</h2>

            {sent && (
              <div className="alert ok" role="status">
                <p>Obrigado! Recebemos sua mensagem e retornaremos em breve.</p>
              </div>
            )}

            <form className="form" onSubmit={handleSubmit}>
              <div className="row two">
                <div className="field">
                  <label htmlFor="nome">Nome completo</label>
                  <input id="nome" name="nome" type="text" required />
                </div>

                <div className="field">
                  <label htmlFor="email">E-mail</label>
                  <input id="email" name="email" type="email" required />
                </div>
              </div>

              <div className="row two">
                <div className="field">
                  <label htmlFor="telefone">Telefone (opcional)</label>
                  <input id="telefone" name="telefone" type="tel" />
                </div>

                <div className="field">
                  <label htmlFor="assunto">Assunto</label>
                  <input id="assunto" name="assunto" type="text" required />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label htmlFor="mensagem">Mensagem</label>
                  <textarea id="mensagem" name="mensagem" rows="6" required />
                </div>
              </div>

              <div className="row actions">
                <button type="submit" className="btn">ENVIAR MENSAGEM</button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <PreFooter />
      <Footer />

      {/* estilos inline da página */}
      <style>{`
 .contact-root {
  --bg:#faf9f6; --fg:#1c2c3c; --accent:#c9bd8f; --beige:#F7E7CE;
  background:var(--bg); color:var(--fg);
}

.contact-hero {
  max-width:72rem; margin:0 auto; padding:36px 0 14px; text-align:center;
}
.contact-hero h1 {
  font-family:'Bodoni Moda',serif; font-size:clamp(1.6rem,2.4vw,2.2rem); margin:0 0 8px; letter-spacing:.02em;
}
.contact-hero p {
  font-family:'Montserrat',sans-serif; font-size:.93rem; opacity:.9; margin:0;
}

.contact-grid {
  max-width:72rem; margin:0 auto; padding:20px 0 44px;
  display:grid; grid-template-columns:1.05fr 1.35fr; gap:18px;
}

.info-card {
  background:#fff; border:1px solid rgba(28,44,60,.12); border-radius:10px; padding:14px;
}
.info-card h2 {
  font-family:'Bodoni Moda',serif; font-size:1.1rem; margin:0 0 10px;
}
.info-list {
  list-style:none; margin:0; padding:0; display:grid; gap:10px;
}
.info-list li {
  display:grid; grid-template-columns:auto 1fr; gap:10px; align-items:center;
}
.info-icon {
  display:grid; place-items:center; width:28px; height:28px; border-radius:50%; background:var(--accent); color:#fff; line-height:0;
}
.info-icon svg { width:15px; height:15px; }
.info-list strong { display:block; font-size:.92rem; margin-bottom:2px; }
.info-list a, .info-list span {
  font-family:'Montserrat',sans-serif; font-size:.9rem; color:rgba(28,44,60,.9); text-decoration:none;
}
.info-list a:hover { text-decoration:underline; }

.form-card {
  background:#fff; border:1px solid rgba(28,44,60,.12); border-radius:10px; padding:14px;
}
.form-card h2 {
  font-family:'Bodoni Moda',serif; font-size:1.1rem; margin:0 0 10px;
}

.alert.ok {
  background:var(--beige); border-left:4px solid var(--accent); color:var(--fg);
  padding:8px 10px; border-radius:8px; margin-bottom:10px; font-size:.9rem;
}

.form { display:grid; gap:10px; }
.row { display:grid; gap:10px; }
.row.two { grid-template-columns:1fr 1fr; gap:10px; }

.field label {
  display:block; font-size:.82rem; margin-bottom:4px; font-weight:600; letter-spacing:.01em;
}

.field input,
.field textarea {
  box-sizing:border-box;
  width:100%; background:#fff; border:1px solid rgba(28,44,60,.22);
  border-radius:6px; padding:6px 8px; font-family:'Montserrat',sans-serif;
  font-size:.88rem; color:var(--fg); outline:none;
  transition: box-shadow .12s ease, border-color .12s ease;
}

.field input {
  height:26px;
  line-height:1.2;
}

.field textarea {
  min-height:72px;
  line-height:1.35;
  resize:vertical;
}

.field input::placeholder,
.field textarea::placeholder { color:rgba(28,44,60,.45); }

.field input:focus,
.field textarea:focus {
  border-color:var(--fg);
  box-shadow:0 0 0 2px rgba(28,44,60,.1);
}

.actions { display:flex; justify-content:flex-end; }
.btn {
  display:inline-flex; align-items:center; justify-content:center;
  height:32px; padding:0 14px; font-weight:700; letter-spacing:.02em;
  border-radius:6px; border:1px solid var(--fg); color:#fff; background:var(--fg);
  cursor:pointer; transition: background .18s ease, color .18s ease, border-color .18s ease;
}
.btn:hover { background:#000; border-color:#000; }

@media (max-width:980px){
  .contact-grid { grid-template-columns:1fr; }
}
@media (max-width:640px){
  .contact-hero { padding:30px 0 12px; }
  .row.two { grid-template-columns:1fr; }
  .actions { justify-content:stretch; }
  .btn { width:100%; }
}
@media (prefers-reduced-motion:reduce){
  .btn, .field input, .field textarea { transition:none; }
}
       
      `}</style>
    </>
  );
}