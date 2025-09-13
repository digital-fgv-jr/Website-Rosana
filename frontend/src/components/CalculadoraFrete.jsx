// frontend/src/components/CalculadoraFrete.jsx

import React, { useState, useEffect } from 'react';
import { getProdutos } from '../api/services/produtoService'; // Para buscar os produtos
import { cotarFrete } from '../api/services/freteService';   // Para cotar o frete

// Estilos simples para organização (ajuste com Tailwind se preferir)
const styles = {
    container: { padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'sans-serif' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
    button: { padding: '10px 15px', cursor: 'pointer', marginRight: '10px', border: '1px solid #ccc', borderRadius: '5px' },
    error: { color: 'red', marginTop: '10px' },
    options: { marginTop: '20px' },
    option: { border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' },
    selected: { marginTop: '10px', color: 'green', fontWeight: 'bold' },
    vitrine: { border: '1px solid #eee', padding: '15px', marginBottom: '20px', maxHeight: '400px', overflowY: 'auto' },
    produto: { marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }
};

const CalculadoraFrete = () => {
    // --- ESTADOS ---
    const [produtosApi, setProdutosApi] = useState([]); // Para guardar os produtos da API
    const [itens, setItens] = useState([]); // Itens selecionados para cotação
    const [cepDestino, setCepDestino] = useState('');
    const [opcoesFrete, setOpcoesFrete] = useState([]);
    const [freteEscolhido, setFreteEscolhido] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingProdutos, setLoadingProdutos] = useState(true);
    const [error, setError] = useState('');

    // --- LÓGICA PARA BUSCAR PRODUTOS NA INICIALIZAÇÃO ---
    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await getProdutos();
                setProdutosApi(response.data);
            } catch (err) {
                setError('Falha ao carregar produtos da API.');
                console.error(err);
            } finally {
                setLoadingProdutos(false);
            }
        };
        fetchProdutos();
    }, []); // Roda apenas uma vez quando o componente é montado

    // --- FUNÇÕES ---
    const handleAddItem = (tamanhoProduto, produto) => {
        const itemExistente = itens.find(item => item.tamanho_id === tamanhoProduto.id);
        if (itemExistente) {
            const novosItens = itens.map(item =>
                item.tamanho_id === tamanhoProduto.id
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            );
            setItens(novosItens);
        } else {
            setItens([...itens, {
                tamanho_id: tamanhoProduto.id,
                quantidade: 1,
                nome: `${produto.nome} (Tamanho: ${tamanhoProduto.tamanho.valor})`
            }]);
        }
    };

    const handleRemoveItem = (tamanho_id) => {
        setItens(itens.filter(item => item.tamanho_id !== tamanho_id));
    };

    const handleCalcularFrete = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOpcoesFrete([]);
        setFreteEscolhido(null);

        const itensParaCotar = itens.map(item => ({
            tamanho_id: item.tamanho_id,
            quantidade: item.quantidade
        }));

        if (itensParaCotar.length === 0) {
            setError('Por favor, adicione pelo menos um item da vitrine.');
            setLoading(false);
            return;
        }

        try {
            const response = await cotarFrete(cepDestino, itensParaCotar);
            setOpcoesFrete(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.[0] || 'Ocorreu um erro ao calcular o frete.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* SEÇÃO DA VITRINE DE PRODUTOS */}
            <h2>Vitrine de Produtos</h2>
            <div style={styles.vitrine}>
                {loadingProdutos ? <p>Carregando produtos...</p> : produtosApi.map(produto => (
                    <div key={produto.id} style={styles.produto}>
                        <strong>{produto.nome}</strong> - R$ {produto.preco}
                        <div>
                            <p style={{ fontSize: '14px', margin: '5px 0' }}>Tamanhos disponíveis:</p>
                            {produto.tamanhos.map(tamanhoProduto => (
                                <button
                                    key={tamanhoProduto.id}
                                    onClick={() => handleAddItem(tamanhoProduto, produto)}
                                    style={{ ...styles.button, fontSize: '12px' }}
                                >
                                    Adicionar Tam. {tamanhoProduto.tamanho.valor}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* SEÇÃO DA CALCULADORA */}
            <h2>Calculadora de Frete</h2>
            <form onSubmit={handleCalcularFrete}>
                <h3>Itens Selecionados</h3>
                {itens.length > 0 ? itens.map((item, index) => (
                    <div key={item.tamanho_id} style={{ marginBottom: '10px' }}>
                        <span>{item.nome} - Qtd: {item.quantidade}</span>
                        <button type="button" onClick={() => handleRemoveItem(item.tamanho_id)} style={{ marginLeft: '10px', color: 'red', border: '1px solid red' }}>Remover</button>
                    </div>
                )) : <p>Nenhum item adicionado para cotação.</p>}
                
                <div style={styles.formGroup}>
                    <label htmlFor="cep">CEP de Destino</label>
                    <input id="cep" type="text" value={cepDestino} onChange={(e) => setCepDestino(e.target.value)} required style={styles.input} />
                </div>
                
                <button type="submit" disabled={loading || itens.length === 0} style={styles.button}>
                    {loading ? 'Calculando...' : 'Calcular Frete'}
                </button>
            </form>

            {/* SEÇÃO DE RESULTADOS */}
            {error && <p style={styles.error}>{error}</p>}

            {opcoesFrete.length > 0 && (
                <div style={styles.options}>
                    <h3>Opções de Frete</h3>
                    {opcoesFrete.map((opcao, index) => (
                         <div key={index} style={styles.option}>
                            <label>
                                <input type="radio" name="frete" onChange={() => setFreteEscolhido(opcao)} />
                                <strong>{opcao.transportadora}</strong> - R$ {opcao.preco_frete}
                                <br/>
                                <span style={{fontSize: '14px'}}>Prazo estimado: {opcao.prazo_entrega_dias} dias (Aprox. {new Date(opcao.data_entrega_estimada).toLocaleDateString()})</span>
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