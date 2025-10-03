export type ClienteDto = {
  id: number;
  nome: string;
  status: "ATIVO" | "INATIVO";
  criadoEm: string;
  totalPedidos: number;
  quantidadeItensPedidos: number;
  clienteId:number;
};
export type ClienteDetalhadoDTO = {
  id: number;
  nome: string;
  status: "ATIVO" | "INATIVO";
  criadoEm: string;
  totalPedidos: number;
  quantidadePedidos: number;
  txDevolucao: number;
  fidelidade: "FIEL" | "OCASIONAL" | "INATIVO";
  telefone: string;
  email: string;
};

export type ClienteGastosDto = {
  relatorio: {
    [key: string]: {
      vendidos: 65;
      devolvidos: 0;
    };
  };
  totDevolvido: number;
  totEmVendas: number;
};
