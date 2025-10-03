export type DevolucaoDto = {
  id: number;
  status: string;
  motivo: string;
  valor: number;
  criadoEm: string;
  produto: string;
  imagemUrl: string;
};


export type DevolucaoLojistaDto = {
    id: number;
    status: string;
    motivo: string;
    valor: number;
    criadoEm: string;
    produto: string;
    imagemUrl: string;
}

export type DevolucaoLojistaDetalhesDto = {
    id: number;
    status: string;
    motivo: string;
    detalhes: string;
    valor: number;
    criadoEm: string;
    produto: string;
    imagemUrl: string;
    cliente: {
        nome: string;
        email: string;
    };
}