import React, { useState, useEffect } from 'react';
import { getLojas } from '../api/services/lojaService';

function CalculadoraFrete() {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar os dados da API
    const fetchLojas = async () => {
      try {
        const response = await getLojas();
        setLojas(response.data); // Armazena a lista de lojas no estado
      } catch (err) {
        setError('Falha ao buscar dados da API.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLojas();
  }, []); // O array vazio [] faz com que isso rode apenas uma vez, quando o componente monta

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <h1>Lojas Disponíveis</h1>
      <ul>
        {lojas.length > 0 ? (
          lojas.map(loja => (
            <li key={loja.id}>{loja.apelido}</li>
          ))
        ) : (
          <li>Nenhuma loja encontrada.</li>
        )}
      </ul>
    </div>
  );
}

export default CalculadoraFrete;