

export type LojaCadForm = {
  "nome": string,
  "subdominio": string,
  "descricao": string
}

export const lojaCadForm = {
  nome:"",
  subdominio:"",
  descricao:""
}

export type LojaDto = {
  id: number;
  nome: string;
  dominio: string;
  descricao: string;
  status: 'ATIVO' | 'INATIVO'; // você pode ajustar os valores possíveis
  bloqueado: boolean;
  logo: string;
  personalizacao: string; // ou um objeto se preferir tipar o JSON
  url: string;
  criadoEm: string; // ISO date string
  atualizadoEm: string; // ISO date string
  bloqueadoEm: string | null; // pode ser nulo
  locacaoId: number;
  estoqueId: number;
  visibilidade:boolean;
  subdominioPersonalizado:{
    "subdominio":string,
    "ativo": boolean
  }

};

export type DataLojaDto = {
  loja: LojaDto,
  politicas: any,
  categorias: any,
  capa: string,
  logo: string,
}

export type LojaFromListaDto = {
  id: number;
  nome: string;
  dominio: string;
  descricao: string;
  status: string;
  visibilidade: boolean;
  bloqueado: boolean;
  logo: string;
  personalizacao: string;
  url: string;
  estatisticas:{
    totalClientes: number;
    totalFaturamento: number;
  }
};

export type LojaListagemDto = {
  pesquisa: string;
  status: string;
  pagina: number;
  quantidade: number;
  totalPaginas: number;
  resultado: LojaFromListaDto[];
};

