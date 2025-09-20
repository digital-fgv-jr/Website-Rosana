import { EnderecoViaCepResult, ErroCep, ResultadoConsultaCep, EnderecoViaCEP, RespostaViaCEP } from "./interfaces/enderecoCepInterfaces"

export const consultarCep = async (cep: string): Promise<{ data: ResultadoConsultaCep }> => {
  // Validação do CEP
  const cepLimpo: string = String(cep).replace(/\D/g, '');
  if (cepLimpo.length !== 8) {
    return {data: {
      error: true,
      message: 'Formato de CEP inválido.',
    } as ErroCep}
  }

  // Busca na API
  try {
    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erro na requisição à API ViaCEP');
    }

    const data = (await response.json()) as RespostaViaCEP;

    if ('erro' in data && data.erro) {
      return {data: {
      error: true,
      message: 'CEP não encontrado.',
      } as ErroCep}
    }

    const enderecoData = data as EnderecoViaCEP;
    return {data: {
      cep: enderecoData.cep,
      logradouro: enderecoData.logradouro,
      bairro: enderecoData.bairro,
      cidade: enderecoData.localidade,
      uf: enderecoData.uf,
      ibge: enderecoData.ibge,
      ddd: enderecoData.ddd,
      error: false,
    } as EnderecoViaCepResult}
  } catch (error) {
    console.error('Erro ao buscar o CEP:', error);
    return {data: {
      error: true,
      message: 'Não foi possível consultar o CEP. Tente novamente mais tarde.',
    } as ErroCep}
  }
};