import api from "$lib/api/api";
import query from "$lib/api/query";
export class DashController{

	idLoja:number = -1

	constructor(idLoja:number){
		this.idLoja = idLoja
	}
	
	async pegarGraficoPedidos(filtros:any):Promise<any>{
		return await api.get(`/restrito/loja/${this.idLoja}/relatorio/grafico/pedidos${query.searchInMemoryQuerys(filtros)	}`)
	}

	async pegarGraficoTicket():Promise<any>{
		return await api.get(`/restrito/loja/${this.idLoja}/relatorio/grafico/ticket-medio`)
	}

	async pegarClientesLista():Promise<any>{
		return await api.get(`/restrito/loja/${this.idLoja}/relatorio/grafico/principais-clientes`)
	}
	async pegarFaturamento(filtros:any):Promise<any>{
		return await api.get(`/restrito/loja/${this.idLoja}/relatorio/grafico/faturamento-por-categoria`)
	}
	async pegarEstoque():Promise<any>{
		return await api.get(`/restrito/loja/${this.idLoja}/relatorio/grafico/estoque-produtos`)
	}

	async pegarRelatoVendas():Promise<any>{
		return await api.get(`/restrito/loja/${this.idLoja}/relatorio/vendas`)
	}

	async pegarRelatoProdutos():Promise<any>{
		return await api.get(`/restrito/loja/${this.idLoja}/relatorio/produtos`)
	}



}