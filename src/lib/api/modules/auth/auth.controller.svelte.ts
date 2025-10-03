import api from "$lib/api/api";
import type { AxiosError } from "axios";
import type { CadastrarUsuario, FormAuth, FormEsqueciSenha, FormRedefinirSenha } from "./auth.form.svelte";

export default class AuthController{

	async login(form:FormAuth):
	Promise<[{id:number,locacaoId:any,nome:string,perfil:string,permissoes:string[],token:string},any]>{

		const [r,e] = await api.post("/auth/login",form)

		return [r ? r.data : null,e]
	}

	async enviarEmailRecuperacao(form:FormEsqueciSenha):Promise<[any,AxiosError]>{
		const [r,e] = await api.post(`/auth/esqueci-senha/${form.email}`)
		return [r,e]
	}
	
	async redefinirSenha(form:FormRedefinirSenha):Promise<[any,AxiosError]>{
		const [r,e] = await api.post(`/auth/redefinir-senha`,form)
		return [r,e]
	}

	async redefinirSenhaCliente(form:FormRedefinirSenha):Promise<[any,AxiosError]>{
		const [r,e] = await api.post(`/cliente/auth/redefinir-senha`,form)
		return [r,e]
	}

	async cadastrar(form: CadastrarUsuario){
		const [r,e] = await api.post(`/usuario`, form)
		return [r,e]
	}

	async loginCliente(body: {
		"lojaId": number,
		"email": string,
		"senha": string
	}){
		return api.post(`/cliente/auth/login`, body)
	}

	async esqueciSenha(body:{
		"lojaId": number,
  	"email": string
	}){
		return api.post(`/cliente/auth/esqueci-senha`, body)
	}
}