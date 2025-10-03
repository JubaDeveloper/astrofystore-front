export type ItemCarrinhoPutDto = {
  produtoId?: number;
  variacaoProdutoId?: number;
  quantidade: number;
  uuid?: string;
};

export type ItemCarrinhoDto = {
  id: number;
  carrinhoId: number;
  variado: boolean;
  quantidade: number;
  produtoId: number;
  produto: {
    id: number;
    nome: string;
    preco: number;
    desconto: number;
    categoria:{
      nome:string
    }
  };
  variacaoProdutoId: number;
  variacaoProduto: {
    id: number;
    nome: string;
    preco: number;
    desconto: number;
    produto:{
      categoria:{
        nome:string
      }  
    }
  };
  criadoEm: string;
  atualizadoEm: string;
};

export type CarrinhoResponseDto = {
  message: string;
  statusCode: number;
  data: {
    id: number;
    uuid: string;
    status: string;
    lojaId: number;
    clienteId: number;
    criadoEm: string;
    atualizadoEm: string;
    itens: ItemCarrinhoDto[];
    totalItens: number;
    valorTotal: number;
  };
};
