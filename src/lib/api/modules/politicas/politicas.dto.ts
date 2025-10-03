
export type PoliticaFormDto = {
    nome:string,
    conteudo:string
}

export type PoliticaDto={
    "id": number,
    "nome": string,
    "slug": string,
    "conteudo": string,
    "ativo": boolean,
    "versao": number,
    "criadoEm": string,
    "atualizadoEm": string
}

export type PoliticaListagemDto={
    "pagina": number,
    "quantidade": number,
    "totalPaginas": number,
    "total": number,
    "politicas": PoliticaDto[]
}