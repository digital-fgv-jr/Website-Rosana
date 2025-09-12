import React, { useState } from 'react';
import { cotarFrete } from '../api/services/freteService';

// Estilos simples para organização
const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px' },
  input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
  button: { padding: '10px 15px', cursor: 'pointer' },
  error: { color: 'red', marginTop: '10px' },
  options: { marginTop: '20px' },
  option: { border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' },
  selected: { marginTop: '10px', color: 'green', fontWeight: 'bold' }
};

const CalculadoraFrete = () => {
  // Estado para os itens do "carrinho"
  const [itens, setItens] = useState([
    { tamanho_id: '', quantidade: 1 }
  ]);
  
  // Estado para o CEP e os resultados
  const [cepDestino, setCepDestino] = useState('');
  const [opcoesFrete, setOpcoesFrete] = useState([]);
  const [freteEscolhido, setFreteEscolhido] = useState(null);

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Funções para manipular os itens ---
  const handleItemChange = (index, field, value) => {
    const novosItens = [...itens];
    novosItens[index][field] = value;
    setItens(novosItens);
  };

  const handleAddItem = () => {
    setItens([...itens, { tamanho_id: '', quantidade: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  // --- Função principal para calcular o frete ---
  const handleCalcularFrete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOpcoesFrete([]);
    setFreteEscolhido(null);

    // Filtra itens vazios
    const itensValidos = itens.filter(item => item.tamanho_id && item.quantidade > 0);
    if (itensValidos.length === 0) {
      setError('Por favor, adicione pelo menos um item com ID de tamanho e quantidade.');
      setLoading(false);
      return;
    }

    try {
      const response = await cotarFrete(cepDestino, itensValidos);
      setOpcoesFrete(response.data);
    } catch (err) {
      // Pega a mensagem de erro do backend, se houver
      const errorMessage = err.response?.data?.detail || err.response?.data?.[0] || 'Ocorreu um erro ao calcular o frete.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Calculadora de Frete (Teste da API)</h2>
      <form onSubmit={handleCalcularFrete}>
        
        <h3>Itens</h3>
        {itens.map((item, index) => (
          <div key={index} style={{ ...styles.formGroup, display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ flex: 3 }}>
              <label>ID do Tamanho do Produto (UUID)</label>
              <input 
                type="text" 
                style={styles.input}
                value={item.tamanho_id}
                onChange={(e) => handleItemChange(index, 'tamanho_id', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Qtd.</label>
              <input 
                type="number" 
                min="1" 
                style={styles.input}
                value={item.quantidade}
                onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value))}
              />
            </div>
            <button type="button" onClick={() => handleRemoveItem(index)} style={styles.button}>X</button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem} style={{...styles.button, marginBottom: '20px'}}>+ Adicionar Item</button>

        <div style={styles.formGroup}>
          <label htmlFor="cep">CEP de Destino</label>
          <input
            id="cep"
            type="text"
            value={cepDestino}
            onChange={(e) => setCepDestino(e.target.value)}
            placeholder="00000-000"
            style={styles.input}
            required
          />
        </div>
        
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Calculando...' : 'Calcular Frete'}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {opcoesFrete.length > 0 && (
        <div style={styles.options}>
          <h3>Opções de Frete</h3>
          {opcoesFrete.map((opcao, index) => (
            <div key={index} style={styles.option}>
              <label>
                <input 
                  type="radio" 
                  name="frete" 
                  onChange={() => setFreteEscolhido(opcao)} 
                />
                <strong>{opcao.transportadora}</strong> - R$ {opcao.preco_frete}
                <br />
                <span>Prazo estimado: {opcao.prazo_entrega_dias} dias úteis</span>
              </label>
            </div>
          ))}
        </div>
      )}

      {freteEscolhido && (
        <div style={styles.selected}>
          Você selecionou: {freteEscolhido.transportadora} (R$ {freteEscolhido.preco_frete})
        </div>
      )}
    </div>
  );
};

export default CalculadoraFrete;