type Denuncia = {
  id: number;
  descricao: string;
  cliente: {
    clienteId: number;
    nome: string;
  };
};

type Imagem = {
  id: number;
  nome: string;
  alt_text: string;
  ordem: number;
  produtoId: number;
  variacaoProdutoId: number | null;
  arquivoId: number;
  criadoEm: string;
  atualizadoEm: string;
};

type Produto = {
  nome: string;
  imagens: Imagem[];
  produtoId: number;
};

type Loja = {
  nome: string;
  url: string | null;
  logo: string;
  lojaId: number;
};

export type DenunciaDto = {
  id: number;
  loja: Loja;
  produto: Produto;
  status: string;
  motivo: string;
  criadoEm: string;
  prazoResposta: string | null;
  notificadoEm: string | null;
  denuncias: Denuncia[];
};

export type DenunciaDetalhadaDto = {
  id: number;
  loja: {
    lojaId: number;
    nome: string;
    url: string | null;
    logo: string;
    bloqueado:boolean;
    bloqueadoEm:string;
    quantidadeDenunciasAprovadas: number;
    subdominioPersonalizado:{
      subdominio:string
    }
  };
  denuncias: {
    denunciaId: number;
    descricao: string;
    cliente: {
      clienteId: number;
      nome: string;
    };
    criadoEm: string;
    anexos: {
      nome:string,
      tipo:string,
      url:string
    }[];
  }[];
  produto: {
    produtoId: number;
    nome: string;
    imagens: {
      id: number;
    }[];
    categoria: string;
    urlAmigavel:string;
  };
  status: DENUNCIA_STATUS_ENUM;
  motivo: "PRODUTOS_ILEGAIS" | "OUTRO" | "FRAUDE" | "VIOLACAO_POLITICA";
  resposta: string | null;
  anexos: {
    anexoId: number;
    url: string;
    nome:string;
    tipo:string;    
  }[];
  criadoEm: string;
  lojista: {
    lojistaId: number;
    nome: string;
    quantidadeLojas: number;
  };
  evidencias: {
    anexoId: number;
    url: string;
    nome:string;
    tipo:string;
  }[];
};

export type DenunciaLojistaDto = {
  id: number;
  loja: {
    nome: string;
    url: string | null;
    logo: string;
    lojaId: number;
  };
  produto: {
    nome: string;
    imagens: {
      id: number;
      nome: string;
      alt_text: string;
      ordem: number;
      produtoId: number;
      variacaoProdutoId: number | null;
      arquivoId: number;
      criadoEm: string;
      atualizadoEm: string;
    }[];
    produtoId: number;
  };
  status: string;
  motivo: string;
  criadoEm: string;
  prazoResposta: number;
  notificadoEm: string;
};

export type DenunciaLojistaDetalhesDto = {
  id: number;
  status: string;
  mensagem: string;
  prazoResposta: number;
  anexos: {
    arquivo:{
      url:string;
      nome:string;
      tipo:string  
    }
  }[];
  produto: {
    categoria: string;
    produtoId: number;
  };
  notificadoEm: string;
  resposta: null | any;
};
export const DenunciaStatusDto = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "NOTIFICADO", label: "Notificado" },
  { value: "ARQUIVADO", label: "Arquivado" },
  { value: "RESOLVIDO", label: "Resolvido" },
  { value: "RESPONDIDO", label: "Respondido" },
  { value: "SEM_RESPOSTA", label: "Sem Resposta" },
  { value: "BANIDO", label: "Banido" },
];

export const DenunciaStatusLojistaDto = [
  { value: "NOTIFICADO", label: "Notificado" },
  { value: "RESOLVIDO", label: "Resolvido" },
  { value: "RESPONDIDO", label: "Respondido" },
  { value: "SEM_RESPOSTA", label: "Sem Resposta" },
];
export enum DENUNCIA_STATUS_ENUM {
  PENDENTE = "PENDENTE",
  NOTIFICADO = "NOTIFICADO",
  ARQUIVADO = "ARQUIVADO",
  RESOLVIDO = "RESOLVIDO",
  RESPONDIDO = "RESPONDIDO",
  SEM_RESPOSTA = "SEM_RESPOSTA",
  BANIDO = "BANIDO",
}

export const DenunciaMotivosDto = [
  {
    value: "PRODUTOS_ILEGAIS",
    label: "Produtos ilegais",
  },
  {
    value: "DIREITOS_AUTORAIS",
    label: "Direitos autorais",
  },
];
