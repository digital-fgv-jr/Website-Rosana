import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import ScrollToHash from "./ScrollToHash";

import HomePage from "./pages/Home";

import PoliticaPrivacidadePage from "./pages/PoliticaPrivacidade";
import ContatoPage from "./pages/Contato";

import ParaVocePage from "./pages/informacoes/ParaVoce";
import EventosPage from "./pages/informacoes/Eventos";
import SobreNosPage from "./pages/informacoes/SobreNos";

import JoiasPage from "./pages/compra/Joias";
import ProdutoPage from "./pages/compra/Produto";
import CarrinhoPage from "./pages/compra/Carrinho";

import InformacoesEntregaPage from "./pages/checkout/InformacoesEntrega";
import InformacoesContatoPage from "./pages/checkout/InformacoesContato";
import ConfirmacaoCompraPage from "./pages/checkout/ConfirmacaoCompra";

import PagamentoErroPage from "./pages/pagamento/PagamentoErro";
import PagamentoSucessoPage from "./pages/pagamento/PagamentoSucesso";
import PagamentoPendentePage from "./pages/pagamento/PagamentoPendente";
import PagamentoRecusadoPage from "./pages/pagamento/PagamentoRecusado";


function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollToHash />
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidadePage />}/>
          <Route path="/contato/" element={<ContatoPage />}/>
          
          <Route path="/para-voce" element={<ParaVocePage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/sobre-nos" element={<SobreNosPage />} />
          
          <Route path="/joias" element={<JoiasPage />} />
          <Route path="/produto/:id" element={<ProdutoPage />} />
          <Route path="/carrinho/" element={<CarrinhoPage />}/>
          
          <Route path="/checkout/informacoes-de-entrega/" element={<InformacoesEntregaPage />}/>
          <Route path="/checkout/informacoes-de-contato/" element={<InformacoesContatoPage />}/>
          <Route path="/checkout/confirmacao-da-compra/" element={<ConfirmacaoCompraPage />}/>

          <Route path="/pagamento/erro" element={<PagamentoErroPage />}/>
          <Route path="/pagamento/sucesso" element={<PagamentoSucessoPage />}/>
          <Route path="/pagamento/pendente" element={<PagamentoPendentePage />}/>
          <Route path="/pagamento/recusado" element={<PagamentoRecusadoPage />}/>
        </Routes>     
    </Router>
  );
}

export default AppRouter;

