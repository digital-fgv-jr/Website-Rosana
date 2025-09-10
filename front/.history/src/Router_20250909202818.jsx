import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import Home from "./pages/inicio";
import Joias from "./pages/joias";
import CriadasParaVoce from "./pages/criadasparavoce";
import Eventos from "./pages/eventos";
import SobreNos from "./pages/sobrenos";
import Produto from "./pages/produto";
import Carrinho from "./pages/carrinho";

function AppRouter() {
  return (
    <Router>
      <ScrollToTop />  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/joias" element={<Joias />} />
          <Route path="/criadas-para-voce" element={<CriadasParaVoce />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/produto/:id" element={<Produto />} />
          <Route path="/carrinho/" element={<Carrinho />}/>
        </Routes>     
    </Router>
  );
}

export default AppRouter;

