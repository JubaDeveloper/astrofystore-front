import api from "$lib/api/api";
import type { FormCadastro } from "./cadastro.form.svelte";
export default class CadastroController{

	async cadastrar(form:FormCadastro):Promise<any>{
		const [r,e] = await api.post("/usuario",form)
		return [r,e]
	}

	async reenviarCod(email:string):Promise<any>{
		const [r,e] = await api.put(`/usuario/confirmacao-email/reenviar?email=${email}`)
		return [r,e]
	}

	async validarEmail(email:string, token: string):Promise<any>{
		const [r,e] = await api.post(`/usuario/confirmacao-email/validar?email=${email}&token=${token}`)
		return [r,e]
	}

	async cadastroCliente(body:{
		"lojaId": number,
		"nome": string,
		"email": string,
		"senha": string
	}){
		return api.post(`/cliente/auth/cadastro`, body)
	}
}