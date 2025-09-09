// src/pages/Eventos.jsx
import Header from "../components/Header/Header";
import HeaderCompact from "../components/HeaderCompact/HeaderCompact";
import PreFooter from "../components/PreFooter/PreFooter";
import Footer from "../components/Footer/Footer";
import WhatsApp from "../components/Atoms/WhatsApp/WhatsApp";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Imagens (coloque em src/assets/eventos/)
import ev1 from "../assets/eventos/ev-01.jpg";
import ev2 from "../assets/eventos/ev-02.jpg";
import ev3 from "../assets/eventos/ev-03.jpg";
import ev4 from "../assets/eventos/ev-04.jpg";

export default function Eventos() {
  return (
    <>
      <Header />
      <div id="header-sentinel" />
      <HeaderCompact />
      <WhatsApp />

      <main className="ev-root">
        <section className="ev-hero">
          <h1>Eventos</h1>
          <p className="ev-sub">
            Onde podemos nos conectar com <span className="ev-you">você</span>
          </p>
        </section>

        {/* carrossel vazio (mantido) */}
        <section className="ev-carousel" aria-label="Galeria de eventos">
          <button className="ev-nav ev-left" aria-label="Anterior">
            <ChevronLeft />
          </button>
          <div className="ev-slide" />
          <button className="ev-nav ev-right" aria-label="Próximo">
            <ChevronRight />
          </button>
        </section>

        {/* BLOCO 1 — texto (3 parágrafos) à esquerda, 2 imagens horizontais à direita */}
        <section className="ev-section leftText">
          <div className="ev-text">
            <p>
              Participar de um evento é sempre mais do que expor joias: é criar
              pontes entre histórias. Cada peça que levamos carrega consigo a
              essência do nosso trabalho: o afeto, a memória e a identidade.
              Quando essas criações encontram pessoas, nascem novas conexões,
              novos significados e novas possibilidades de personalização.
            </p>
            <p>
              Nossos eventos são espaços de troca. É ali que conversamos,
              ouvimos histórias e descobrimos inspirações que muitas vezes se
              transformam em joias únicas. O brilho nos olhos de quem encontra
              uma peça que traduz exatamente um sentimento é o que nos move a
              continuar criando.
            </p>
            <p>
              Feiras, exposições e encontros coletivos nos permitem
              compartilhar a força do trabalho artesanal. São ocasiões em que
              celebramos a beleza do feito à mão, mostrando que cada detalhe é
              pensado com cuidado, sem pressa e sem fórmulas prontas. Em um
              mundo acelerado, nossos eventos são convites para desacelerar e
              valorizar o que é único.
            </p>
          </div>

          <div className="ev-images">
            <img className="ev-img" src={ev1} alt="Cena do evento – detalhe 1" loading="lazy" />
            <img className="ev-img" src={ev2} alt="Cena do evento – detalhe 2" loading="lazy" />
          </div>
        </section>

        {/* BLOCO 2 — 2 imagens horizontais à esquerda, texto (2 parágrafos) à direita */}
        <section className="ev-section rightText">
          <div className="ev-images">
            <img className="ev-img" src={ev3} alt="Ambiente do evento – detalhe 3" loading="lazy" />
            <img className="ev-img" src={ev4} alt="Ambiente do evento – detalhe 4" loading="lazy" />
          </div>

          <div className="ev-text">
            <p>
              Mais do que mostrar nossas joias, queremos apresentar nossa
              essência. Quem visita um evento nosso não encontra apenas uma
              coleção, mas um universo de significados: peças que podem ser
              adaptadas, personalizadas ou criadas a partir de uma memória
              pessoal. Cada conversa pode se tornar o ponto de partida para uma
              nova história em ouro e prata.
            </p>
            <p>
              Também acreditamos que os eventos têm um papel de aproximação. É
              ali que clientes se tornam amigos, que ideias ganham forma e que o
              afeto encontra espaço para ser celebrado. São encontros que nos
              permitem crescer não apenas como marca, mas como parte de uma
              comunidade que valoriza o artesanal, o autoral e o verdadeiro.
              Porque, no fim, cada evento é uma celebração da vida. Uma
              oportunidade de transformar lembranças em joias, encontros em
              inspirações e instantes em eternidade. E é por isso que cada
              participação nossa carrega o mesmo propósito: emocionar, conectar
              e eternizar histórias.
            </p>
          </div>
        </section>
      </main>

      <PreFooter />
      <Footer />

      <style>{`
        .ev-root{
          --bg:#faf9f6; --fg:#1c2c3c; --accent:#c9bd8f;
          --imgH: clamp(160px, 20vw, 220px); /* altura fixa das imagens no desktop */
          background:var(--bg); color:var(--fg);
        }

        .ev-hero{
          max-width:72rem; margin:0 auto; text-align:center; padding:28px 0 6px;
        }
        .ev-hero h1{
          font-family:'Bodoni Moda',serif;
          font-size:clamp(1.9rem,3vw,2.8rem);
          margin:0; letter-spacing:.02em;
        }
        .ev-sub{
          margin:6px 0 18px;
          font-family:'Bodoni Moda',serif;
          font-weight:700;
          font-size:1.05rem;
          letter-spacing:.02em;
        }
        .ev-you{ color:#C2B280; }

        .ev-carousel{
          max-width:72rem; margin:0 auto 18px; position:relative;
          height:260px; border-radius:12px; overflow:hidden;
          border:1px solid rgba(28,44,60,.12); background:#e6e6e6;
        }
        .ev-slide{ width:100%; height:100%; }
        .ev-nav{
          position:absolute; top:50%; transform:translateY(-50%);
          width:34px; height:34px; border-radius:50%; display:grid; place-items:center;
          border:1px solid var(--fg); background:rgba(255,255,255,.9); color:var(--fg);
          cursor:pointer;
        }
        .ev-nav svg{ width:18px; height:18px; }
        .ev-left{ left:10px; }
        .ev-right{ right:10px; }

        .ev-section{
          max-width:72rem; margin:0 auto; padding:10px 0 28px;
          display:grid; gap:18px; align-items:start;
        }
        .leftText{ grid-template-columns: 1.25fr 1fr; }
        .rightText{ grid-template-columns: 1fr 1.25fr; }

        .ev-text{
          background:var(--bg);
          font-family:'Montserrat',sans-serif;
          font-size:.98rem; line-height:1.75;
          text-align:justify; hyphens:auto;
        }
        .ev-text p{ margin:0; }
        .ev-text p + p{ margin-top:12px; }

        /* Imagens horizontais: 16:9, altura controlada e crop via object-fit */
        .ev-images{
          display:grid; gap:14px;
          grid-auto-rows: var(--imgH); /* duas linhas, mesma altura */
        }
        .ev-img{
          width:100%; height:100%; display:block;
          object-fit:cover; object-position:center;
          border-radius:12px; border:1px solid rgba(28,44,60,.1);
          aspect-ratio: 16 / 9; /* garante horizontal */
        }

        @media (max-width:980px){
          .leftText, .rightText{ grid-template-columns:1fr; }
          .ev-text{ order:1; }
          .ev-images{
            order:2;
            grid-auto-rows: unset;
            grid-template-columns: 1fr 1fr;
          }
          .ev-img{ height:auto; aspect-ratio: 4 / 3; } /* mobile: mais alto pra não ficar “faixa” */
          .ev-carousel{ height:220px; }
        }

        @media (max-width:640px){
          .ev-hero{ padding:22px 0 0; }
          .ev-section{ gap:14px; padding:8px 0 22px; }
          .ev-images{ grid-template-columns:1fr; }
          .ev-img{ aspect-ratio: 4 / 3; border-radius:10px; }
          .ev-carousel{ height:190px; border-radius:10px; }
        }
      `}</style>
    </>
  );
}
