export type FormAuth = {
	email:string,
	senha:string,
}

export type FormAuthCliente = {
	lojaId:number,
	email:string,
	senha:string,
}

export const formAuth:FormAuth = {
	email:"",
	senha:""
}

export const formAuthCLiente:FormAuthCliente = {
	lojaId: 0,
	email:"",
	senha:""
}

export type FormEsqueciSenha = {
	email:string
}

export const formEsqueciSenha:FormEsqueciSenha = {
	email:"",
}

export type FormRedefinirSenha= {
	token:string
	senha:string
}

export const FormRedefinirSenha:FormRedefinirSenha = {
	token:"",
	senha:""
}

export type CadastrarUsuario = {
	nome: string,
	email: string,
	senha: string,
	confirmarSenha: string
}

export const cadastrarUsuario:CadastrarUsuario = {
	nome: '',
	email: '',
	senha: '',
	confirmarSenha: ''
}