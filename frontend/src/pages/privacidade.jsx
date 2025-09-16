// src/pages/privacidade.jsx
import Header from "../components/Header";
import HeaderCompact from "../components/HeaderCompact";
import PreFooter from "../components/PreFooter";
import Footer from "../components/Footer";
import WhatsApp from "../components/Atoms/WhatsApp";
import ScrollToHash from "../ScrollToHash"; // 👈 garante rolagem suave para #âncoras nesta página

export default function Privacidade() {
  const atualizadoEm = new Date().toLocaleDateString("pt-BR");

  const Item = ({ children }) => (
    <li className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
      {children}
    </li>
  );

  const H2 = ({ id, children }) => (
    <h2
      id={id}
      className="scroll-mt-28 text-3xl md:text-4xl font-BodoniMT text-[#1c2c3c] mt-12 mb-6"
    >
      {children}
    </h2>
  );

  return (
    <div className="bg-[#faf9f6] text-[#1c2c3c]">
      <Header />
      <div
        id="header-sentinel"
        style={{ position: "absolute", top: 0, height: 0, margin: 0, padding: 0 }}
      />
      <HeaderCompact />

      {/* 👇 ativa rolagem suave para #âncoras dessa rota */}
      <ScrollToHash />

      {/* Hero */}
      <section className="text-center py-8 px-6">
        <h1 className="text-5xl md:text-6xl font-BodoniMT mb-3">
          Política de <span className="text-[#c2b280]">Privacidade</span>
        </h1>
        <p className="text-gray-700 font-MontserratRegular">
          Transparência sobre como coletamos, usamos e protegemos seus dados.
        </p>
        <p className="text-sm text-gray-500 font-MontserratRegular mt-2">
          Atualizado em {atualizadoEm}
        </p>
      </section>

      {/* Conteúdo */}
      <main className="max-w-6xl mx-auto px-6 pb-12">
        {/* Sumário */}
        <nav aria-label="Sumário" className="rounded-xl border border-[#1c2c3c]/10 bg-white p-6">
          <h3 className="font-BodoniMT text-2xl mb-4">Sumário</h3>
          <ul className="grid md:grid-cols-2 gap-2 text-[#1c2c3c] font-MontserratRegular">
            <li><a href="#quem-somos">1. Quem somos</a></li>
            <li><a href="#dados-coletados">2. Quais dados coletamos</a></li>
            <li><a href="#uso-dados">3. Como usamos os dados</a></li>
            <li><a href="#base-legal">4. Bases legais (LGPD)</a></li>
            <li><a href="#compartilhamento">5. Compartilhamento</a></li>
            <li><a href="#pagamentos">6. Pagamentos e antifraude</a></li>
            <li><a href="#cookies">7. Cookies</a></li>
            <li><a href="#preferencias-cookies">8. Preferências de cookies & consentimento</a></li>
            <li><a href="#comunicacoes">9. Comunicações e marketing</a></li>
            <li><a href="#direitos">10. Seus direitos (titular)</a></li>
            <li><a href="#seguranca">11. Segurança e notificação de incidentes</a></li>
            <li><a href="#retencao">12. Retenção e descarte</a></li>
            <li><a href="#transferencias">13. Transferências internacionais</a></li>
            <li><a href="#menores">14. Crianças e adolescentes</a></li>
            <li><a href="#links-terceiros">15. Links de terceiros</a></li>
            <li><a href="#contato">16. Contato do controlador/DPO</a></li>
            <li><a href="#mudancas">17. Mudanças nesta política</a></li>
          </ul>
        </nav>

        {/* Seções */}
        <H2 id="quem-somos">1. Quem somos</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Este site pertence à <strong>Ro Jewellery</strong> (“nós”, “nosso”). Somos responsáveis
          pelo tratamento dos dados pessoais coletados por meio deste site e de nossos canais de
          atendimento, na forma da Lei nº 13.709/2018 (LGPD).
        </p>

        <H2 id="dados-coletados">2. Quais dados coletamos</H2>
        <ul className="list-disc pl-6 space-y-2">
          <Item><strong>Contato/conta:</strong> nome, e-mail, telefone/WhatsApp, endereço.</Item>
          <Item><strong>Compra e entrega:</strong> produtos, preferências, CEP, endereços de entrega e faturamento, histórico de pedidos.</Item>
          <Item><strong>Navegação:</strong> páginas acessadas, IP, data/hora, identificadores de dispositivo/navegador, cookies, pixels, origem de tráfego.</Item>
          <Item><strong>Comunicações:</strong> mensagens trocadas (formulário, e-mail, WhatsApp).</Item>
          <Item><strong>Pagamento:</strong> processado por terceiros (ex.: Mercado Pago). Não armazenamos dados completos de cartão.</Item>
          <Item><strong>Redes sociais (quando aplicável):</strong> interações e identificadores públicos fornecidos por você.</Item>
        </ul>

        <H2 id="uso-dados">3. Como usamos os dados</H2>
        <ul className="list-disc pl-6 space-y-2">
          <Item>Processar e entregar pedidos e personalizações de joias.</Item>
          <Item>Atender solicitações e oferecer suporte ao cliente.</Item>
          <Item>Emitir documentos fiscais e cumprir obrigações legais.</Item>
          <Item>Prevenir fraudes, garantir segurança e integridade das transações.</Item>
          <Item>Melhorar site/experiência (analytics), inclusive desempenho de páginas.</Item>
          <Item>Enviar comunicações transacionais relacionadas ao pedido.</Item>
          <Item>Enviar ofertas/novidades <em>apenas com consentimento</em> e com opção de descadastro.</Item>
        </ul>

        <H2 id="base-legal">4. Bases legais (LGPD)</H2>
        <ul className="list-disc pl-6 space-y-2">
          <Item><strong>Execução de contrato</strong> – processar compra e entrega.</Item>
          <Item><strong>Obrigação legal</strong> – emissão fiscal e retenções.</Item>
          <Item><strong>Legítimo interesse</strong> – segurança antifraude e melhoria do site, com equilíbrio aos seus direitos.</Item>
          <Item><strong>Consentimento</strong> – marketing e cookies não essenciais (revogável).</Item>
        </ul>

        <H2 id="compartilhamento">5. Compartilhamento</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Compartilhamos dados apenas com parceiros necessários à operação:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <Item><strong>Meios de pagamento</strong> (ex.: Mercado Pago) para transações.</Item>
          <Item><strong>Logística/Correios/transportadoras</strong> para entrega.</Item>
          <Item><strong>Hospedagem e analytics</strong> para funcionamento e métricas do site.</Item>
          <Item>Autoridades públicas quando exigido por lei/ordem judicial.</Item>
        </ul>

        <H2 id="pagamentos">6. Pagamentos e antifraude</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Transações são processadas por terceiros especializados (ex.: <strong>Mercado Pago</strong>),
          que podem coletar dados adicionais para análise de risco. Não armazenamos dados completos de cartão.
          Consulte a política do prestador utilizado.
        </p>

        <H2 id="cookies">7. Cookies</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Cookies lembram preferências, melhoram a experiência e geram estatísticas. Você pode gerenciá-los pelo navegador.
        </p>
        <div className="rounded-xl border border-[#1c2c3c]/10 bg-white p-6">
          <h3 className="font-BodoniMT text-2xl mb-3">Tipos que usamos</h3>
          <ul className="list-disc pl-6 space-y-2">
            <Item><strong>Estritamente necessários:</strong> essenciais ao site/carrinho.</Item>
            <Item><strong>Desempenho/Analytics:</strong> métricas de uso e melhoria.</Item>
            <Item><strong>Funcionais:</strong> lembram escolhas (ex.: CEP, idioma).</Item>
            <Item><strong>Publicidade/remarketing (quando aplicável):</strong> medem campanhas; podem ser de terceiros.</Item>
          </ul>
        </div>

        <H2 id="preferencias-cookies">8. Preferências de cookies & consentimento</H2>
        <ul className="list-disc pl-6 space-y-2">
          <Item>Gerencie cookies no navegador (Chrome, Safari, Firefox, Edge) em <em>Configurações &gt; Privacidade &gt; Cookies</em>.</Item>
          <Item>Se houver banner de preferências, você poderá aceitar só os essenciais e ajustar os demais.</Item>
          <Item>O consentimento para cookies não essenciais pode ser revogado a qualquer tempo.</Item>
        </ul>

        <H2 id="comunicacoes">9. Comunicações e marketing</H2>
        <ul className="list-disc pl-6 space-y-2">
          <Item>Enviamos mensagens <strong>transacionais</strong> (ex.: confirmação de pedido).</Item>
          <Item>Marketing apenas com consentimento e sempre com opção de descadastro.</Item>
          <Item>Você pode solicitar cancelamento via <a href="/contato" className="underline">Contato</a> ou e-mail abaixo.</Item>
        </ul>

        <H2 id="direitos">10. Seus direitos (titular de dados)</H2>
        <ul className="list-disc pl-6 space-y-2">
          <Item>Acesso/confirmação de tratamento e informações sobre compartilhamento.</Item>
          <Item>Correção de dados incompletos, inexatos ou desatualizados.</Item>
          <Item>Anonimização, bloqueio ou eliminação de dados desnecessários/excessivos.</Item>
          <Item>Portabilidade, quando aplicável.</Item>
          <Item>Eliminação dos dados tratados com consentimento.</Item>
          <Item>Informação sobre a possibilidade de não fornecer consentimento e consequências.</Item>
          <Item>Revogação do consentimento a qualquer momento.</Item>
          <Item>Oposição a tratamentos com base em legítimo interesse.</Item>
          <Item>Revisão de decisões automatizadas.</Item>
        </ul>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify mt-3">
          Para exercer seus direitos, veja <a className="underline" href="#contato">Contato</a>. Em regra, responderemos em até <strong>15 dias</strong> (LGPD).
        </p>

        <H2 id="seguranca">11. Segurança e notificação de incidentes</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Medidas técnicas e administrativas proporcionais ao risco (ex.: criptografia em trânsito, controle de acesso, monitoramento).
          Em caso de incidente com risco/dano relevante, poderemos notificar autoridades e titulares, conforme LGPD.
        </p>

        <H2 id="retencao">12. Retenção e descarte</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Mantemos dados pelo tempo necessário às finalidades e prazos legais (ex.: fiscais). Após, eliminamos ou anonimizamos com segurança.
        </p>

        <H2 id="transferencias">13. Transferências internacionais</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Alguns fornecedores podem armazenar dados fora do Brasil; adotamos salvaguardas contratuais e práticas para garantir proteção adequada.
        </p>

        <H2 id="menores">14. Crianças e adolescentes</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Não direcionado a menores de 18. Se identificarmos dados de menor sem consentimento adequado, adotaremos medidas para exclusão.
        </p>

        <H2 id="links-terceiros">15. Links de terceiros</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Podemos exibir links para sites de terceiros. Não nos responsabilizamos por suas práticas de privacidade; leia as políticas de cada site.
        </p>

        <H2 id="contato">16. Contato do controlador / DPO</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Para dúvidas, solicitações ou exercício de direitos:
        </p>
        <ul className="list-none pl-0 mt-2 space-y-1 text-gray-700 font-MontserratRegular">
          <li>E-mail: <a href="mailto:contato@roalves.com.br" className="underline">contato@roalves.com.br</a></li>
          <li>WhatsApp: <a href="https://wa.me/55SEUNUMERO" target="_blank" rel="noreferrer" className="underline">Enviar mensagem</a></li>
          <li>Formulário: <a href="/contato" className="underline">Contato</a></li>
        </ul>

        <H2 id="mudancas">17. Mudanças nesta política</H2>
        <p className="text-gray-700 font-MontserratRegular leading-relaxed text-justify">
          Podemos atualizar esta Política para refletir ajustes operacionais, legais ou regulatórios. As alterações valem após publicação neste endereço.
        </p>
      </main>

      <WhatsApp />
      <PreFooter />
      <Footer />
    </div>
  );
}
