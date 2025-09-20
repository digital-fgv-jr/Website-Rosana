export interface EnderecoViaCepResult {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  ibge: string;
  ddd: string;
  error: false;
}

export interface ErroCep {
  error: true;
  message: string;
}

export interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface ErroViaCEP {
  erro: boolean;
}

export type RespostaViaCEP = EnderecoViaCEP | ErroViaCEP;
export type ResultadoConsultaCep = EnderecoViaCepResult | ErroCep;