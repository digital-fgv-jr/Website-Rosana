/**
 * Consulta um CEP na API do ViaCEP e retorna os dados do endereço.
 *
 * @param {string} cep O CEP a ser consultado (pode conter ou não a máscara).
 * @returns {Promise<object>} Uma Promise que resolve para um objeto contendo os dados do endereço
 * ou um objeto de erro.
 */
export const consultarCep = async (cep) => {
  // 1. Limpa o CEP, removendo tudo que não for dígito.
  const cepLimpo = String(cep).replace(/\D/g, '');

  // 2. Valida se o CEP limpo possui 8 dígitos.
  if (cepLimpo.length !== 8) {
    return {
      error: true,
      message: 'Formato de CEP inválido.',
    };
  }

  // 3. Tenta buscar os dados na API.
  try {
    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
    const response = await fetch(url);
    const data = await response.json();

    // 4. Verifica se a API retornou um erro (CEP não encontrado).
    if (data.erro) {
      return {
        error: true,
        message: 'CEP não encontrado.',
      };
    }

    // 5. Retorna o objeto JSON com os dados do endereço.
    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge,
      ddd: data.ddd,
      error: false, // Adicionado para facilitar a verificação de sucesso
    };
  } catch (error) {
    // 6. Retorna um erro caso a API esteja indisponível ou ocorra um erro de rede.
    console.error('Erro ao buscar o CEP:', error);
    return {
      error: true,
      message: 'Não foi possível consultar o CEP. Tente novamente mais tarde.',
    };
  }
};