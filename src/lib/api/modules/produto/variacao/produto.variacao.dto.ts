export type ProdutoVariacaoDto = {
    id: number;
    nome: string;
    preco: number;
    desconto: number;
    ativo: boolean;
    produtoId: number;
    criadoEm: string;
    atualizadoEm: string;
    estoque:{
        id: number,
        tipoEstoque: string,
        tipoProduto: string,
        mensagem: string,
        deletado: boolean,
        deletadoEm: string | null,
        produtoId: number,
        variacaoProdutoId: string | null,
        lojaId: number,
        criadoEm: string,
        atualizadoEm: string
        estoqueItens:any[],
        estoqueBaixo:number | null
    } | null,
    valorAtributoProduto:any[];
    imagem: any;
    imagens?:any;
};
  