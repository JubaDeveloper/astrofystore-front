export type ProdutosForm = {
  "nome": string,
  "preco"?: number | null,
  "desconto"?: number,
  "restricaoMaioridade"?: boolean,
  "descricao"?: string,
  "sku"?: string,
  "marca"?: string,
  "modelo"?: string,
  "peso"?: number,
  "altura"?: number,
  "largura"?: number,
  "profundidade"?: number,
  "urlAmigavel"?: string,
  "ativo"?: boolean,
  "lojaId"?:number,
  "categoriaId"?: number | undefined,
  "tipo"?: 'simples'|'variado',
}

export type FiltrosListarProdutos = {
  pesquisa?:string,
  quantidade?:number,
  pagina?:number,
  categoriaId?: number
}

export type Categoria = {
  descricao:string,
  id:number,
  nome:string,
  slug: string,
  selected?:boolean
}

export type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque:null | {
    id:number,
    [key:string]:any
  };
  desconto: number;
  restricaoMaioridade: boolean;
  descricao: string;
  sku: string;
  marca: string;
  modelo: string;
  peso: number;
  altura: number;
  largura: number;
  profundidade: number;
  urlAmigavel: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  locacaoId: number;
  categoria: any;
  variacoes: any[];
  selected?:boolean;
  imagensId?:any[];
  tipo?:'simples'|'variado'|null
};

export type imagemId = {
  id: number,
  url: string,
  ordem: number,
  // alt_text: string,
  // nome: string
}

type estoque =  {
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
  atualizadoEm: string,
  quantidade?: number
}

export type variacao = {
    id: number,
    nome: string,
    valor?:string,
    preco: number | null,
    desconto: number | null,
    ativo: boolean,
    produtoId: number,
    estoque: any | null,
    valorAtributoProduto: any[],
    criadoEm: string,
    atualizadoEm: string
};

type Categorias = {
  id: number;
  nome: string;
}

export type ProdutoDetalhado = {
  id: number;
  nome: string;
  preco: number;
  desconto: number | null;
  descricao: string;
  sku: string | null;
  urlAmigavel: string;
  ativo: boolean;
  lojaId: number;
  criadoEm: string;
  atualizadoEm: string;
  categoria: Categorias;
  estoque: estoque | null;
  variacoes: variacao[] | null;
  imagens: imagemId[];
  quantidadeAvaliacoes: number;
  mediaAvaliacao: number;
  atributos: atributo[];
};


type atributo = {
  id: number,
  nome: string,
  valores: {id:number,valor:string}[],
  estoque:{
    quantidade: number
  }
}

export type Banners = {
    id: number,
    url: string,
    exibicao: boolean,
    tipo: string,
    ordem: number,
    uri: string,
}

