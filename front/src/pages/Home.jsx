import Header from "../components/Header/Header";
import HeaderCompact from "../components/HeaderCompact/HeaderCompact";
import Hero from "../sections/Hero";
import PreFooter from "../components/PreFooter/PreFooter";
import Footer from "../components/Footer/Footer";
import WhatsApp from "../components/Atoms/WhatsApp/WhatsApp";
import Cookies from "../components/Atoms/Cookies/Cookies";
;

function Home() {
  return (
    <>
      <Header />

      {/* SENTINELA: é ele que dispara a aparição do header compacto */}
      <div id="header-sentinel" />

      {/* Header compacto (fixo) */}
      <HeaderCompact />
      <Hero />
      <WhatsApp />
      <Cookies />
      <PreFooter />
      <Footer />
    </>
  );
}

export default Home;
