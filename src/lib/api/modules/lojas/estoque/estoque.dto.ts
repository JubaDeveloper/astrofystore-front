export type FormDeEstoqueSimples={
    nome:string,
    status:string,
    preco:number,
    tipo:"lista" | "mensagem"
    estoqueBaixo:number,
    itensEstoque:string[],
    mensagem:string
}

type EstoqueItem = {
    id: number;
    conteudo: string;
    ativo: boolean;
  };
  
  type Produto = {
    id: number;
    nome: string;
    preco: number;
    precoReferencia:number;
    desconto: number | null;
  };
  
export type InfoEstoqueDto = {
    id: number;
    tipoEstoque: string;
    tipoProduto: string;
    mensagem: string;
    estoqueItens: EstoqueItem[];
    produto: Produto;
    variacaoProduto: null;
    criadoEm: string;
    atualizadoEm: string;
    lojaId: number;
};
  