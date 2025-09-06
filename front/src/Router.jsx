import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/inicio";
import Joias from "./pages/joias";
import CriadasParaVoce from "./pages/criadasparavoce";
import Eventos from "./pages/eventos";
import SobreNos from "./pages/sobrenos";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/joias" element={<Joias />} />
        <Route path="/criadas-para-voce" element={<CriadasParaVoce />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;

