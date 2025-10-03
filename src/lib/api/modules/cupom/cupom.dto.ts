export type Cupom = {
  nome: string;
  codigo: string;
  tipoDesconto: string;
  valorDesconto: number;
  dataInicio: string;
  dataVencimento: string;
  quantidade: number;
  categoriaId: number;
  ativo: boolean;
  gastoMinimo: number;
  limiteDesconto: number;
};

export type CupomResponseDto = {
  id: number;
  nome: string;
  codigo: string;
  tipoDesconto: string;
  valorDesconto: number;
  dataInicio: string;
  dataVencimento: string;
  gastoMinimo: number;
  limiteDesconto: number;
  categoria: {
    id: number;
    nome: string;
  };
};
