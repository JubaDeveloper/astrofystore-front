export type RelatorioPedidoDto = {
  totEmEstoque: 345064;
  totEmVendas: 581;
  totDevolvido: 0;
  relatorio: {
    [key: string]: {
      vendidos: 65;
      devolvidos: 0;
    };
  };
};



export type VendasDashDto = {
  ultimoCancelamento:Order,
  ultimosPedidos:Order[]
}

type Order = {
  nomeCliente: string;
  fidelidadeCliente: "FIEL" | "NOVO" | "INATIVO";
  itens: string;
  criadoEm: string;
}

type ReportItem = {
  tipo: "NOVO" | "FIEL";
  qtdPedidos: number;
  faturado: number;
};

type MonthlyReport = {
  ano: number;
  mesIndex: number;
  relatorio: ReportItem[];
};

export type TicketDashDto = {
  meses:MonthlyReport[];
  ticketMedioFiel:number;
  ticketMedioNovo:number;
} 