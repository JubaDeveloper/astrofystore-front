
export type PredioCadForm={
  "tipo": "RESIDENCIAL" | "COMERCIAL",
  "nome": string,
  "totalMoradores": number | string,
  "nomeResponsavel": string,
  "telefoneResponsavel": string,
  "emailResponsavel": string
}

export const predioCadForm:PredioCadForm = {
  "tipo": "RESIDENCIAL",
  "nome": "",
  "totalMoradores": "0",
  "nomeResponsavel": "",
  "telefoneResponsavel": "",
  "emailResponsavel": "",
}

export type EnderecoPredioForm = {
  "nome": string,
  "principal": boolean,
  "cep": string,
  "logradouro": string,
  "numero": string,
  "complemento": string,
  "bairro": string,
  "cidade": string,
  "estado": string,
  "pais": string
}

export const enderecoPredioForm = {
  "nome": "",
  "principal": true,
  "cep": "",
  "logradouro": "",
  "numero": "",
  "complemento": "",
  "bairro": "",
  "cidade": "",
  "estado": "AC",
  "pais":"" 
}

export type FiltrosPrediosListagem = {
    pagina?:number,
    quantidade?:number,
    nome?:string,
    tipo?:"RESIDENCIAL" | "COMERCIAL"
}

export type PredioInListType = {
  "id": number,
  "tipo": string,
  "nome": string,
  "status": "ativo" | "banido",
  "totalMoradores": number,
  "criadoEm":string,
  "atualizadoEm": string ,
  "endereco":EnderecoPredioForm
}

export type PredioListType = {
  nome:string,
  pagina:number,
  totalPaginas:number,
  tipo:string,
  quantidade:number,
  resultado: PredioInListType[]
}