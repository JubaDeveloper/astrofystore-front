export type FormCadastro = {
    nome: string,
    email: string,
    senha: string,
    aceitouTermos: boolean
}

export type FormCadastroCliente = {
    lojaId: number,
    nome: string,
    email: string,
    senha: string,
    aceitouTermos?: boolean
}

export const formCadastro:FormCadastro = {
    "nome": "",
    "email": "",
    "senha": "",
    "aceitouTermos": false
}

export const formCadastroCliente:FormCadastroCliente = {
    "lojaId": 0,
    "nome": "",
    "email": "",
    "senha": "",
    "aceitouTermos": false
}