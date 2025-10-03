export type CompraDto = {
  id: number;
  status: string;
  total: number;
  criadoEm: string;
  itens: {
    id: number;
    nome: string;
    imagem: string;
  }[];
};

export type CompraDetalhadaDto = {
  id: number;
  status: string;
  criadoEm: string;
  preco: number;
  desconto: number | null;
  total: number;
  historico: {
    titulo: string;
    descricao: string | null;
    criadoEm: string;
  }[];
  itens: {
    id: number;
    nome: string;
    preco: number;
    desconto: number | null;
    total: number;
    imagem: string;
    visualizado:boolean
    devolvido:boolean
  }[];
};
