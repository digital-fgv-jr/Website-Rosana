import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import ScrollToHash from "./ScrollToHash";
import Home from "./pages/inicio";
import Joias from "./pages/joias";
import CriadasParaVoce from "./pages/criadasparavoce";
import Eventos from "./pages/eventos";
import SobreNos from "./pages/sobrenos";
import Produto from "./pages/produto";
import Carrinho from "./pages/carrinho";
import Contato from "./pages/contato";
import MiniCarrinho from "./components/MiniCarrinho";
import CalculadoraFrete from './components/CalculadoraFrete';
import Checkout from "./pages/checkout";
import PagamentoStatus from "./pages/pagamentoStatus";
import Privacidade from "./pages/privacidade";


function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollToHash />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/joias" element={<Joias />} />
          <Route path="/criadas-para-voce" element={<CriadasParaVoce />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/produto/:id" element={<Produto />} />
          <Route path="/carrinho/" element={<Carrinho />}/>
          <Route path="/calcular-frete/" element={<CalculadoraFrete />}/>
          <Route path="/contato/" element={<Contato />}/>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pagamento/status" element={<PagamentoStatus />} />
          <Route path="/privacidade" element={<Privacidade />} />
        </Routes>     
    </Router>
  );
}

export default AppRouter;

